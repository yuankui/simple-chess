import { useEffect, useState } from 'react';
import { ChessPiece, Position } from '../chess/ChessPiece';
import { GameStateMessageData } from '../hooks/useSocket';

interface ChessBoardProps {
  gameState?: GameStateMessageData;
  onMove?: (from: Position, to: Position) => void;
  playerColor?: 'white' | 'black';
}

export default function ChessBoard({ gameState, onMove, playerColor = 'white' }: ChessBoardProps) {
  const [selectedPiece, setSelectedPiece] = useState<ChessPiece | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);

  console.log({ gameState });
  // Reset selected piece when game state changes
  useEffect(() => {
    setSelectedPiece(null);
    setPossibleMoves([]);
  }, [gameState]);

  // Function to handle clicking on a piece
  const handlePieceClick = (piece: ChessPiece) => {
    // Only allow selecting pieces of the player's color
    if (piece.color === playerColor) {
      setSelectedPiece(piece);
      // Calculate possible moves for this piece
      if (gameState?.gameState) {
        const moves = piece.nextMoves(gameState.gameState);
        const kills = piece.nextKills(gameState.gameState);
        setPossibleMoves([...moves, ...kills]);
      }
    }
  };

  // Function to handle clicking on a cell to move
  const handleCellClick = (x: number, y: number) => {
    if (selectedPiece && possibleMoves.some(move => move.x === x && move.y === y)) {
      // Valid move, notify parent component
      if (onMove) {
        onMove(selectedPiece.position, { x, y });
      }
      // Reset selection
      setSelectedPiece(null);
      setPossibleMoves([]);
    }
  };

  // Function to render a chess piece
  const renderPiece = (piece: ChessPiece) => {
    const isSelected = selectedPiece === piece;
    return (
      <div
        className={`chess-piece ${piece.color} ${piece.type} ${isSelected ? 'selected' : ''}`}
        onClick={() => handlePieceClick(piece)}
      >
        <img src={piece.image} width={40} height={40} alt={piece.type} />
      </div>
    );
  };
  // Create an 8x8 board
  const renderBoard = () => {
    const board = [];
    const gameStateBoard = gameState?.gameState?.board || [];

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const isBlackSquare = (x + y) % 2 === 1;
        const isPossibleMove = possibleMoves.some(move => move.x === x && move.y === y);

        // Find if there's a piece at this position
        const piece = gameStateBoard.find(p => p.position.x === x && p.position.y === y);

        board.push(
          <div
            key={`${x}-${y}`}
            className={`
              chess-square 
              ${isBlackSquare ? 'black' : 'white'} 
              ${isPossibleMove ? 'possible-move' : ''}
            `}
            onClick={() => handleCellClick(x, y)}
          >
            {piece && renderPiece(piece)}
            <div className="coordinates">{`${String.fromCharCode(97 + x)}${8 - y}`}</div>
          </div>
        );
      }
    }

    return board;
  };

  return (
    <div className="chess-board-container">
      <div className="chess-board">{renderBoard()}</div>
      <div className="board-status">
        {gameState?.gameState?.gameOver ? (
          <div className="game-over">
            Game Over!{' '}
            {gameState.gameState.winner ? `${gameState.gameState.winner} wins!` : 'Draw!'}
          </div>
        ) : (
          <div className="turn-indicator">
            {gameState?.lastMove
              ? `${gameState.lastMove === 'white' ? 'Black' : 'White'}'s turn`
              : 'Waiting to start'}
          </div>
        )}
      </div>
    </div>
  );
}
