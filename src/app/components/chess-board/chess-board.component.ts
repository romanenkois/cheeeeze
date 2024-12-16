import {
  Component,
  computed,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';
import { ChessFieldComponent } from '../chess-field/chess-field.component';
import { CommonModule } from '@angular/common';
import { ChessGame } from 'app/shared/chess-engine/chess.class';

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule, ChessFieldComponent],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.scss',
})
export class ChessBoardComponent {
  @Input() chessGame!: ChessGame;

  playerFaction = computed(() => this.chessGame.getPlayerFaction());
  flipBoard = computed(() => {
    return this.playerFaction() == 'white' ? true : false;
  });
  chessBoard = computed(() => this.chessGame.getChessBoard());
  chessBoardToShow = computed(() =>{
    if (this.flipBoard()) {
      return JSON.parse(JSON.stringify(this.chessBoard().map(row => row.reverse()).reverse()));
    }
    return JSON.parse(JSON.stringify(this.chessBoard()));
  })
  factionTurn = computed(() => this.chessGame.getTurn());
  gameStatus = computed(() => this.chessGame.getGameStatus());

  showIndexes: WritableSignal<boolean> = signal(true);
  showRealIndexes: WritableSignal<boolean> = signal(true);

  firstPosition: [number, number] | undefined | null;
  secondPosition: [number, number] | undefined;

  possibleMoves: Array<[number, number]> | undefined;
  possibleAttacks: Array<[number, number]> | undefined;

  // like, flips the indexes, so like REAL index of chessboard will be assigned to the field
  positionToPass(coordinates: [number, number]): [number, number] {
    if (this.flipBoard()) {
      return [
        (this.chessBoard().length - 1) - coordinates[0],
        (this.chessBoard()[
          (this.chessBoard().length - 1) - coordinates[0]
        ].length -1) - coordinates[1]
      ];
    }
    return [coordinates[0], coordinates[1]];
  }

  // flips only
  positionToShow(coordinates: [number, number]): [number, number] {
    if (this.flipBoard()) {
      return [(this.chessBoard().length - 1) - coordinates[0], coordinates[1]];
    }
    return [
      coordinates[0],
      (this.chessBoard()[
        (this.chessBoard().length - 1) - coordinates[0]
      ].length -1) - coordinates[1]
    ];
  }

  getRowFocusStatus(coordinates: [number, number]) {
    let fp = this.firstPosition ? [this.firstPosition[0], this.firstPosition[1]] : null;
    if (this.flipBoard()) {
      fp = this.firstPosition
        ? [
          (this.chessBoard().length - 1) - this.firstPosition[0],
          (this.chessBoard()[
            (this.chessBoard().length - 1) - this.firstPosition[0]
          ].length - 1 ) - this.firstPosition[1]
        ]
        : null;
    }
    // if the piece on field is selected
    if (
      fp &&
      fp[0] == coordinates[0] &&
      fp[1] == coordinates[1]
    ) {
      console.log('stat',coordinates)
      return 'selected';
    }
    // if it is possible to move piece in here
    if (this.possibleMoves != undefined) {
      const rowToBeMoved = this.possibleMoves.find((move: [number, number]) => {
        return move[0] == coordinates[0] && move[1] == coordinates[1];
      });
      if (rowToBeMoved) {
        return 'toBeMoved';
      }
    }
    // if piece can attack this field
    if (this.possibleAttacks != undefined) {
      const rowToBeAttacked = this.possibleAttacks.find(
        (move: [number, number]) => {
          return move[0] == coordinates[0] && move[1] == coordinates[1];
        }
      );
      if (rowToBeAttacked) {
        return 'toBeAttacked';
      }
    }
    return null;
  }

  movePiece(coordinates: [number, number]) {
    console.log('cc', coordinates)
    console.log(this.chessBoard()[coordinates[0]][coordinates[1]])
    // if we already have a piece selected
    if (this.firstPosition) {
      if (coordinates == this.firstPosition) {
        this.firstPosition = undefined;

        this.possibleMoves = undefined;
        this.possibleAttacks = undefined;
        return;
      }
      this.secondPosition = this.positionToPass(coordinates);

      this.chessGame.movePiece(this.positionToPass(this.firstPosition), this.positionToPass(this.secondPosition));

      this.firstPosition = undefined;
      this.secondPosition = undefined;

      this.possibleMoves = undefined;
      this.possibleAttacks = undefined;
      console.log("moved?")
    }
    // if none of piece is selected
    else if (this.chessGame.checkIfTherePiece(coordinates)) {
      this.firstPosition = this.positionToPass(coordinates);
      this.possibleMoves = this.chessGame.getPiecePossibleMoves(
        coordinates
      );
      this.possibleAttacks = this.chessGame.getPiecePossibleAttacks(
        coordinates
      );
      console.log('possibleMoves', this.possibleMoves);
      console.log('possibleAttacks', this.possibleAttacks);
    }
  }
}
