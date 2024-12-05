import { chessField, movesPatterns, attackPatterns } from './models';
import { Injectable } from '@angular/core';

// Used to store different validation fucntions
@Injectable({
  providedIn: 'root',
})
export class MoveValidators {
  checkIfTherePiece(coordinates: [number, number], chessBoard: any): boolean {
    if (
      chessBoard[coordinates[0]][coordinates[1]].piece &&
      chessBoard[coordinates[0]][coordinates[1]].piece != 'empty'
    ) {
      return true;
    }
    return false;
  }

  /**
   * returns all possible moves, that would end with piece on earlier EMPTY square.
   * this doen not include squares with chess piece, of any faction
   * @param from coordinates on board
   * @param posibleMovesPatterns object of possible moves
   * @param chessBoard chess board to check
   * @returns
   */
  getPieceAllValidMoves(
    from: [number, number],
    posibleMovesPatterns: movesPatterns,
    chessBoard: Array<Array<chessField>>
  ): Array<[number, number]> {
    let posibleMovesCoordinates: Array<[number, number]> = [];
    let piece = chessBoard[from[0]][from[1]];

    let XLenth = chessBoard[0].length;
    let YLenth = chessBoard.length;

    if (
      piece.piece == 'empty' ||
      piece.faction == 'neutral' ||
      from[0] < -1 ||
      from[0] > YLenth ||
      from[1] < -1 ||
      from[1] > XLenth
    ) {
      return [];
    }

    // those are if, couse one piece can have multiple patterns
    if (posibleMovesPatterns.straight) {
      // to the top of piece
      if (from[0] > 0) {
        for (let i = from[0] - 1; i > -1; i--) {
          if (this.checkIfTherePiece([i, from[1]], chessBoard)) {
            break;
          }
          posibleMovesCoordinates.push([i, from[1]]);
        }
      }
      // to the right of piece
      if (from[1] + 1 < XLenth) {
        for (let i = from[1] + 1; i < XLenth; i++) {
          if (this.checkIfTherePiece([from[0], i], chessBoard)) {
            break;
          }
          posibleMovesCoordinates.push([from[0], i]);
        }
      }
      // to the bottom of piece
      if (from[0] + 1 < YLenth) {
        for (let i = from[0] + 1; i < YLenth; i++) {
          if (this.checkIfTherePiece([i, from[1]], chessBoard)) {
            break;
          }
          posibleMovesCoordinates.push([i, from[1]]);
        }
      }
      // to the right of piece
      if (from[1] > 0) {
        for (let i = from[1] - 1; i > -1; i--) {
          if (this.checkIfTherePiece([from[0], i], chessBoard)) {
            break;
          }
          posibleMovesCoordinates.push([from[0], i]);
        }
      }
    }
    if (posibleMovesPatterns.diagonaly) {
      // to the top right diagonal
      if (from[0] > -1 && from[1] + 1 < XLenth) {
        let startingPoint: [number, number] = [from[0] - 1, from[1] + 1];
        while (
          startingPoint[0] > -1 &&
          startingPoint[1] < XLenth &&
          !this.checkIfTherePiece(startingPoint, chessBoard)
        ) {
          posibleMovesCoordinates.push([startingPoint[0], startingPoint[1]]);
          startingPoint[0] -= 1;
          startingPoint[1] += 1;
        }
      }
      // to the bottom right diagonal
      if (from[0] + 1 < YLenth && from[1] + 1 < XLenth) {
        let startingPoint: [number, number] = [from[0] + 1, from[1] + 1];
        while (
          startingPoint[0] < YLenth &&
          startingPoint[1] < XLenth &&
          !this.checkIfTherePiece(startingPoint, chessBoard)
        ) {
          posibleMovesCoordinates.push([startingPoint[0], startingPoint[1]]);
          startingPoint[0] += 1;
          startingPoint[1] += 1;
        }
      }
      // to the bottom left diagonal
      if (from[0] + 1 < YLenth && from[1] > -1) {
        let startingPoint: [number, number] = [from[0] + 1, from[1] - 1];
        console.log(startingPoint);
        while (
          startingPoint[0] < YLenth &&
          startingPoint[1] > -1 &&
          !this.checkIfTherePiece(startingPoint, chessBoard)
        ) {
          posibleMovesCoordinates.push([startingPoint[0], startingPoint[1]]);
          startingPoint[0] += 1;
          startingPoint[1] -= 1;
        }
      }
      // to the top left diagonal
      if (from[0] - 1 > -1 && from[1] - 1 > -1) {
        let startingPoint: [number, number] = [from[0] - 1, from[1] - 1];
        while (
          startingPoint[0] > -1 &&
          startingPoint[1] > -1 &&
          !this.checkIfTherePiece(startingPoint, chessBoard)
        ) {
          posibleMovesCoordinates.push([startingPoint[0], startingPoint[1]]);
          startingPoint[0] -= 1;
          startingPoint[1] -= 1;
        }
      }
    }
    if (posibleMovesPatterns.oneForward) {
      const direction = piece.faction == 'white' ? -1 : 1;
      const nextPosition: [number, number] = [from[0] + direction, from[1]];

      if (!this.checkIfTherePiece(nextPosition, chessBoard)) {
        posibleMovesCoordinates.push(nextPosition);
      }
    }
    if (posibleMovesPatterns.twoForward) {
      const direction = piece.faction == 'white' ? -1 : 1;
      const startRow = piece.faction == 'white' ? YLenth - 2 : 1;
      const nextPosition: [number, number] = [from[0] + direction, from[1]];
      const twoForwardPosition: [number, number] = [
        from[0] + 2 * direction,
        from[1],
      ];

      if (
        from[0] == startRow &&
        !this.checkIfTherePiece(nextPosition, chessBoard) &&
        !this.checkIfTherePiece(twoForwardPosition, chessBoard)
      ) {
        posibleMovesCoordinates.push(twoForwardPosition);
      }
    }
    if (posibleMovesPatterns.LShape) {
      let posmoves: Array<[number, number]> = [
        [from[0] - 2, from[1] - 1],
        [from[0] - 2, from[1] + 1],
        [from[0] - 1, from[1] + 2],
        [from[0] + 1, from[1] + 2],
        [from[0] + 2, from[1] + 1],
        [from[0] + 2, from[1] - 1],
        [from[0] + 1, from[1] - 2],
        [from[0] - 1, from[1] - 2],
      ];
      posmoves.forEach((move: [number, number]) => {
        if (
          move[0] > -1 &&
          move[0] < YLenth &&
          move[1] > -1 &&
          move[1] < XLenth &&
          !this.checkIfTherePiece(move, chessBoard)
        ) {
          posibleMovesCoordinates.push(move);
        }
      });
    }
    if (posibleMovesPatterns.oneTileSquare) {
      let posmoves: Array<[number, number]> = [
        [from[0] - 1, from[1] - 1],
        [from[0] - 1, from[1]],
        [from[0] - 1, from[1] + 1],
        [from[0], from[1] + 1],
        [from[0] + 1, from[1] + 1],
        [from[0] + 1, from[1]],
        [from[0] + 1, from[1] - 1],
        [from[0], from[1] - 1],
      ];
      posmoves.forEach((move: [number, number]) => {
        if (
          move[0] > -1 &&
          move[0] < YLenth &&
          move[1] > -1 &&
          move[1] < XLenth &&
          !this.checkIfTherePiece(move, chessBoard)
        ) {
          posibleMovesCoordinates.push(move);
        }
      });
    }

    // console.log(posibleMovesCoordinates);
    return posibleMovesCoordinates;
  }

  getPieceAllValidAttacks(
    from: [number, number],
    attackPatterns: attackPatterns,
    allowSelfAttack: boolean,
    chessBoard: Array<Array<chessField>>
  ): Array<[number, number]> {
    let possibleAttacksCoordinates: Array<[number, number]> = [];
    let piece = chessBoard[from[0]][from[1]];

    let XLenth = chessBoard[0].length;
    let YLenth = chessBoard.length;

    if (attackPatterns.straight) {
      // to the top of piece
      if (from[0] > 0) {
        for (let i = from[0] - 1; i > -1; i--) {
          if (this.checkIfTherePiece([i, from[1]], chessBoard)) {
            if (
              chessBoard[i][from[1]].faction != piece.faction ||
              allowSelfAttack
            ) {
              possibleAttacksCoordinates.push([i, from[1]]);
            }
            break;
          }
        }
      }
      // to the right of piece
      if (from[1] + 1 < XLenth) {
        for (let i = from[1] + 1; i < XLenth; i++) {
          if (this.checkIfTherePiece([from[0], i], chessBoard)) {
            if (
              chessBoard[from[0]][i].faction != piece.faction ||
              allowSelfAttack
            ) {
              possibleAttacksCoordinates.push([from[0], i]);
            }
            break;
          }
        }
      }
      // to the bottom of piece
      if (from[0] + 1 < YLenth) {
        for (let i = from[0] + 1; i < YLenth; i++) {
          if (this.checkIfTherePiece([i, from[1]], chessBoard)) {
            if (
              chessBoard[i][from[1]].faction != piece.faction ||
              allowSelfAttack
            ) {
              possibleAttacksCoordinates.push([i, from[1]]);
            }
            break;
          }
        }
      }
      // to the right of piece
      if (from[1] > 0) {
        for (let i = from[1] - 1; i > -1; i--) {
          if (this.checkIfTherePiece([from[0], i], chessBoard)) {
            if (
              chessBoard[from[0]][i].faction != piece.faction ||
              allowSelfAttack
            ) {
              possibleAttacksCoordinates.push([from[0], i]);
            }
            break;
          }
        }
      }
    }
    if (attackPatterns.diagonaly) {
      // to the top right diagonal
      if (from[0] > -1 && from[1] + 1 < XLenth) {
        let startingPoint: [number, number] = [from[0] - 1, from[1] + 1];
        while (startingPoint[0] > -1 && startingPoint[1] < XLenth) {
          if (this.checkIfTherePiece(startingPoint, chessBoard)) {
            if (
              chessBoard[startingPoint[0]][startingPoint[1]].faction !=
                piece.faction ||
              allowSelfAttack
            ) {
              possibleAttacksCoordinates.push([
                startingPoint[0],
                startingPoint[1],
              ]);
            }
            break;
          }
          startingPoint[0] -= 1;
          startingPoint[1] += 1;
        }
      }
      // to the bottom right diagonal
      if (from[0] + 1 < YLenth && from[1] + 1 < XLenth) {
        let startingPoint: [number, number] = [from[0] + 1, from[1] + 1];
        while (startingPoint[0] < YLenth && startingPoint[1] < XLenth) {
          if (this.checkIfTherePiece(startingPoint, chessBoard)) {
            if (
              chessBoard[startingPoint[0]][startingPoint[1]].faction !=
                piece.faction ||
              allowSelfAttack
            ) {
              possibleAttacksCoordinates.push([
                startingPoint[0],
                startingPoint[1],
              ]);
            }
            break;
          }
          startingPoint[0] += 1;
          startingPoint[1] += 1;
        }
      }
      // to the bottom left diagonal
      if (from[0] + 1 < YLenth && from[1] > -1) {
        let startingPoint: [number, number] = [from[0] + 1, from[1] - 1];
        console.log(startingPoint);
        while (startingPoint[0] < YLenth && startingPoint[1] > -1) {
          if (this.checkIfTherePiece(startingPoint, chessBoard)) {
            if (
              chessBoard[startingPoint[0]][startingPoint[1]].faction !=
                piece.faction ||
              allowSelfAttack
            ) {
              possibleAttacksCoordinates.push([
                startingPoint[0],
                startingPoint[1],
              ]);
            }
            break;
          }
          startingPoint[0] += 1;
          startingPoint[1] -= 1;
        }
      }
      // to the top left diagonal
      if (from[0] - 1 > -1 && from[1] - 1 > -1) {
        let startingPoint: [number, number] = [from[0] - 1, from[1] - 1];
        while (startingPoint[0] > -1 && startingPoint[1] > -1) {
          if (this.checkIfTherePiece(startingPoint, chessBoard)) {
            if (
              chessBoard[startingPoint[0]][startingPoint[1]].faction !=
                piece.faction ||
              allowSelfAttack
            ) {
              possibleAttacksCoordinates.push([
                startingPoint[0],
                startingPoint[1],
              ]);
            }
            break;
          }
          startingPoint[0] -= 1;
          startingPoint[1] -= 1;
        }
      }
    }
    if (attackPatterns.LShape) {
      let posmoves: Array<[number, number]> = [
        [from[0] - 2, from[1] - 1],
        [from[0] - 2, from[1] + 1],
        [from[0] - 1, from[1] + 2],
        [from[0] + 1, from[1] + 2],
        [from[0] + 2, from[1] + 1],
        [from[0] + 2, from[1] - 1],
        [from[0] + 1, from[1] - 2],
        [from[0] - 1, from[1] - 2],
      ];
      posmoves.forEach((move: [number, number]) => {
        if (
          move[0] > -1 &&
          move[0] < YLenth &&
          move[1] > -1 &&
          move[1] < XLenth &&
          this.checkIfTherePiece(move, chessBoard)
        ) {
          if (
            chessBoard[move[0]][move[1]].faction != piece.faction ||
            allowSelfAttack
          ) {
            possibleAttacksCoordinates.push(move);
          }
        }
      });
    }
    if (attackPatterns.oneTileSquare) {
      let posmoves: Array<[number, number]> = [
        [from[0] - 1, from[1] - 1],
        [from[0] - 1, from[1]],
        [from[0] - 1, from[1] + 1],
        [from[0], from[1] + 1],
        [from[0] + 1, from[1] + 1],
        [from[0] + 1, from[1]],
        [from[0] + 1, from[1] - 1],
        [from[0], from[1] - 1],
      ];
      posmoves.forEach((move: [number, number]) => {
        if (
          move[0] > -1 &&
          move[0] < YLenth &&
          move[1] > -1 &&
          move[1] < XLenth &&
          this.checkIfTherePiece(move, chessBoard)
        ) {
          if (
            move[0] > -1 &&
            move[0] < YLenth &&
            move[1] > -1 &&
            move[1] < XLenth &&
            !this.checkIfTherePiece(move, chessBoard)
          ) {
            possibleAttacksCoordinates.push(move);
          }
        }
      });
    }
    if (attackPatterns.oneTileDiagonalForward) {
      let direction = piece.faction == 'white' ? -1 : 1;
      if (
        this.checkIfTherePiece([from[0] + direction, from[1] + 1], chessBoard)
      ) {
        if (
          chessBoard[from[0] + direction][from[1] + 1].faction !=
            piece.faction ||
          allowSelfAttack
        ) {
          possibleAttacksCoordinates.push([from[0] + direction, from[1] + 1]);
        }
      }
      if (
        this.checkIfTherePiece([from[0] + direction, from[1] - 1], chessBoard)
      ) {
        if (
          chessBoard[from[0] + direction][from[1] - 1].faction !=
            piece.faction ||
          allowSelfAttack
        ) {
          possibleAttacksCoordinates.push([from[0] + direction, from[1] - 1]);
        }
      }
    }

    return possibleAttacksCoordinates;
  }

  getPieceMovePatterns(piece: chessField) {
    let pieceMovesPatterns: movesPatterns = {};

    if (piece.piece == 'Rook') {
      pieceMovesPatterns.straight = true;
    }
    if (piece.piece == 'Bishop') {
      pieceMovesPatterns.diagonaly = true;
    }
    if (piece.piece == 'Queen') {
      pieceMovesPatterns.straight = true;
      pieceMovesPatterns.diagonaly = true;
    }
    if (piece.piece == 'Pawn') {
      pieceMovesPatterns.oneForward = true;
      pieceMovesPatterns.twoForward = true; // should be implemented better???
    }
    if (piece.piece == 'Knight') {
      pieceMovesPatterns.LShape = true;
    }
    if (piece.piece == 'King') {
      pieceMovesPatterns.oneTileSquare = true;
    }

    return pieceMovesPatterns;
  }

  getPieceAttackPatterns(piece: chessField) {
    let pieceAttacksPatterns: attackPatterns = {};

    if (piece.piece == 'Rook') {
      pieceAttacksPatterns.straight = true;
    }
    if (piece.piece == 'Bishop') {
      pieceAttacksPatterns.diagonaly = true;
    }
    if (piece.piece == 'Queen') {
      pieceAttacksPatterns.straight = true;
      pieceAttacksPatterns.diagonaly = true;
    }
    if (piece.piece == 'Pawn') {
      pieceAttacksPatterns.oneTileDiagonalForward = true;
    }
    if (piece.piece == 'Knight') {
      pieceAttacksPatterns.LShape = true;
    }
    if (piece.piece == 'King') {
      pieceAttacksPatterns.oneTileSquare = true;
    }

    return pieceAttacksPatterns;
  }

  validatePieceMove(
    from: [number, number],
    to: [number, number],
    chessBoard: Array<Array<chessField>>
  ): boolean {
    let piece = chessBoard[from[0]][from[1]];
    let pieceMovesPatterns = this.getPieceMovePatterns(piece);
    let pieceAttacksPatterns = this.getPieceAttackPatterns(piece);

    let posibleMoves = this.getPieceAllValidMoves(
      from,
      pieceMovesPatterns,
      chessBoard
    );
    let posibleAttacks = this.getPieceAllValidAttacks(
      from,
      pieceAttacksPatterns,
      false,
      chessBoard
    );
    console.log(111, posibleMoves);
    console.log(222, posibleAttacks);

    let isValidMove = false;
    isValidMove =
      posibleMoves.find((move: [number, number]) => {
        return move[0] == to[0] && move[1] == to[1];
      }) || isValidMove
        ? true
        : false;
    isValidMove =
      posibleAttacks.find((attack: [number, number]) => {
        return attack[0] == to[0] && attack[1] == to[1];
      }) || isValidMove
        ? true
        : false;

    return isValidMove;
  }
}
