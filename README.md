# Simple Chess - Multiplayer Chess with React and Socket.IO

A real-time multiplayer chess game built with React, TypeScript, Vite, and Socket.IO, using Bun as the JavaScript runtime.

![Simple Chess Screenshot](https://example.com/screenshot.png)

## Features

- Real-time multiplayer chess using Socket.IO
- Create or join games with a unique ID
- Visual chess board with move highlighting
- Turn-based gameplay with state synchronization
- Clean, responsive UI that works on desktop and mobile

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Socket.IO Client

### Backend
- Bun runtime
- Express.js
- Socket.IO Server
- TypeScript

## Setup and Installation

### Prerequisites

- [Bun](https://bun.sh/) - Fast JavaScript runtime, bundler, and package manager

Install Bun (if not already installed):
```bash
curl -fsSL https://bun.sh/install | bash
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/simple-chess.git
   cd simple-chess
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

## Running the Application

The application consists of two parts that need to be run simultaneously:

### 1. Start the Backend Server

```bash
bun run server
```

This will start the Socket.IO server on http://localhost:3000

### 2. Start the Frontend Development Server

In a separate terminal:

```bash
bun run dev
```

This will start the Vite development server. Open your browser to the URL shown in the terminal output (typically http://localhost:5173).

## How to Play

1. First player clicks "Create New Game" to create a new game session
2. The game will generate a unique game ID that can be shared with another player
3. Second player clicks "Join Game" to join the existing game
4. When both players have joined, the game starts automatically
5. White moves first, then players alternate turns
6. Click on a piece to select it, then click on a highlighted square to move

## Project Structure

```
simple-chess/
├── public/              # Static assets
│   └── pieces/          # Chess piece SVGs
├── src/                 # Frontend source code
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── chess/           # Chess game logic
│   └── messages/        # Message type definitions
├── server.ts            # Socket.IO backend server
├── tsconfig.json        # TypeScript configuration
└── tsconfig.server.json # Server TypeScript configuration
```

## Limitations
- The rule is not correct for now.