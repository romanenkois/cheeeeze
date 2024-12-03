export type chessPiece =
  | 'empty'
  | 'Pawn'
  | 'Rook'
  | 'Knight'
  | 'Bishop'
  | 'Queen'
  | 'King';

export type movesPatterns = {
  straight?: boolean,
  diagonaly?: boolean,
  twoForward?: boolean,
  oneForward?: boolean,
  LShape?: boolean,
  oneTileSquare?: boolean,
}

export type attackPatterns = {
  straight?: boolean,
  diagonaly?: boolean,
  oneTileDiagonalForward?: boolean,
  LShape?: boolean,
  oneTileSquare?: boolean,
}

export type chessFaction = 'white' | 'black' | 'neutral';

export type chessField = {
  piece: chessPiece;
  faction: chessFaction;
};

export type smolArrayOfEight = [
  chessField,
  chessField,
  chessField,
  chessField,
  chessField,
  chessField,
  chessField,
  chessField
];
export type ChessBoard = [
  smolArrayOfEight,
  smolArrayOfEight,
  smolArrayOfEight,
  smolArrayOfEight,
  smolArrayOfEight,
  smolArrayOfEight,
  smolArrayOfEight,
  smolArrayOfEight
];
