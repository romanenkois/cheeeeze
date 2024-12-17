import { Component } from '@angular/core';
import { ChessGameComponent } from "../../widgets/chess-game/chess-game.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChessGameComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {

}
