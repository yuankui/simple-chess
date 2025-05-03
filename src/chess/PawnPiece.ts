import { ChessPiece, GameState, Position } from './ChessPiece.ts';

const delta = (color: 'black' | 'white'): Position[] => [
  {
    x: 0,
    y: color === 'white' ? -1 : 1, // Move forward
  },
  {
    x: -1,
    y: color === 'white' ? -1 : 1, // Move left
  },
  {
    x: 1,
    y: color === 'white' ? -1 : 1, // Move right
  },
];

export const createPawnPiece = (color: 'black' | 'white', position: Position): ChessPiece => {
  return {
    color,
    position,
    type: 'pawn',
    nextMoves(game: GameState): Position[] {
      // 1 step forward, left, or right.
      return delta(color)
        .map(d => ({
          x: this.position.x + d.x,
          y: this.position.y + d.y,
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
    nextKills(game: GameState): Position[] {
      // 1 step forward, left, or right.

      return delta(color)
        .map(d => ({
          x: this.position.x + d.x,
          y: this.position.y + d.y,
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
          return targetPiece != null && targetPiece.color !== color; // No piece at the target position
        });
    },
  };
};
