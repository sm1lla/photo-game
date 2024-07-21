import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { selectImages } from "./services/select_images.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"], // React app address
    methods: ["GET", "POST"],
  },
});

app.use(cors()); // Enable CORS

const gameState = {
  current_round: 0,
  max_rounds: 1,
  image_data: [], // Format:  {filename: "image_file.jpg", user: "examplePlayer1"}
  players: {
    1: { name: "examplePlayer1", score: 0, voted: true },
    2: { name: "examplePlayer2", score: 0, voted: true },
    3: { name: "examplePlayer3", score: 0, voted: true },
  },
};

function allVoted() {
  const players_voted = Object.values(gameState.players).map(
    (player) => player.voted
  );
  return players_voted.every(Boolean);
}

function get_scores() {
  const scores = {};
  Object.keys(gameState.players).map((key) => {
    scores[key] = gameState.players[key].score;
  });
  return scores;
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  console.log(gameState);

  socket.on("userInfo", (user) => {
    gameState.players[socket.id.toString()] = { name: user.name, score: 0, voted: false };
    io.emit("currentPlayers", gameState.players);
  });

  socket.on("startGame", async () => {
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
    let correct_answer;
    try {
      correct_answer = gameState.image_data[gameState.current_round]["user"];
    } catch {
      correct_answer = "No answer found.";
    }
    console.log("correct_answer", correct_answer);
    console.log("voted", user_id);
    const response = { answer: correct_answer };

    if (user_id == correct_answer) {
      gameState.players[socket.id].score += 1;
    }
    gameState.players[socket.id].voted = true;
    socket.emit("vote_response", response);
  });

  socket.on("next", () => {
    console.log(gameState);
    if (allVoted()) {
      Object.keys(gameState.players).forEach((key) => {
        if (!["1", "2", "3"].includes(key))
          gameState.players[key].voted = false;
      });
      if (gameState.current_round + 1 == gameState.max_rounds) {
        gameState.current_round = 0;
        io.emit("scores", get_scores());
      } else {
        gameState.current_round += 1;
        io.emit("next");
      }
    }
  });

  socket.on("disconnect", () => {
    delete gameState.players[socket.id];
    io.emit("currentPlayers", gameState.players);
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(3002, () => {
  console.log("Server is listening on port 3002");
});
