import { Injectable } from '@angular/core';
import { chessBoardDefault } from './data';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private chessBoard = chessBoardDefault;

  getChessBoard() {
    return this.chessBoard;
  }

  movePiece(from: [number, number], to: [number, number]) {
    // console.log(this.chessBoard[from[0]][from[1]])
    let firstPiece = this.chessBoard[from[0]][from[1]];
    let secondPiece = this.chessBoard[to[0]][to[1]];
    console.log(firstPiece, secondPiece);

    if (
      firstPiece.piece == 'empty' ||
      firstPiece.faction == secondPiece.faction
    ) {
      return;
    }

    this.chessBoard[to[0]][to[1]] = firstPiece;
    this.chessBoard[from[0]][from[1]] = {
      piece: 'empty',
      faction: 'neutral',
    };
  }
}
