const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: "http://localhost:3000", // React app address
		methods: ["GET", "POST"],
	},
});

app.use(cors()); // Enable CORS

let players = {
    "1" : {"name" : "examplePlayer1"}, 
    "2" : {"name" : "examplePlayer2"},
    "3" : {"name" : "examplePlayer3"},
    "4" : {"name" : "examplePlayer4"},
    "5" : {"name" : "examplePlayer5"}
};

let gameState = {
    "current_round" : 0,
    "max_rounds" : 5,
    "image_ids" : ["id1", "id2"]
}

function selectImages(){
    // images have a userID and 
    // get all ImageIds
    // randomly select 5
    // get corresponding user Ids
}

io.on("connection", (socket) => {
	console.log("A user connected:", socket.id);

    socket.on("userInfo", (user) => {
        players[socket.id] = user;
        socket.emit("currentPlayers", players);
    });

    socket.on("disconnect", () => {
		delete players[socket.id];
		io.emit("playerDisconnected", socket.id);
		console.log("A user disconnected:", socket.id);
	});
});

server.listen(3002, () => {
	console.log("Server is listening on port 3002");
});
