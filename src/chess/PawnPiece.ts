import { ChessPieceData, ChessPieceStrategy, GameState, Position } from './ChessPiece.ts';
import { v4 } from 'uuid';

const delta = (): Position[] => [
  {
    x: 0,
    y: -1,
  },
  {
    x: -1, // Move left
    y: 0,
  },
  {
    x: 1, // Move right
    y: 0,
  },
];

export const PawnChessPieceStrategy: ChessPieceStrategy = {
  type: 'pawn',
  nextMoves(piece: ChessPieceData, game: GameState): Position[] {
    // 1 step forward, left, or right.
    return delta()
      .map(d => ({
        x: piece.position.x + d.x,
        y: piece.position.y + d.y,
      }))
      .filter(move => {
        // Check if the move is within bounds
        return move.x >= 0 && move.x < 8 && move.y >= 0 && move.y < 8;
      })
      .filter(move => {
        // check if the move is empty
        const targetPiece = game.board.find(
          p => p.position.x === move.x && p.position.y === move.y
        );
        return targetPiece == null; // No piece at the target position
      });
  },
  nextKills(piece: ChessPieceData, game: GameState): Position[] {
    // 1 step forward, left, or right.

    return delta()
      .map(d => ({
        x: piece.position.x + d.x,
        y: piece.position.y + d.y,
      }))
      .filter(move => {
        // Check if the move is within bounds
        return move.x >= 0 && move.x < 8 && move.y >= 0 && move.y < 8;
      })
      .filter(move => {
        // check if the move is empty
        const targetPiece = game.board.find(
          p => p.position.x === move.x && p.position.y === move.y
        );
        return targetPiece != null && targetPiece.color !== piece.color; // No piece at the target position
      });
  },
};
export const createPawnPiece = (color: 'black' | 'white', position: Position): ChessPieceData => {
  return {
    id: v4(),
    color,
    position,
    type: 'pawn',
    image: color === 'white' ? '/pieces/pawn-white.svg' : '/pieces/pawn-black.svg',
  };
};
