import { signal, WritableSignal } from '@angular/core';
import { MoveValidators } from './move.validators';
import { chessBoardDefault, chessBoardTesting2 } from './data';
import { ChessBoard, chessFaction } from '@models/index';

export class ChessGame {
  constructor(public id: string ) {}

  private moveValidator: MoveValidators =  new MoveValidators;

  private readonly $chessBoard: WritableSignal<ChessBoard> = signal(chessBoardTesting2);
  private setChessBoard(chessBoard: ChessBoard) {
    this.$chessBoard.set(chessBoard);
  }
  public getChessBoard(): ChessBoard {
    return JSON.parse(JSON.stringify(this.$chessBoard()));
  }

  private readonly $factionTurn: WritableSignal<chessFaction> = signal('white');
  private changeTurn(faction: chessFaction) {
    this.$factionTurn.set(this.$factionTurn() == 'white' ? 'black' : 'white');
  }
  public getTurn(): chessFaction {
    return this.$factionTurn();
  }

  private readonly userFaction: WritableSignal<chessFaction> = signal('black');
  private setPlayerFaction(faction: chessFaction) {
    this.userFaction.set(faction);
  }
  public getPlayerFaction(): chessFaction {
    return this.userFaction();
  }

  private readonly $gameIsActive: WritableSignal<boolean> = signal(true);
  private endGame() {
    this.$gameIsActive.set(false);
  }
  public getGameStatus(): boolean {
    return this.$gameIsActive();
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
    console.log('gp_pm',coordinates);
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
    console.log('gp_pa',coordinates);
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

    if (firstPiece.piece == 'empty') {
      console.log('VALIDATION ERROR: ', 'cant move empty piece')
      return false;
    }
    if (
      firstPiece.faction == secondPiece.faction &&
      ruleset == 'classic'
    ) {
      console.log('VALIDATION ERROR: ', 'both pieces are same faction')
      return false;
    }
    // if (firstPiece.faction != this.$factionTurn() && ruleset == 'classic') {
    //   console.log('VALIDATION ERROR: ', 'its turn of another faction')
    //   return false;
    // }
    if (
      !this.moveValidator.validatePieceMove(
        from,
        to,
        allowSelfAttack,
        chessBoard
      ) &&
      ruleset == 'classic'
    ) {
      console.log('VALIDATION ERROR: ', 'not valid piece movement pattern')
      return false;
    }
    if (
      this.moveValidator.checkIfThrereIsCheck(
        this.$factionTurn(),
        allowSelfAttack,
        posibleChessBoard
      )
    ) {
      console.log('VALIDATION ERROR: ', 'king under attack')
      return false;
    }
    return true;
  }

  movePiece(from: [number, number], to: [number, number]) {
    console.log('MP', from, to);
    const chessBoard = this.getChessBoard();
    let allowSelfAttack: boolean = false;

    let firstPiece = chessBoard[from[0]][from[1]];
    let secondPiece = chessBoard[to[0]][to[1]];
    console.log('first', firstPiece);
    console.log('second', secondPiece);

    if (this.$gameIsActive() == false) {
      return;
    }
    if (!this.validateMove(from, to, 'classic', chessBoard)) {
      return;
    }

    // if valid, move piece
    chessBoard[to[0]][to[1]] = firstPiece;
    chessBoard[to[0]][to[1]].hasMovedSinceGameBegin = true;

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
    console.log("MOVED!!!!!!!!!")
  }
}
