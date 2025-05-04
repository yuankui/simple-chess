import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  createReceiveMessage,
  createSendMesssage,
  GameStateMessageData,
} from '../messages/message-types.ts';

export function useSocket() {
  const [gameStates, setGameStates] = useState<GameStateMessageData[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create socket connection
    socketRef.current = io('http://localhost:3000');

    // Set up event listeners
    socketRef.current.on(
      ...createReceiveMessage('connect', () => {
        console.log('Connected to server');
        setConnected(true);
        setError(null);
      })
    );

    socketRef.current.on(
      ...createReceiveMessage('gameState', (data: GameStateMessageData) => {
        setGameStates(prev => [...prev, data]);
      })
    );

    socketRef.current.on(
      ...createReceiveMessage('gameStarted', (data: GameStateMessageData) => {
        console.log('Game started:', data);
        setGameStates([data]);
      })
    );

    socketRef.current.on(
      ...createReceiveMessage('error', (data: { message: string }) => {
        console.error('Socket error:', data.message);
        setError(data.message);
      })
    );

    socketRef.current.on(
      ...createReceiveMessage('disconnect', () => {
        console.log('Disconnected from server');
        setConnected(false);
      })
    );

    // Clean up on unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const createNewGame = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit(...createSendMesssage('gameCreate', undefined));
    }
  }, []);

  const joinGame = useCallback((gameId: string) => {
    if (socketRef.current) {
      socketRef.current.emit(...createSendMesssage('gameJoin', { id: gameId })); // Replace with actual game ID
    }
  }, []);

  const updateGameState = useCallback((gameState: GameStateMessageData & { gameId: string }) => {
    if (socketRef.current && gameState.id) {
      socketRef.current.emit('gameState', gameState);
    } else {
      setError('Cannot update game state: no game ID provided');
    }
  }, []);

  return {
    playerId: socketRef.current?.id,
    connected,
    gameStates,
    error,
    createNewGame,
    joinGame,
    updateGameState,
  };
}
