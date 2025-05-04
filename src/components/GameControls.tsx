import { GameStateMessageData } from '../messages/message-types.ts';
import { useState } from 'react';

interface GameControlsProps {
  currentGame: GameStateMessageData;
  connected: boolean;
  onCreateGame: () => void;
  onJoinGame: (gameId: string) => void;
}

export default function GameControls({
  currentGame,
  connected,
  onCreateGame,
  onJoinGame,
}: GameControlsProps) {
  const [gameId, setGameId] = useState<string>('');
  const handleJoinGame = () => {
    onJoinGame(gameId);
  };

  if (currentGame) {
    return (
      <div className="game-controls">
        <div className="current-game">
          <h3>Current Game</h3>
          <p>
            Game ID: <span className="game-id">{currentGame.id}</span>
          </p>
          <p>Share this ID with your opponent</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-controls">
      <div className="connection-status">
        Status: {connected ? '✅ Connected' : '❌ Disconnected'}
      </div>

      <div className="control-buttons">
        <button className="create-game-btn" onClick={onCreateGame} disabled={!connected}>
          Create New Game
        </button>

        <div className="join-game">
          <input value={gameId} onChange={e => setGameId(e.target.value)} />
          <button onClick={handleJoinGame} disabled={!connected || !!currentGame}>
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
}
