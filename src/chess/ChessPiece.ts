export interface Position {
  x: number; // X coordinate on the board (0-7)
  y: number; // Y coordinate on the board (0-7)
}

export interface GameState {
  board: ChessPieceData[]; // Array of chess pieces on the board
  gameOver: boolean; // Game over status
  winner: 'white' | 'black' | null; // Winner of the game
}

export interface ChessPieceStrategy {
  type: ChessPieceData['type'];
  nextMoves(piece: ChessPieceData, game: GameState): Position[]; // Possible next moves
  nextKills(piece: ChessPieceData, game: GameState): Position[]; // Possible next kills
}

export interface ChessPieceData {
  id: string; // Unique identifier for the piece
  color: 'white' | 'black';
  position: Position;
  type: 'pawn' | 'knight' | 'rook' | 'bishop' | 'queen' | 'king';
  image: string; // Image URL for the piece
}
