import { createPawnPiece } from '../chess/PawnPiece.ts';
import { ChessPieceData } from '../chess/ChessPiece.ts';

export const createInitialBoard = (): ChessPieceData[] => {
  return [
    createPawnPiece('black', { x: 3, y: 0 }),
    createPawnPiece('black', { x: 4, y: 0 }),
    createPawnPiece('white', { x: 3, y: 7 }),
    createPawnPiece('white', { x: 4, y: 7 }),
  ];
};
