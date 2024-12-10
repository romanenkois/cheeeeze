import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { chessBoardDefault, chessBoardTesting } from './data';
import { MoveValidators } from './move.validators';
import { ChessBoard, chessFaction } from './models';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private moveValidator: MoveValidators = inject(MoveValidators);

  private readonly $chessBoard: WritableSignal<ChessBoard> =
    signal(chessBoardDefault);
  private setChessBoard(chessBoard: ChessBoard) {
    this.$chessBoard.set(chessBoard);
  }
  public getChessBoard(): ChessBoard {
    return this.$chessBoard();
  }

  public readonly $factionTurn: WritableSignal<chessFaction> = signal('white');
  public getTurn(): chessFaction {
    return this.$factionTurn();
  }
  public changeTurn(faction: chessFaction) {
    this.$factionTurn.set(this.$factionTurn() == 'white' ? 'black' : 'white');
  }

  public readonly $gameIsActive: WritableSignal<boolean> = signal(true);
  public endGame() {
    this.$gameIsActive.set(false);
  }

  public checkIfTherePiece(coordinates: [number, number]): boolean {
    return this.moveValidator.checkIfTherePiece(
      coordinates,
      this.getChessBoard()
    );
  }
  public getPiecePossibleMoves(
    coordinates: [number, number]
  ): Array<[number, number]> {
    let pieceMovePattern = this.moveValidator.getPieceMovePatterns(
      this.getChessBoard()[coordinates[0]][coordinates[1]]
    );

    return this.moveValidator.getPieceAllValidMoves(
      coordinates,
      pieceMovePattern,
      this.getChessBoard()
    );
  }

  public getPiecePossibleAttacks(
    coordinates: [number, number]
  ): Array<[number, number]> {
    let pieceMovePattern = this.moveValidator.getPieceAttackPatterns(
      this.getChessBoard()[coordinates[0]][coordinates[1]]
    );

    return this.moveValidator.getPieceAllValidAttacks(
      coordinates,
      pieceMovePattern,
      false,
      this.getChessBoard()
    );
  }

  private validateMove(
    from: [number, number],
    to: [number, number],
    ruleset: string,
    chessBoard: ChessBoard
  ): boolean {
    let firstPiece = chessBoard[from[0]][from[1]];
    let secondPiece = chessBoard[to[0]][to[1]];
    let allowSelfAttack: boolean = false;

    const posibleChessBoard: ChessBoard = JSON.parse(
      JSON.stringify(chessBoard)
    );
    posibleChessBoard[to[0]][to[1]] = firstPiece;
    posibleChessBoard[from[0]][from[1]] = {
      piece: 'empty',
      faction: 'neutral',
    };

    if (
      (firstPiece.piece == 'empty' ||
        firstPiece.faction == secondPiece.faction) &&
      ruleset == 'classic'
    ) {
      return false;
    }
    if (firstPiece.faction != this.$factionTurn() && ruleset == 'classic') {
      return false;
    }
    if (
      !this.moveValidator.validatePieceMove(
        from,
        to,
        allowSelfAttack,
        chessBoard
      ) &&
      ruleset == 'classic'
    ) {
      return false;
    }
    if (
      this.moveValidator.checkIfThrereIsCheck(
        this.$factionTurn(),
        allowSelfAttack,
        posibleChessBoard
      )
    ) {
      return false;
    }
    console.log(
      'check white',
      this.moveValidator.checkIfThrereIsCheck(
        'white',
        allowSelfAttack,
        posibleChessBoard
      )
    );
    console.log(
      'check black',
      this.moveValidator.checkIfThrereIsCheck(
        'black',
        allowSelfAttack,
        posibleChessBoard
      )
    );

    return true;
  }

  movePiece(from: [number, number], to: [number, number]) {
    const chessBoard = this.getChessBoard();
    let allowSelfAttack: boolean = false;

    let firstPiece = chessBoard[from[0]][from[1]];
    let secondPiece = chessBoard[to[0]][to[1]];

    if (this.$gameIsActive() == false) {
      return;
    }
    if (!this.validateMove(from, to, 'classic', chessBoard)) {
      return;
    }

    // if valid, move piece
    chessBoard[to[0]][to[1]] = firstPiece;
    chessBoard[from[0]][from[1]] = {
      piece: 'empty',
      faction: 'neutral',
    };
    this.setChessBoard(chessBoard);

    this.getTurn() == 'white'
      ? this.changeTurn('black')
      : this.changeTurn('white');
    if (
      this.moveValidator.checkIfThereIsCheckMate(
        this.$factionTurn(),
        allowSelfAttack,
        chessBoard
      )
    ) {
      this.endGame();
    }
  }
}
