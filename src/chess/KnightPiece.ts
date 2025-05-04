import { ChessPieceData, ChessPieceStrategy, GameState, Position } from './ChessPiece.ts';
import { v4 } from 'uuid';

// Knight moves in L shape: 2 steps in one direction, then 1 step perpendicular
const knightMoves = (): Position[] => [
  { x: 2, y: 1 },    // 2 right, 1 down
  { x: 2, y: -1 },   // 2 right, 1 up
  { x: -2, y: 1 },   // 2 left, 1 down
  { x: -2, y: -1 },  // 2 left, 1 up
  { x: 1, y: 2 },    // 1 right, 2 down
  { x: 1, y: -2 },   // 1 right, 2 up
  { x: -1, y: 2 },   // 1 left, 2 down
  { x: -1, y: -2 },  // 1 left, 2 up
];

export const KnightChessPieceStrategy: ChessPieceStrategy = {
  type: 'knight',
  nextMoves(piece: ChessPieceData, game: GameState): Position[] {
    return knightMoves()
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
    return knightMoves()
      .map(d => ({
        x: piece.position.x + d.x,
        y: piece.position.y + d.y,
      }))
      .filter(move => {
        // Check if the move is within bounds
        return move.x >= 0 && move.x < 8 && move.y >= 0 && move.y < 8;
      })
      .filter(move => {
        // check if the target has an opponent piece
        const targetPiece = game.board.find(
          p => p.position.x === move.x && p.position.y === move.y
        );
        return targetPiece != null && targetPiece.color !== piece.color;
      });
  },
};

export const createKnightPiece = (color: 'black' | 'white', position: Position): ChessPieceData => {
  return {
    id: v4(),
    color,
    position,
    type: 'knight',
    image: color === 'white' ? '/pieces/knight-white.svg' : '/pieces/knight-black.svg',
  };
};