import { Component, inject } from '@angular/core';
import { MainService } from '@services/main.service';
import { ChessBoardComponent } from "@features/chess-board/chess-board.component";

@Component({
  selector: 'app-chess-game',
  standalone: true,
  imports: [ChessBoardComponent],
  templateUrl: './chess-game.component.html',
  styleUrl: './chess-game.component.scss'
})
export class ChessGameComponent {
  mainService: MainService = inject(MainService);
  chessGame = this.mainService.getChessGame('123');
}
