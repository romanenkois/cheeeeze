import { Component, inject, input, InputSignal } from '@angular/core';
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

  chessBoard: InputSignal<any> = input.required();

  firstPosition: [number, number] | undefined;
  secondPosition: [number, number] | undefined;

  movePiece(coordinates: [number, number]) {
    if (this.firstPosition) {
      if (coordinates == this.firstPosition) {
        this.firstPosition = undefined;
        return;
      }
      this.secondPosition = coordinates;
      // console.log('2', this.firstPosition, this.secondPosition);

      this.mainService.movePiece(this.firstPosition, this.secondPosition);
      this.firstPosition = undefined;
      this.secondPosition = undefined;
    } else {
      if (this.mainService.checkIfTherePiece(coordinates)) {
        this.firstPosition = coordinates;
        // console.log('1', this.firstPosition, this.secondPosition);
      }
    }
  }
}
