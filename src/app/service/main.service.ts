import { Injectable} from '@angular/core';
import { ChessGame } from '../shared/chess-engine/chess.class';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  getChessGame(id: string): ChessGame {
    return new ChessGame;
  }
}
