import { useState, useEffect } from 'react';
import './App.css';
import { useSocket } from './hooks/useSocket';
import ChessBoard from './components/ChessBoard';
import GameControls from './components/GameControls';
import { GameStateMessageData } from './hooks/useSocket';
import { ChessPiece, Position } from './chess/ChessPiece';

function App() {
  const { connected, updateGameState, gameStates, joinGame, currentGameId, createNewGame, error } =
    useSocket();

  const [currentGame, setCurrentGame] = useState<GameStateMessageData>();
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');

  // Update current game when game states change
  useEffect(() => {
    if (gameStates.length > 0 && currentGameId) {
      // Get the latest game state for current game
      const latestGame = [...gameStates].reverse().find(game => game.id === currentGameId);

      if (latestGame) {
        setCurrentGame(latestGame);

        // Determine player color based on socket ID
        // This is a simplified approach - in a real app you would manage this better
        if (latestGame.players.white === 'socket.id') {
          setPlayerColor('white');
        } else if (latestGame.players.black === 'socket.id') {
          setPlayerColor('black');
        }
      }
    }
  }, [gameStates, currentGameId]);

  // Handle piece movement
  const handleMove = (from: Position, to: Position) => {
    if (!currentGame) return;

    // Create a deep copy of the current game state
    const updatedGameState = JSON.parse(JSON.stringify(currentGame));

    // Find the piece to move
    const pieceIndex = updatedGameState.gameState.board.findIndex(
      (p: ChessPiece) => p.position.x === from.x && p.position.y === from.y
    );

    if (pieceIndex >= 0) {
      // Update piece position
      updatedGameState.gameState.board[pieceIndex].position = to;

      // Toggle last move
      updatedGameState.lastMove = updatedGameState.lastMove === 'white' ? 'black' : 'white';

      // Send updated game state to server
      updateGameState(updatedGameState);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Simple Chess</h1>
      </header>

      <main className="app-main">
        <GameControls
          currentGameId={currentGameId}
          connected={connected}
          onCreateGame={createNewGame}
          onJoinGame={joinGame}
        />

        {error && <div className="error-message">{error}</div>}

        <div className="game-container">
          <ChessBoard gameState={currentGame} onMove={handleMove} playerColor={playerColor} />
        </div>
      </main>
    </div>
  );
}

export default App;
