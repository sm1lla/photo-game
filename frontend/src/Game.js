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
  const [gameStarted, setGameStarted] = React.useState(false);

  const startTime = 10;
  const timeLeft =
    startTime - secondsPassed >= 0 ? startTime - secondsPassed : 0;

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

    const setNewImage = async (image_file_names, current_round) => {
      const newImage = await get_current_image(image_file_names[current_round]);
      setImage(newImage);
    };

    socket.on("gameStarted", (gameInfo) => {
      // set gameState
      setGameState((previousState) => ({
        ...previousState,
        max_rounds: gameInfo.max_rounds,
        image_file_names: gameInfo.image_file_names,
      }));

      setNewImage(gameInfo.image_file_names, gameState.current_round);
    });

    socket.on("vote_response", (response) => {
      if (response.answer === voteSelected)
        console.log("Correct.", response.answer);
      else console.log("Incorrect.", response.answer);
    });

    socket.on("next", () => {
      setGameState((previousState) => ({
        ...previousState,
        current_round: gameState.current_round + 1,
      }));
      setNewImage(gameState.image_file_names, gameState.current_round + 1).then(
        () => {
          setSecondsPassed(0);
          setVoteSelected("");
        }
      );
    });

    return () => {
      socket.off("currentPlayers");
      socket.off("gameStarted");
      socket.off("vote_response");
      socket.off("next");
    };
  }, [gameState, voteSelected]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsPassed((sp) => {
        if (sp >= startTime && gameStarted) {
          if (sp === startTime) {
            socket.emit("vote", voteSelected);
          }
        }
        return sp + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [voteSelected, gameStarted]);

  const voteForPlayer = (player_name) => {
    console.log("Voted for:", player_name);
    if (voteSelected == "") setVoteSelected(player_name);
  };

  const startGame = () => {
    socket.emit("startGame");
    setSecondsPassed(0);
    setGameStarted(true);
  };

  return (
    <div className="Game">
      {gameStarted ? (
        <header className="Game-header">
          {image ? (
            <img src={`data:image/jpeg;base64,${image}`} alt="" />
          ) : (
            <p>Loading...</p>
          )}
          <p className="counter">{gameStarted ? countdown : ""}</p>
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
          <button
            key={"next"}
            onClick={() => {
              socket.emit("next");
            }}
          >
            {"Next image"}
          </button>
        </header>
      ) : (
        <div className="LobbyScreen">
          <h1>Lobby</h1>
          <h2>Current players:</h2>
          <ul className="playerList">
            {Object.values(players).map((player) => (
              <li key={player.name}>{player.name}</li>
            ))}
          </ul>
          <button key={"start"} onClick={startGame}>
            {"Start game!"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Game;
