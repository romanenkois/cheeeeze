import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { chessBoardDefault, chessBoardTesting } from './data';
import { MoveValidators } from './move.validators';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private moveValidator: MoveValidators = inject(MoveValidators);

  private readonly $chessBoard: WritableSignal<any> = signal(chessBoardDefault);
  private setChessBoard(chessBoard: any) {
    this.$chessBoard.set(chessBoard);
  }
  public getChessBoard() {
    return this.$chessBoard();
  }
  public getCellOnChessBoard(coordinates: [number, number]) {
    return this.$chessBoard()[coordinates[0]][coordinates[1]];
  }

  public checkIfTherePiece(coordinates: [number, number]): boolean {
    return this.moveValidator.checkIfTherePiece(coordinates, this.getChessBoard());
  }
  // public getPiecePossibleMoves(coordinates: [number, number]): Array<[number, number]> {
  //   return this.moveValidator.getPieceAllValidMoves(coordinates, this.getChessBoard()[coordinates[0]][coordinates[1]],  );
  // }


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

    if (!this.moveValidator.validatePieceMove(from, to, chessBoard)) {
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
