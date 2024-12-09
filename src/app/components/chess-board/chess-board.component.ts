import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ChessFieldComponent } from '../chess-field/chess-field.component';
import { CommonModule } from '@angular/common';
import { MainService } from '../../service/main.service';
import { chessFaction } from '../../service/models';

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule, ChessFieldComponent],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.scss',
})
export class ChessBoardComponent {
  mainService: MainService = inject(MainService);

  chessBoard: InputSignal<any> = input.required();
  factionTurn = computed(()=> this.mainService.$factionTurn());
  gameStatus = computed(()=> this.mainService.$gameIsActive());

  showIndexes: WritableSignal<boolean> = signal(false);

  firstPosition: [number, number] | undefined | null;
  secondPosition: [number, number] | undefined;

  possibleMoves: Array<[number, number]> | undefined;
  possibleAttacks: Array<[number, number]> | undefined;

  checkRowFocus(rowIndex: number, columnIndex: number) {
    if (this.possibleMoves != undefined) {
      const rowToBeMoved = this.possibleMoves.find((move: [number, number]) => {
        return move[0] == rowIndex && move[1] == columnIndex;
      });
      if (rowToBeMoved) {
        return 'toBeMoved';
      }
    }
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

      this.mainService.movePiece(this.firstPosition, this.secondPosition);

      this.firstPosition = undefined;
      this.secondPosition = undefined;

      this.possibleMoves = undefined;
      this.possibleAttacks = undefined;

    }
    // if none of piece is selected
    else if (this.mainService.checkIfTherePiece(coordinates)) {
      this.firstPosition = coordinates;
      this.possibleMoves = this.mainService.getPiecePossibleMoves(
        this.firstPosition
      );
      this.possibleAttacks = this.mainService.getPiecePossibleAttacks(
        this.firstPosition
      );
    }
  }
}
