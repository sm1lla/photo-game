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
      if(response.answer === voteSelected)
        console.log("Correct.", response.answer);
      else 
        console.log("Incorrect.", response.answer);
    })

    return () => {
      socket.off("currentPlayers");
      socket.off("gameStarted");
      socket.off("vote_response");
    };
  }, [gameState, voteSelected]);

  const voteForPlayer = (player_name) => {
    setVoteSelected(player_name);
    socket.emit("vote", player_name);
  };

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
            <button key={player.name} onClick={() => voteForPlayer(player.name)}>
              {player.name}
            </button>
          ))}
        </div>
        <button key={"start"} onClick={() => socket.emit("startGame")}>
              {"START GAME!"}
            </button>
      </header>
    </div>
  );
}

export default Game;
