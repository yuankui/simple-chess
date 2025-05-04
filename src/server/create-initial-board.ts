import { createPawnPiece } from '../chess/PawnPiece.ts';
import { createKnightPiece } from '../chess/KnightPiece.ts';
import { createRookPiece } from '../chess/RookPiece.ts';
import { createBishopPiece } from '../chess/BishopPiece.ts';
import { createQueenPiece } from '../chess/QueenPiece.ts';
import { createKingPiece } from '../chess/KingPiece.ts';
import { ChessPieceData } from '../chess/ChessPiece.ts';

export const createInitialBoard = (): ChessPieceData[] => {
  const pieces: ChessPieceData[] = [];
  
  // Create pawns for both sides
  for (let i = 0; i < 8; i++) {
    pieces.push(createPawnPiece('black', { x: i, y: 1 }));
    pieces.push(createPawnPiece('white', { x: i, y: 6 }));
  }
  
  // Create rooks
  pieces.push(createRookPiece('black', { x: 0, y: 0 }));
  pieces.push(createRookPiece('black', { x: 7, y: 0 }));
  pieces.push(createRookPiece('white', { x: 0, y: 7 }));
  pieces.push(createRookPiece('white', { x: 7, y: 7 }));
  
  // Create knights
  pieces.push(createKnightPiece('black', { x: 1, y: 0 }));
  pieces.push(createKnightPiece('black', { x: 6, y: 0 }));
  pieces.push(createKnightPiece('white', { x: 1, y: 7 }));
  pieces.push(createKnightPiece('white', { x: 6, y: 7 }));
  
  // Create bishops
  pieces.push(createBishopPiece('black', { x: 2, y: 0 }));
  pieces.push(createBishopPiece('black', { x: 5, y: 0 }));
  pieces.push(createBishopPiece('white', { x: 2, y: 7 }));
  pieces.push(createBishopPiece('white', { x: 5, y: 7 }));
  
  // Create queens
  pieces.push(createQueenPiece('black', { x: 3, y: 0 }));
  pieces.push(createQueenPiece('white', { x: 3, y: 7 }));
  
  // Create kings
  pieces.push(createKingPiece('black', { x: 4, y: 0 }));
  pieces.push(createKingPiece('white', { x: 4, y: 7 }));
  
  return pieces;
};
