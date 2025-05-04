import { useState, useEffect, useMemo } from 'react';
import './App.css';
import { useSocket } from './hooks/useSocket';
import ChessBoard from './components/ChessBoard';
import GameControls from './components/GameControls';
import { ChessPieceData, Position } from './chess/ChessPiece';
import { GameStateMessageData } from './messages/message-types.ts';

function App() {
  const { connected, updateGameState, gameStates, joinGame, createNewGame, error, playerId } =
    useSocket();

  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');

  const latestGame = useMemo<GameStateMessageData>(
    () => gameStates[gameStates.length - 1],
    [gameStates]
  );

  // Update current game when game states change
  useEffect(() => {
    if (latestGame) {
      // Determine player color based on socket ID
      // This is a simplified approach - in a real app you would manage this better
      if (latestGame.players.white === playerId) {
        setPlayerColor('white');
      } else if (latestGame.players.black === playerId) {
        setPlayerColor('black');
      }
    }
  }, [gameStates, latestGame, playerId]);

  // Handle piece movement
  const handleMove = (from: Position, to: Position) => {
    // Create a deep copy of the current game state
    const existingPieces = latestGame.gameState.board;

    const fromPiece = existingPieces.find(
      (p: ChessPieceData) => p.position.x === from.x && p.position.y === from.y
    );
    if (!fromPiece) {
      console.error('No piece found at the source position');
      return;
    }

    // if piece exists, kill the piece at the target position, else just move
    const newPieces = existingPieces
      .map(p => {
        // exists
        if (p.position.x === to.x && p.position.y === to.y) {
          // kills
          return null;
        }
        // move
        if (p.position.x === from.x && p.position.y === from.y) {
          // move
          return {
            ...p,
            position: to,
          };
        }
        // no move
        return p;
      })
      .filter(p => p != null);

    console.log({ existingPieces, newPieces });
    // Update the game state
    const newGameState: GameStateMessageData = {
      ...latestGame,
      nextMove: latestGame.nextMove === 'white' ? 'black' : 'white',
      gameState: {
        ...latestGame.gameState,
        board: newPieces,
      },
    };
    updateGameState(newGameState);
  };

  useEffect(() => {
    if (!connected) {
      // Handle disconnection logic here
      console.log('Disconnected from server');
    }
  }, [connected]);
  return (
    <div className="app">
      <header className="app-header">
        <h1>Simple Chess</h1>
      </header>

      <main className="app-main">
        <GameControls
          currentGame={latestGame}
          connected={connected}
          onCreateGame={createNewGame}
          onJoinGame={joinGame}
        />

        {error && <div className="error-message">{error}</div>}

        <div className="game-container">
          <ChessBoard gameState={latestGame} onMove={handleMove} playerColor={playerColor} />
        </div>
      </main>
    </div>
  );
}

export default App;
