export type chessPiece =
  | 'empty'
  | 'Pawn'
  | 'Rook'
  | 'Knight'
  | 'Bishop'
  | 'Queen'
  | 'King';

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
