import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';

interface MessageData {
  type: string;
}

interface GameStateMessageData extends MessageData {
  type: 'gameState';
}

export interface GameManagementData extends MessageData {
  type: 'gameManagement';
  action: 'join' | 'create-new';
}

export function useSocket() {
  const [gameStates, setGameStates] = useState<GameStateMessageData[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create socket connection
    socketRef.current = io('http://localhost:3000');

    // Set up event listeners
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socketRef.current.on('gameState', (data: GameStateMessageData) => {
      setGameStates(prev => [...prev, data]);
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

  const updateGameState = useCallback((gameState: GameStateMessageData) => {
    if (socketRef.current) {
      socketRef.current.emit('gameState', gameState);
    }
  }, []);

  return {
    connected,
    gameStates,
    updateGameState,
  };
}
