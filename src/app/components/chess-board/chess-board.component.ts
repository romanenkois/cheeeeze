import { Component, inject, input, InputSignal } from '@angular/core';
import { ChessFieldComponent } from "../chess-field/chess-field.component";
import { CommonModule } from '@angular/common';
import { MainService } from '../../service/main.service';

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule, ChessFieldComponent],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.scss'
})
export class ChessBoardComponent {
[x: string]: any;
  mainService: MainService = inject(MainService);

  chessBoard: InputSignal<any> = input.required();

  firstPosition: [number, number] | undefined;
  secondPosition: [number, number] | undefined;

  movePiece(coordinates: [number, number]) {
    if (this.firstPosition) {
      this.secondPosition = coordinates;
      this.mainService.movePiece(this.firstPosition, this.secondPosition);
      this.firstPosition = undefined;
      this.secondPosition = undefined;
      console.log(this.firstPosition, this.secondPosition);
    } else {
      this.firstPosition = coordinates;
      console.log(this.firstPosition, this.secondPosition);
    }
  }

}
