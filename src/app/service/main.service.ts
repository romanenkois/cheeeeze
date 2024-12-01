import { Injectable, signal, WritableSignal } from '@angular/core';
import { chessBoardDefault, chessBoardTesting } from './data';
import { chessField, chessPiece } from './models';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private readonly $chessBoard: WritableSignal<any> = signal(chessBoardTesting);
  private setChessBoard(chessBoard: any) {
    this.$chessBoard.set(chessBoard);
  }
  public getChessBoard() {
    return this.$chessBoard();
  }

  checkIfTherePiece(coordinates: [number, number]): boolean {
    let chessBoard = this.getChessBoard();

    if (chessBoard[coordinates[0]][coordinates[1]].piece != 'empty') {
      return true;
    }
    return false;
  }

  getPieceAllPosibleMoves(
    staringPosition: [number, number],
    piece: chessField
  ): Array<[number, number]> {
    let posibleMovesCoordinates: Array<[number, number]> = [];
    let posibleMovesPatterns = {
      straight: false,
      diagonaly: false,
    };

    let XLenth = 8;
    let YLenth = 8;

    if (piece.piece == 'Rook') {
      posibleMovesPatterns.straight = true;
    }
    if (piece.piece == 'Bishop') {
      posibleMovesPatterns.diagonaly = true;
    }
    if (piece.piece == 'Queen') {
      posibleMovesPatterns.straight = true;
      posibleMovesPatterns.diagonaly = true;
    }

    if (posibleMovesPatterns.straight) {
      for (let i = 0; i < YLenth; i++) {
        posibleMovesCoordinates.push([i, staringPosition[1]]);
      }
      for (let i = 0; i < XLenth; i++) {
        posibleMovesCoordinates.push([staringPosition[0], i]);
      }
    }
    if (posibleMovesPatterns.diagonaly) {
      let firstDiagonalPoint: [number, number] = [
        staringPosition[0] - staringPosition[1],
        0,
      ];
      let secondDiagonalPoint: [number, number] = [
        0,
        staringPosition[0] + staringPosition[1],
      ];

      console.log(firstDiagonalPoint, secondDiagonalPoint);

      for (let i = 0; i < XLenth; i++) {
        // check, so piece cannt noclip out of board
        if (firstDiagonalPoint[0] + i < YLenth) {
          posibleMovesCoordinates.push([firstDiagonalPoint[0] + i, i]);
        }
      }

      for (let i = 0; i < XLenth; i++) {
        posibleMovesCoordinates.push([i, secondDiagonalPoint[1] - i]);
      }
    }

    console.log(posibleMovesCoordinates);
    return posibleMovesCoordinates;
  }

  getPieceAllValidMoves() {}

  validatePieceMove(from: [number, number], to: [number, number]): boolean {
    let chessBoard = this.getChessBoard();

    let posibleMoves = this.getPieceAllPosibleMoves(
      from,
      chessBoard[from[0]][from[1]] // piece object
    );
    let isValidMove = posibleMoves.find((move: [number, number]) => {
      return move[0] == to[0] && move[1] == to[1];
    });
    // console.log('pm', posibleMoves);
    // console.log('to', to);

    // console.log('is', isValidMove);

    return isValidMove ? true : false; //couse could be undefined lmaooooo
  }

  validateMove(
    from: [number, number],
    to: [number, number],
    ruleset: string
  ): boolean {
    let chessBoard = this.getChessBoard();
    let firstPiece = chessBoard[from[0]][from[1]];
    let secondPiece = chessBoard[to[0]][to[1]];

    if (
      (firstPiece.piece == 'empty' ||
        firstPiece.faction == secondPiece.faction) &&
      ruleset == 'classic'
    ) {
      return false;
    }

    if (!this.validatePieceMove(from, to)) {
      return false;
    }

    return true;
  }

  movePiece(from: [number, number], to: [number, number]) {
    let chessBoard = this.getChessBoard();

    let firstPiece = chessBoard[from[0]][from[1]];
    let secondPiece = chessBoard[to[0]][to[1]];
    console.log(firstPiece, secondPiece);

    if (!this.validateMove(from, to, 'classic')) {
      return;
    }

    // if valid, move piece
    chessBoard[to[0]][to[1]] = firstPiece;
    chessBoard[from[0]][from[1]] = {
      piece: 'empty',
      faction: 'neutral',
    };
    this.setChessBoard(chessBoard);
  }
}
