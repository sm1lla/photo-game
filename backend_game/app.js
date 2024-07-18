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
  image_data: [], // Format:  {filename: "image_file.jpg", user: "examplePlayer1"}
  players: {
    1: { name: "examplePlayer1", score: 0 },
    2: { name: "examplePlayer2", score: 0 },
    3: { name: "examplePlayer3", score: 0 },
    4: { name: "examplePlayer4", score: 0 },
    5: { name: "examplePlayer5", score: 0 },
  },
};


io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  console.log(gameState);

  socket.on("userInfo", (user) => {
    gameState.players[socket.id] = { name: user.name, score : 0};
    socket.emit("currentPlayers", gameState.players);
  });

  socket.on("startGame", async () => {
    gameState.current_round = 1;

    // Select images for current round
    gameState.image_data = await selectImages(
      gameState.max_rounds,
      gameState.players
    );

    const gameInfo = {
      max_rounds: gameState.max_rounds,
      image_file_names: gameState.image_data.map((element) => element.filename),
    };
    io.emit("gameStarted", gameInfo);
  });

  socket.on("vote", (user_id) => {
    const correct_answer = gameState.image_data[gameState.current_round - 1]["user"];
    const response = {answer : correct_answer};
    
    if(user_id == correct_answer) {
      gameState.players[socket.id].score += 1;
    }
    io.emit("vote_response", response);
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
