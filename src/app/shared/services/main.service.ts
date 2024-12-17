import { Injectable} from '@angular/core';
import { ChessGame } from '../chess-engine/chess.class';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  chessGames: Array<ChessGame> = [];
  createNewChessGame(id?: string): ChessGame {
    id = id ? id : Date.now().toString();
    let chezzGame: ChessGame = new ChessGame(id);
    this.chessGames.push(chezzGame);
    return chezzGame;
  }
  getChessGame(id: string): ChessGame {
    let chezzGame: ChessGame | null = null;
    for (let i = 0; i < this.chessGames.length; i++) {
      if (this.chessGames[i].id = id) {
        chezzGame = this.chessGames[i];
      }
    }
    return chezzGame ? chezzGame : this.createNewChessGame();
  }
}
