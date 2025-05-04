import { Socket } from 'socket.io';
import { GameState } from '../chess/ChessPiece.ts';

export interface GameStateMessageData {
  id: string;
  gameState: GameState;
  nextMove: 'black' | 'white';
  status: 'waiting' | 'playing';
  players: {
    white?: string;
    black?: string;
  };
}

export interface GameManagementData {
  action: 'join' | 'create-new';
}

export type MessageTypes = {
  gameManagement: GameManagementData;
  gameState: GameStateMessageData;
  gameStarted: GameStateMessageData;
  connection: Socket;
  disconnect: undefined;
  error: { message: string };
  connect: undefined;
};

export const createSendMesssage = <T extends keyof MessageTypes>(
  type: T,
  data: MessageTypes[T]
): [T, MessageTypes[T]] => {
  return [type, data];
};

export const createReceiveMessage = <T extends keyof MessageTypes>(
  type: T,
  callback: MessageTypes[T] extends undefined ? () => void : (data: MessageTypes[T]) => void
): [T, MessageTypes[T] extends undefined ? () => void : (data: MessageTypes[T]) => void] => {
  return [type, callback];
};
