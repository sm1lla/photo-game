const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");

const app = express();
const port = 3005;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS

const database_url =
  "mongodb+srv://admin:CfM9V4fsKUJN@clusterapiproject.v2jf5ss.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAPIProject";
const dbName = "photos";

const client = new MongoClient(database_url);
let database;
let conn;


async function run() {
  try {
    conn = await client.connect();
  } catch (e) {
    console.error(e);
  }
  database = client.db(dbName);
}
run().then(console.log("Connected to database."));


async function loadImage(file_name) {
  const collection = database.collection("test_photos");

  const image = await collection.findOne({ filename: file_name });
  return image;
}

async function get_image_data_for_user_ids(user_ids) {
  const collection = database.collection("test_photos");

  const query = { user: { $in: user_ids } };
  const options = {
    projection: { filename: 1, user : 1 },
  };
  const cursor = await collection.find(query, options);
  const image_data = cursor.toArray();
  return image_data;
}

app.get("/api/images/:itemId", async (req, res) => {
  const id = req.params.itemId;
  loadImage(id)
    .then((image) => {
      res.status(200).json(image);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send("Error retrieving image.");
    });
});

app.get("/api/image_ids/:ids", async (req, res) => {
  const ids = req.params.ids;
  const idArray = ids.split(",");

  get_image_data_for_user_ids(idArray)
    .then((image_ids) => {
      res.status(200).json(image_ids);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send("Error retrieving image.");
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
