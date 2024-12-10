import { Component, computed, inject } from '@angular/core';
import { MainService } from '../../service/main.service';
import { CommonModule } from '@angular/common';
import { ChessBoardComponent } from "../../components/chess-board/chess-board.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ChessBoardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {
  // mainService: MainService = inject(MainService);
  mainService: MainService = new MainService;

  chessBoard = computed(() => this.mainService.getChessBoard());

  // constructor() {
  //   console.log(this.mainService.getChessBoard());
  // }
}
