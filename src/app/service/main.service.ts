import { Injectable} from '@angular/core';
import { ChessGame } from './chess.class';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  getChessGame(id: string): ChessGame {
    return new ChessGame;
  }
}
