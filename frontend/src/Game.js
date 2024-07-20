import "./Game.css";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { get_current_image } from "./services/get_image";

const socket = io("http://localhost:3002");
const user = { name: "User" };

function Game() {
  const [players, setPlayers] = useState({});
  const [image, setImage] = useState({});
  const [gameState, setGameState] = useState({
    current_round: 0,
    max_rounds: 0,
    image_file_names: [],
  });
  const [voteSelected, setVoteSelected] = useState("");
  const [secondsPassed, setSecondsPassed] = React.useState(0);

  const startTime = 30;
  const timeLeft = startTime - secondsPassed;

  const countdown = `00:${timeLeft.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  })}`;

  useEffect(() => {
    // handle socket events here
    socket.emit("userInfo", user);

    socket.on("currentPlayers", (players) => {
      // set players
      setPlayers(players);
    });

    socket.on("gameStarted", async (gameInfo) => {
      // set gameState
      setGameState((previousState) => ({
        ...previousState,
        max_rounds: gameInfo.max_rounds,
        image_file_names: gameInfo.image_file_names,
      }));

      const newImage = await get_current_image(
        gameInfo.image_file_names[gameState.current_round]
      );
      setImage(newImage);
    });

    socket.on("vote_response", (response) => {
      if (response.answer === voteSelected)
        console.log("Correct.", response.answer);
      else console.log("Incorrect.", response.answer);
    });

    return () => {
      socket.off("currentPlayers");
      socket.off("gameStarted");
      socket.off("vote_response");
    };
  }, [gameState, voteSelected]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsPassed((sp) => {
        if (sp >= startTime) {
          return sp;
        }
        return sp + 1
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const voteForPlayer = (player_name) => {
    setVoteSelected(player_name);
    socket.emit("vote", player_name);
  };

  const startGame = () => {
    socket.emit("startGame");
    setSecondsPassed(0);
  }
 
  return (
    <div className="Game">
      <header className="Game-header">
        {image ? (
          <img src={`data:image/jpeg;base64,${image}`} alt="" />
        ) : (
          <p>Loading...</p>
        )}
        <div className="button-container">
          {Object.values(players).map((player) => (
            <button
              key={player.name}
              onClick={() => voteForPlayer(player.name)}
            >
              {player.name}
            </button>
          ))}
        </div>
        <button key={"start"} onClick={startGame}>
          {"START GAME!"}
        </button>
      </header>
      <p>{countdown}</p>
    </div>
  );
}

export default Game;
