import "./Game.css";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3002");
const user = {"name" : "User"}

function Game() {
  const [players, setPlayers] = useState({});

  useEffect(() => {
    // handle socket events Here
	socket.emit("userInfo", user);

    socket.on("currentPlayers", (players) => {
      // set players
      setPlayers(players);
    });

    return () => {
      socket.off("currentPlayers");
    };
  }, []);

  const handleButtonClick = () => {
    
  };

  return (
    <div className="Game">
      <header className="Game-header">
        <img
          src="https://via.placeholder.com/300"
          alt="Placeholder"
          className="image"
        />
        <div className="button-container">
          {Object.values(players).map((player) => (
            <button
              key={player.name}
              onClick={() => handleButtonClick()}
            >
              {player.name}
            </button>
          ))}
        </div>
      </header>
    </div>
  );
}

export default Game;
