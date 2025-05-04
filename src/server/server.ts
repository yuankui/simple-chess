import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
  createReceiveMessage,
  createSendMesssage,
  GameStateMessageData,
} from '../messages/message-types.ts';
import { createPendingGame } from './create-pending-game.ts';
import { createInitialBoard } from './create-initial-board.ts';
import { v4 } from 'uuid';

const app = express();

// Helper function to generate a unique game ID
function generateUniqueId(): string {
  return v4();
}

// Store active games - in a real app, use a database
const activeGames = new Map<string, GameStateMessageData>();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // Vite's default port
    methods: ['GET', 'POST'],
  },
});

// Socket.io connection handler
io.on('connection', (socket: Socket) => {
  console.log('a user connected');

  socket.on(
    ...createReceiveMessage('gameCreate', () => {
      console.log('Game management action received: gameCreate');
      // Generate a unique game ID
      const gameId = generateUniqueId();

      // Create a new game room
      socket.join(gameId);

      // Store game state (in a real app, you might use a database)
      const newGame = createPendingGame(gameId, socket.id);

      // Add game to active games (in a real app, use a database)
      activeGames.set(gameId, newGame);

      // Inform the client that game was created

      socket.emit(...createSendMesssage('gameStarted', newGame));
      console.log(`New game created with ID: ${gameId}`);
    })
  );
  socket.on(
    ...createReceiveMessage('gameJoin', data => {
      console.log('Game management action received: gameJoin', data);
      // find a game with only one player
      const game = activeGames.get(data.id);

      if (!game) {
        socket.emit(...createSendMesssage('error', { message: 'No available games to join' }));
        return;
      }

      // Add player to the game
      if (game.players.white == null || game.players.black == null) {
        game.players = {
          black: game.players.black ?? socket.id,
          white: game.players.white ?? socket.id,
        };
      }
      game.status = 'playing';

      // Join the socket room for this game
      socket.join(game.id);

      // initialize game state
      game.gameState = {
        gameOver: false,
        board: createInitialBoard(),
        winner: null,
      };

      // Notify all players in the room that game is starting
      io.to(game.id).emit(...createSendMesssage('gameStarted', game));

      console.log(`Player joined game: ${game.id}, game started`);
    })
  );
  // Listen for game management messages from the client

  // Listen for game state updates
  socket.on(
    ...createReceiveMessage('gameState', (data: GameStateMessageData) => {
      // Validate the data has a gameId
      if (!data.id) {
        socket.emit('error', { message: 'Game ID is required to update game state' });
        return;
      }

      const activeGame = activeGames.get(data.id);

      // Broadcast the game state to all players in the room
      if (activeGame) {
        io.to(data.id).emit(
          ...createSendMesssage('gameState', {
            ...data,
          })
        );
      } else {
        socket.emit('error', { message: `Game with ID ${data.id} not found` });
      }

      console.log(`Game state updated for game: ${data.id}`);
    })
  );

  socket.on('disconnect', () => {
    console.log('user disconnected');

    // Handle disconnection - find games where this player was participating
    for (const [gameId, game] of activeGames.entries()) {
      if (Object.values(game.players).includes(socket.id)) {
        // Remove player from the game
        if (game.players.white === socket.id) {
          game.players.white = undefined; // Remove white player
        } else if (game.players.black === socket.id) {
          game.players.black = undefined; // Remove black player
        }

        if (Object.values(game.players).length === 0) {
          // No players left, remove the game
          activeGames.delete(gameId);
          console.log(`Game removed: ${gameId}`);
        } else {
          // Notify remaining players
          io.to(gameId).emit('playerLeft', {
            type: 'gameState',
            gameId,
            message: 'Your opponent has disconnected',
          });
          console.log(`Player left game: ${gameId}`);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server ready for connections`);
});
