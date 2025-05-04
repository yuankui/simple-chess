interface GameControlsProps {
  currentGameId: string | null;
  connected: boolean;
  onCreateGame: () => void;
  onJoinGame: () => void;
}

export default function GameControls({
  currentGameId,
  connected,
  onCreateGame,
  onJoinGame,
}: GameControlsProps) {
  const handleJoinGame = () => {
    onJoinGame();
  };

  if (currentGameId) {
    return (
      <div className="game-controls">
        <div className="current-game">
          <h3>Current Game</h3>
          <p>
            Game ID: <span className="game-id">{currentGameId}</span>
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
          <button onClick={handleJoinGame} disabled={!connected || !!currentGameId}>
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
}
