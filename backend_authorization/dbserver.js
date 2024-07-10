require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.DBPORT || 8081;

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DBSERVER_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;
client.connect()
  .then(() => {
    db = client.db('ClusterAPIProject'); // Adjust the DB name if needed
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Endpoint to store user token
app.post('/api/user-token', async (req, res) => {
  try {
    const { username, accessToken, refreshToken } = req.body;

    // Create or update user in MongoDB
    const result = await db.collection('users').findOneAndUpdate(
      { username },
      { $set: { accessToken, refreshToken } },
      { upsert: true, returnDocument: 'after' }
    );

    res.json({ message: 'User token stored successfully', user: result.value });
  } catch (error) {
    console.error('Error storing user token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`DB Server is running on http://localhost:${port}`);
});
