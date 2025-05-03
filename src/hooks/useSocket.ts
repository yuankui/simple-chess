import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState } from '../chess/ChessPiece.ts';

interface MessageData {
  type: string;
}

export interface GameStateMessageData extends MessageData {
  type: 'gameState';
  id: string;
  gameState: GameState;
  lastMove: 'black' | 'white';
  status: 'waiting' | 'playing';
  players: {
    white?: string;
    black?: string;
  };
}

export interface GameManagementData extends MessageData {
  type: 'gameManagement';
  action: 'join' | 'create-new';
  gameId?: string; // Required for 'join' action
}

export function useSocket() {
  const [gameStates, setGameStates] = useState<GameStateMessageData[]>([]);
  const [connected, setConnected] = useState(false);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create socket connection
    socketRef.current = io('http://localhost:3000');

    // Set up event listeners
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      setError(null);
    });

    socketRef.current.on('gameState', (data: GameStateMessageData) => {
      setGameStates(prev => [...prev, data]);
    });

    socketRef.current.on('gameCreated', (data: GameStateMessageData & { id: string }) => {
      console.log('Game created:', data);
      setCurrentGameId(data.id);
      setGameStates(prev => [...prev, data]);
    });

    socketRef.current.on('gameStarted', (data: GameStateMessageData) => {
      console.log('Game started:', data);
      setGameStates(prev => [...prev, data]);
    });

    socketRef.current.on('playerLeft', (data: GameStateMessageData) => {
      console.log('Player left:', data);
      setGameStates(prev => [...prev, data]);
    });

    socketRef.current.on('error', (data: { message: string }) => {
      console.error('Socket error:', data.message);
      setError(data.message);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    // Clean up on unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const createNewGame = useCallback(() => {
    if (socketRef.current) {
      const data: GameManagementData = {
        type: 'gameManagement',
        action: 'create-new',
      };
      socketRef.current.emit('gameManagement', data);
    }
  }, []);

  const joinGame = useCallback((gameId: string) => {
    if (socketRef.current) {
      const data: GameManagementData = {
        type: 'gameManagement',
        action: 'join',
        gameId,
      };
      socketRef.current.emit('gameManagement', data);
      setCurrentGameId(gameId);
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
    connected,
    gameStates,
    currentGameId,
    error,
    createNewGame,
    joinGame,
    updateGameState,
  };
}
