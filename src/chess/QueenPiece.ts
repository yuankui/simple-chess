import { ChessPieceData, ChessPieceStrategy, GameState, Position } from './ChessPiece.ts';
import { v4 } from 'uuid';

// Queen combines the movement of both rook and bishop
const getQueenMoves = (piece: ChessPieceData, game: GameState, forKill: boolean): Position[] => {
  const moves: Position[] = [];
  // Queen can move in 8 directions: horizontally, vertically, and diagonally
  const directions = [
    { x: 0, y: 1 },   // down
    { x: 0, y: -1 },  // up
    { x: 1, y: 0 },   // right
    { x: -1, y: 0 },  // left
    { x: 1, y: 1 },   // down-right
    { x: 1, y: -1 },  // up-right
    { x: -1, y: 1 },  // down-left
    { x: -1, y: -1 }  // up-left
  ];

  // Check moves in each direction
  for (const dir of directions) {
    for (let step = 1; step < 8; step++) {
      const newPos = {
        x: piece.position.x + dir.x * step,
        y: piece.position.y + dir.y * step
      };

      // Check if the position is within bounds
      if (newPos.x < 0 || newPos.x >= 8 || newPos.y < 0 || newPos.y >= 8) {
        break; // Out of bounds, stop checking in this direction
      }

      // Check if the position is occupied
      const targetPiece = game.board.find(
        p => p.position.x === newPos.x && p.position.y === newPos.y
      );

      if (targetPiece) {
        // If looking for kills and this is an opponent piece, add it
        if (forKill && targetPiece.color !== piece.color) {
          moves.push(newPos);
        }
        break; // Stop in this direction after encountering a piece
      } else if (!forKill) {
        // If looking for moves and this position is empty, add it
        moves.push(newPos);
      }
    }
  }

  return moves;
};

export const QueenChessPieceStrategy: ChessPieceStrategy = {
  type: 'queen',
  nextMoves(piece: ChessPieceData, game: GameState): Position[] {
    return getQueenMoves(piece, game, false);
  },
  nextKills(piece: ChessPieceData, game: GameState): Position[] {
    return getQueenMoves(piece, game, true);
  },
};

export const createQueenPiece = (color: 'black' | 'white', position: Position): ChessPieceData => {
  return {
    id: v4(),
    color,
    position,
    type: 'queen',
    image: color === 'white' ? '/pieces/queen-white.svg' : '/pieces/queen-black.svg',
  };
};