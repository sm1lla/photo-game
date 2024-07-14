import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { selectImages } from "./services/select_images.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React app address
    methods: ["GET", "POST"],
  },
});

app.use(cors()); // Enable CORS

const gameState = {
  current_round: 0,
  max_rounds: 5,
  image_ids: [],
  players: {
    1: { name: "examplePlayer1" },
    2: { name: "examplePlayer2" },
    3: { name: "examplePlayer3" },
    4: { name: "examplePlayer4" },
    5: { name: "examplePlayer5" },
  },
};

gameState.image_ids = await selectImages(gameState.max_rounds, gameState.players);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  console.log(gameState);

  socket.on("userInfo", (user) => {
    gameState.players[socket.id] = user;
    socket.emit("currentPlayers", gameState.players);
  });

  socket.on("startGame", () => {
    gameState.current_round = 1;
    io.emit("gameStarted", gameState);
  });

  socket.on("disconnect", () => {
    delete gameState.players[socket.id];
    io.emit("playerDisconnected", socket.id);
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(3002, () => {
  console.log("Server is listening on port 3002");
});
