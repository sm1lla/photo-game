const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");

const app = express();
const port = 3005;

app.use(bodyParser.json());
app.use(cors());
app.use(cors()); // Enable CORS

const database_url =
  "mongodb+srv://admin:CfM9V4fsKUJN@clusterapiproject.v2jf5ss.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAPIProject";
const dbName = "photos";

const client = new MongoClient(database_url);
let database;
let conn;
async function run (){
    try {
        conn = await client.connect();
        } catch(e) {
        console.error(e);
        }
        database = client.db(dbName);
}
run().then(console.log("Connected to database."));

async function loadImage(file_name) {
  const collection = database.collection("test_photos");

  const image = await collection.findOne({ file_name: file_name });
  return image
}

app.get("/api/images/:itemId", async (req, res) => {
  const id = req.params.cartItemId;
  loadImage(id)
  .then(image => {
    res.status(200).json(image);
  }).catch(error => {
    res.status(404).send("Error retrieving image.");
  });
  
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
