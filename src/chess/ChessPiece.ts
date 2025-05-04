export interface Position {
  x: number; // X coordinate on the board (0-7)
  y: number; // Y coordinate on the board (0-7)
}

export interface GameState {
  board: ChessPiece[]; // Array of chess pieces on the board
  gameOver: boolean; // Game over status
  winner: 'white' | 'black' | null; // Winner of the game
}

export interface ChessPiece {
  color: 'white' | 'black';
  position: Position;
  type: 'pawn'; // TODO: add other types like 'rook', 'knight', etc.
  image: string; // Image URL for the piece
  nextMoves(game: GameState): Position[]; // Possible next moves
  nextKills(game: GameState): Position[]; // Possible next kills
}
