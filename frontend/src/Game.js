import "./Game.css";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from 'axios'; 

const socket = io("http://localhost:3002");
const user = {"name" : "User"}
const data_url = "http://localhost:3005"


function Game() {
  const [players, setPlayers] = useState({});
  const [image, setImage] = useState({});

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

  useEffect(() => {
    axios.get(data_url + "/api/images/" + "cat-1.jpg")
    .then(response => {
      // Handle the response here
      console.log(response.data.filename);
      setImage(response.data.image)
    })
    .catch(error => {
      // Handle the error here
      console.error('Error fetching data:', error);
    });
    }, []);

  return (
    <div className="Game">
      <header className="Game-header">
        {image ? <img src={`data:image/jpeg;base64,${image}`} alt="" /> : <p>Loading...</p>}
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
