import { ChessPieceStrategy } from './ChessPiece.ts';
import { PawnChessPieceStrategy } from './PawnPiece.ts';
import { KnightChessPieceStrategy } from './KnightPiece.ts';
import { RookChessPieceStrategy } from './RookPiece.ts';
import { BishopChessPieceStrategy } from './BishopPiece.ts';
import { QueenChessPieceStrategy } from './QueenPiece.ts';
import { KingChessPieceStrategy } from './KingPiece.ts';

export const strategies: ChessPieceStrategy[] = [
  PawnChessPieceStrategy,
  KnightChessPieceStrategy,
  RookChessPieceStrategy,
  BishopChessPieceStrategy,
  QueenChessPieceStrategy,
  KingChessPieceStrategy
];
