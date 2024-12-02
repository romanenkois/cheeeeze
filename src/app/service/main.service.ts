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

    if (
      chessBoard[coordinates[0]][coordinates[1]].piece &&
      chessBoard[coordinates[0]][coordinates[1]].piece != 'empty'
    ) {
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

    // console.log(posibleMovesCoordinates);
    return posibleMovesCoordinates;
  }

  getPieceAllValidMoves(
    from: [number, number],
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
      // to the top of piece
      if (from[0] > 0) {
        for (let i = from[0] - 1; i > -1; i--) {
          if (this.checkIfTherePiece([i, from[1]])) {
            break;
          }
          posibleMovesCoordinates.push([i, from[1]]);
        }
      }
      // to the right of piece
      if (from[1] + 1 < XLenth) {
        for (let i = from[1] + 1; i < XLenth; i++) {
          if (this.checkIfTherePiece([from[0], i])) {
            break;
          }
          posibleMovesCoordinates.push([from[0], i]);
        }
      }
      // to the bottom of piece
      if (from[0] + 1 < YLenth) {
        for (let i = from[0] + 1; i < YLenth; i++) {
          if (this.checkIfTherePiece([i, from[1]])) {
            break;
          }
          posibleMovesCoordinates.push([i, from[1]]);
        }
      }
      // to the right of piece
      if (from[1] > 0) {
        for (let i = from[1] - 1; i > -1; i--) {
          if (this.checkIfTherePiece([from[0], i])) {
            break;
          }
          posibleMovesCoordinates.push([from[0], i]);
        }
      }
    }
    if (posibleMovesPatterns.diagonaly) {
      // to the top right diagonal
      if (from[0] > -1 && from[1] + 1 < XLenth) {
        let startingPoint: [number, number] = [from[0] - 1, from[1] + 1];
        while (
          startingPoint[0] > -1 &&
          startingPoint[1] < XLenth &&
          !this.checkIfTherePiece(startingPoint)
        ) {
          posibleMovesCoordinates.push([startingPoint[0], startingPoint[1]]);
          startingPoint[0] -= 1;
          startingPoint[1] += 1;
        }
      }
      // to the bottom right diagonal
      if (from[0] + 1 < YLenth && from[1] + 1 < XLenth) {
        let startingPoint: [number, number] = [from[0] + 1, from[1] + 1];
        while (
          startingPoint[0] < YLenth &&
          startingPoint[1] < XLenth &&
          !this.checkIfTherePiece(startingPoint)
        ) {
          posibleMovesCoordinates.push([startingPoint[0], startingPoint[1]]);
          startingPoint[0] += 1;
          startingPoint[1] += 1;
        }
      }
      // to the bottom left diagonal
      if (from[0] + 1 < YLenth && from[1] > -1) {
        let startingPoint: [number, number] = [from[0] + 1, from[1] - 1];
        console.log(startingPoint);
        while (
          startingPoint[0] < YLenth &&
          startingPoint[1] > -1 &&
          !this.checkIfTherePiece(startingPoint)
        ) {
          posibleMovesCoordinates.push([startingPoint[0], startingPoint[1]]);
          startingPoint[0] += 1;
          startingPoint[1] -= 1;
        }
      }
      // to the top left diagonal
      if (from[0] - 1 > -1 && from[1] - 1 > -1) {
        let startingPoint: [number, number] = [from[0] - 1, from[1] -1]
        while (
          startingPoint[0] > -1 &&
          startingPoint[1] > -1 &&
          !this.checkIfTherePiece(startingPoint)
        ) {
          posibleMovesCoordinates.push([startingPoint[0], startingPoint[1]])
          startingPoint[0] -= 1;
          startingPoint[1] -= 1;
        }
      }
    }

    // console.log(posibleMovesCoordinates);
    return posibleMovesCoordinates;
  }

  validatePieceMove(from: [number, number], to: [number, number]): boolean {
    let chessBoard = this.getChessBoard();
    let posibleMoves = this.getPieceAllValidMoves(
      from,
      chessBoard[from[0]][from[1]]
    );
    console.log(111, posibleMoves);
    let isValidMove = posibleMoves.find((move: [number, number]) => {
      return move[0] == to[0] && move[1] == to[1];
    });

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
