import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { randomUUID } from 'node:crypto';
import { GameManagementData, GameStateMessageData } from './src/hooks/useSocket.js';
import { MessageTypes } from './src/messages/message-types.js';

const app = express();

// Helper function to generate a unique game ID
function generateUniqueId(): string {
  return randomUUID();
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

  // Send a welcome message when a user connects
  socket.emit('welcome', { message: 'Welcome to the server!' });

  // Listen for game management messages from the client
  socket.on(MessageTypes.gameManagement, (data: GameManagementData) => {
    console.log('Game management action received:', data);

    switch (data.action) {
      case 'create-new': {
        // Generate a unique game ID
        const gameId = generateUniqueId();

        // Create a new game room
        socket.join(gameId);

        // Store game state (in a real app, you might use a database)
        const newGame: GameStateMessageData = {
          id: gameId,
          players: {
            white: socket.id, // The creator is the first player
            black: '', // No second player yet
          },
          status: 'waiting', // waiting for another player
          gameState: {
            gameOver: false,
            board: [],
            winner: null,
          },
          type: 'gameState',
          lastMove: 'white',
        };

        // Add game to active games (in a real app, use a database)
        activeGames.set(gameId, newGame);

        // Inform the client that game was created
        socket.emit('gameCreated', {
          type: 'gameState',
          gameId,
          message: `Game created with ID: ${gameId}. Waiting for opponent.`,
        });

        console.log(`New game created with ID: ${gameId}`);
        break;
      }

      case 'join': {
        // find a game with only one player
        const game = Array.from(activeGames.values()).find(
          g => g.id === data.gameId && (g.players.black == null || g.players.white == null)
        );

        if (!game) {
          socket.emit('error', {
            message: `Game with ID ${data.gameId} not found or already full`,
          });
          return;
        }

        // Add player to the game
        game.players.black = socket.id; // Assign the second player
        game.status = 'playing';

        // Join the socket room for this game
        socket.join(game.id);

        // Notify all players in the room that game is starting
        io.to(game.id).emit(MessageTypes.gameStarted, {
          type: 'gameState',
          gameId: data.gameId,
          message: 'Both players have joined. Game is starting!',
        });

        console.log(`Player joined game: ${data.gameId}`);
        break;
      }
      default:
        socket.emit('error', { message: `Unknown action: ${data.action}` });
    }
  });

  // Listen for game state updates
  socket.on(MessageTypes.gameState, (data: GameStateMessageData) => {
    // Validate the data has a gameId
    if (!data.id) {
      socket.emit('error', { message: 'Game ID is required to update game state' });
      return;
    }

    const game = activeGames.get(data.id);

    // Broadcast the game state to all players in the room
    if (game) {
      io.to(data.id).emit(MessageTypes.gameState, {
        type: 'gameState',
        gameId: data.id,
        gameState: data.gameState,
        lastMove: data.lastMove,
      });
    } else {
      socket.emit('error', { message: `Game with ID ${data.id} not found` });
    }

    console.log(`Game state updated for game: ${data.id}`);
  });

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
