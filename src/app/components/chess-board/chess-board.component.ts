import {
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { ChessFieldComponent } from '../chess-field/chess-field.component';
import { CommonModule } from '@angular/common';
import { MainService } from '../../service/main.service';

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule, ChessFieldComponent],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.scss',
})
export class ChessBoardComponent {
  mainService: MainService = inject(MainService);
  chessGame = this.mainService.getChessGame('123');

  playerFaction = computed(() => this.chessGame.getPlayerFaction());
  flipBoard = computed(() => {
    return this.playerFaction() == 'white' ? true : false;
  });
  chessBoard = computed(() => {
    if (this.flipBoard()) {
      return this.chessGame.getChessBoard().reverse();
    }
    return this.chessGame.getChessBoard();
  });
  factionTurn = computed(() => this.chessGame.getTurn());
  gameStatus = computed(() => this.chessGame.getGameStatus());

  showIndexes: WritableSignal<boolean> = signal(true);

  firstPosition: [number, number] | undefined | null;
  secondPosition: [number, number] | undefined;

  possibleMoves: Array<[number, number]> | undefined;
  possibleAttacks: Array<[number, number]> | undefined;

  positionToShow(coordinates: [number, number]): [number, number] {
    if (this.flipBoard()) {
      return [this.chessBoard().length - coordinates[0], coordinates[1]];
    }
    return [coordinates[0], coordinates[1]];
  }

  getRowFocusStatus(rowIndex: number, columnIndex: number) {
    // if the piece on field is selected
    if (
      this.firstPosition &&
      this.firstPosition[0] == rowIndex &&
      this.firstPosition[1] == columnIndex
    ) {
      return 'selected';
    }
    // if it is possible to move piece in here
    if (this.possibleMoves != undefined) {
      const rowToBeMoved = this.possibleMoves.find((move: [number, number]) => {
        return move[0] == rowIndex && move[1] == columnIndex;
      });
      if (rowToBeMoved) {
        return 'toBeMoved';
      }
    }
    // if piece can attack this field
    if (this.possibleAttacks != undefined) {
      const rowToBeAttacked = this.possibleAttacks.find(
        (move: [number, number]) => {
          return move[0] == rowIndex && move[1] == columnIndex;
        }
      );
      if (rowToBeAttacked) {
        // console.log('1', rowToBeAttacked);
        return 'toBeAttacked';
      }
    }
    return null;
  }

  movePiece(coordinates: [number, number]) {
    // if we already have a piece selected
    if (this.firstPosition) {
      if (coordinates == this.firstPosition) {
        this.firstPosition = undefined;

        this.possibleMoves = undefined;
        this.possibleAttacks = undefined;
        return;
      }
      this.secondPosition = coordinates;

      this.chessGame.movePiece(this.firstPosition, this.secondPosition);

      this.firstPosition = undefined;
      this.secondPosition = undefined;

      this.possibleMoves = undefined;
      this.possibleAttacks = undefined;
    }
    // if none of piece is selected
    else if (this.chessGame.checkIfTherePiece(coordinates)) {
      this.firstPosition = coordinates;
      this.possibleMoves = this.chessGame.getPiecePossibleMoves(
        this.firstPosition
      );
      this.possibleAttacks = this.chessGame.getPiecePossibleAttacks(
        this.firstPosition
      );
      console.log('possibleMoves', this.possibleMoves);
      console.log('possibleAttacks', this.possibleAttacks);
    }
  }
}
