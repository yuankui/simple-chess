import { ChessPieceData, ChessPieceStrategy, GameState, Position } from './ChessPiece.ts';
import { v4 } from 'uuid';

// King can move one square in any direction
const getKingMoves = (piece: ChessPieceData, game: GameState, forKill: boolean): Position[] => {
  // King can move one square in any direction
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

  return directions
    .map(dir => ({
      x: piece.position.x + dir.x,
      y: piece.position.y + dir.y
    }))
    .filter(pos => {
      // Check if the position is within bounds
      if (pos.x < 0 || pos.x >= 8 || pos.y < 0 || pos.y >= 8) {
        return false;
      }

      // Check if the position is occupied
      const targetPiece = game.board.find(
        p => p.position.x === pos.x && p.position.y === pos.y
      );

      if (forKill) {
        // If looking for kills, the space must be occupied by an opponent piece
        return targetPiece != null && targetPiece.color !== piece.color;
      } else {
        // If looking for moves, the space must be empty
        return targetPiece == null;
      }
    });
};

export const KingChessPieceStrategy: ChessPieceStrategy = {
  type: 'king',
  nextMoves(piece: ChessPieceData, game: GameState): Position[] {
    return getKingMoves(piece, game, false);
  },
  nextKills(piece: ChessPieceData, game: GameState): Position[] {
    return getKingMoves(piece, game, true);
  },
};

export const createKingPiece = (color: 'black' | 'white', position: Position): ChessPieceData => {
  return {
    id: v4(),
    color,
    position,
    type: 'king',
    image: color === 'white' ? '/pieces/king-white.svg' : '/pieces/king-black.svg',
  };
};