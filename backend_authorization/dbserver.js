require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 8081;

app.use(cors());
app.use(bodyParser.json());

const uri =
"mongodb+srv://admin:CfM9V4fsKUJN@clusterapiproject.v2jf5ss.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAPIProject";
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
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Endpoint to store user token
app.post('/api/user-token', async (req, res) => {
  try {
    const { id, accessToken, refreshToken, role } = req.body;

    const result = await db.collection('users').findOneAndUpdate(
      { id },
      { $set: { accessToken, refreshToken, role } },
      { upsert: true, returnDocument: 'after' }
    );
    res.json({ message: 'User token stored successfully', user: result.value });
  } catch (error) {
    console.error('Error storing user token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/user-token/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.collection('users').findOne({ id });

    if (user) {
      res.json({ accessToken: user.accessToken, refreshToken: user.refreshToken, role: user.role });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving user token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`DB Server is running on http://localhost:${port}`);
});
