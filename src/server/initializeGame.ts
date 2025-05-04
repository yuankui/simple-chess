import { GameStateMessageData } from '../messages/message-types.ts';

export const initializeGame = (gameId: string, playerId: string) => {
  const newGame: GameStateMessageData = {
    id: gameId,
    players: {
      white: playerId, // The creator is the first player
      black: undefined, // No second player yet
    },
    status: 'waiting', // waiting for another player
    gameState: {
      gameOver: false,
      board: [],
      winner: null,
    },
    nextMove: 'white',
  };
  return newGame;
};
