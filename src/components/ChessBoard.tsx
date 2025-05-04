import { useEffect, useMemo, useRef, useState } from 'react';
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
    // check if it's the player's turn
    if (gameState?.nextMove !== playerColor) {
      return false;
    }
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
      return true;
    }
    return true;
  };

  const positionRotate = (position: Position) => {
    const isFlipped = playerColor === 'black';
    return {
      x: isFlipped ? 7 - position.x : position.x,
      y: isFlipped ? 7 - position.y : position.y,
    };
  };
  // Function to handle clicking on a cell to move
  const handleCellClick = (x: number, y: number) => {
    console.log('clicking cell');
    if (selectedPiece && possibleMoves.some(move => move.x === x && move.y === y)) {
      // Valid move, notify parent component
      if (onMove) {
        onMove(positionRotate(selectedPiece.position), positionRotate({ x, y }));
      }
      // Reset selection
      setSelectedPiece(null);
      setPossibleMoves([]);
    }
  };

  // Function to render a chess piece
  const renderPiece = (piece: ChessPieceData) => {
    const isSelected = selectedPiece === piece;
    return (
      <div
        key={piece.id}
        className={`chess-piece ${piece.color} ${piece.type} ${isSelected ? 'selected' : ''}`}
        onClick={() => {
          const processed = handlePieceClick(piece);
          if (processed) {
            handleCellClick(piece.position.x, piece.position.y);
          }
        }}
        style={{
          left: (piece.position.x * boardWidth) / 8,
          top: (piece.position.y * boardWidth) / 8,
        }}
      >
        <img src={piece.image} width={boardWidth / 8} height={boardWidth / 8} alt={piece.type} />
      </div>
    );
  };

  const rotatedPieces = useMemo(() => {
    return gameState?.gameState.board.map(piece => {
      const isFlipped = playerColor === 'black';
      const actualX = isFlipped ? 7 - piece.position.x : piece.position.x;
      const actualY = isFlipped ? 7 - piece.position.y : piece.position.y;

      return {
        ...piece,
        position: { x: actualX, y: actualY },
      };
    });
  }, [gameState?.gameState.board, playerColor]);

  const boardRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(0);
  useEffect(() => {
    if (!boardRef.current) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setBoardWidth(width);
      }
    });

    resizeObserver.observe(boardRef.current);
  }, [boardRef]);
  // Create an 8x8 board
  const renderBoard = () => {
    const board = [];
    const isFlipped = playerColor === 'black';
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        // Calculate actual coordinates based on board orientation
        const actualY = isFlipped ? 7 - y : y;
        const actualX = isFlipped ? 7 - x : x;

        const isBlackSquare = (actualX + actualY) % 2 === 1;
        const isPossibleMove = possibleMoves.some(
          move =>
            (isFlipped ? 7 - move.x : move.x) === actualX &&
            (isFlipped ? 7 - move.y : move.y) === actualY
        );

        board.push(
          <div
            key={`${x}-${y}`}
            className={`
              chess-square 
              ${isBlackSquare ? 'black' : 'white'} 
              ${isPossibleMove ? 'possible-move' : ''}
            `}
            onClick={() =>
              handleCellClick(isFlipped ? 7 - actualX : actualX, isFlipped ? 7 - actualY : actualY)
            }
          ></div>
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
      <div className={`chess-board`} ref={boardRef}>
        {renderBoard()}
        {rotatedPieces?.map(piece => {
          return renderPiece(piece);
        })}
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
