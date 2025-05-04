import { useEffect, useState } from 'react';
import { ChessPieceData, Position } from '../chess/ChessPiece';
import { GameStateMessageData } from '../messages/message-types.ts';
import { strategies } from '../chess/strategies.ts';

interface ChessBoardProps {
  gameState?: GameStateMessageData;
  onMove?: (from: Position, to: Position) => void;
  playerColor?: 'white' | 'black';
}

export default function ChessBoard({ gameState, onMove, playerColor = 'white' }: ChessBoardProps) {
  const [selectedPiece, setSelectedPiece] = useState<ChessPieceData | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);

  console.log({ gameState });
  // Reset selected piece when game state changes
  useEffect(() => {
    setSelectedPiece(null);
    setPossibleMoves([]);
  }, [gameState]);

  // Function to handle clicking on a piece
  const handlePieceClick = (piece: ChessPieceData) => {
    // Only allow selecting pieces of the player's color
    const strategy = strategies.find(s => s.type === piece.type)!;
    if (piece.color === playerColor) {
      setSelectedPiece(piece);
      // Calculate possible moves for this piece
      if (gameState?.gameState) {
        const moves = strategy.nextMoves(piece, gameState.gameState);
        const kills = strategy.nextKills(piece, gameState.gameState);
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
  const renderPiece = (piece: ChessPieceData) => {
    console.log({ piece });
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
    
    // Determine if we should flip the board (when player is black)
    const isFlipped = playerColor === 'black';

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        // Calculate actual coordinates based on board orientation
        const actualY = isFlipped ? 7 - y : y;
        const actualX = isFlipped ? 7 - x : x;
        
        const isBlackSquare = (actualX + actualY) % 2 === 1;
        const isPossibleMove = possibleMoves.some(move => 
          (isFlipped ? 7 - move.x : move.x) === actualX && 
          (isFlipped ? 7 - move.y : move.y) === actualY
        );

        // Find if there's a piece at this position (using actual board coordinates)
        const piece = gameStateBoard.find(p => 
          (isFlipped ? 7 - p.position.x : p.position.x) === actualX && 
          (isFlipped ? 7 - p.position.y : p.position.y) === actualY
        );

        // For coordinate display, use logical board coordinates
        const displayX = isFlipped ? 7 - actualX : actualX;
        const displayY = isFlipped ? 7 - actualY : actualY;

        board.push(
          <div
            key={`${actualX}-${actualY}`}
            className={`
              chess-square 
              ${isBlackSquare ? 'black' : 'white'} 
              ${isPossibleMove ? 'possible-move' : ''}
            `}
            onClick={() => handleCellClick(
              isFlipped ? 7 - actualX : actualX,
              isFlipped ? 7 - actualY : actualY
            )}
          >
            {piece && renderPiece(piece)}
            <div className="coordinates">{`${String.fromCharCode(97 + displayX)}${8 - displayY}`}</div>
          </div>
        );
      }
    }

    return board;
  };

  const whoseTurn = () => {
    if (playerColor === gameState?.nextMove) {
      return 'Your turn';
    }
    if (gameState?.nextMove === 'white') {
      return "White's turn";
    } else {
      return "Black's turn";
    }
  };
  return (
    <div className="chess-board-container">
      <div className={`chess-board ${playerColor === 'black' ? 'rotated' : ''}`}>
        {renderBoard()}
      </div>
      <div className="board-status">
        <div className="player-color-indicator">
          Playing as: <span className={`color-${playerColor}`}>{playerColor}</span>
          {playerColor === 'black' && <span className="rotated-indicator"> (board rotated)</span>}
        </div>
        {gameState?.gameState?.gameOver ? (
          <div className="game-over">
            Game Over!{' '}
            {gameState.gameState.winner ? `${gameState.gameState.winner} wins!` : 'Draw!'}
          </div>
        ) : (
          <div className="turn-indicator">
            {gameState?.status === 'playing' ? whoseTurn() : 'Waiting to start'}
          </div>
        )}
      </div>
    </div>
  );
}
