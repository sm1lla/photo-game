const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const cors = require('cors')


dotenv.config();

const app = express();
const port = process.env.DBPORT; // Use DBPORT from .env, default to 8080

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
console.log(process.env.DBSERVER_URI)
mongoose.connect(process.env.DBSERVER_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Endpoint to store user token
app.post('/api/user-token', async (req, res) => {
  try {
    const { username, accessToken, refreshToken } = req.body;

    // Create or update user in MongoDB
    let user = await User.findOneAndUpdate(
      { username },
      { accessToken, refreshToken },
      { upsert: true, new: true }
    );

    res.json({ message: 'User token stored successfully', user });
  } catch (error) {
    console.error('Error storing user token in the database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// const express = require('express');
// const bodyParser = require('body-parser');
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const port = process.env.DBPORT || 8081;
// const DBSERVER_URI = process.env.DBSERVER_URI;

// const client = new MongoClient(DBSERVER_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// app.use(cors());
// app.use(bodyParser.json());

// client.connect(err => {
//   if (err) {
//     console.error('MongoDB connection error:', err);
//     process.exit(1);
//   } else {
//     console.log('Connected to MongoDB');
//   }

//   const db = client.db('yourDatabaseName'); // Replace with your database name
//   const usersCollection = db.collection('users');

//   // Endpoint to store user token
//   app.post('/api/user-token', async (req, res) => {
//     try {
//       const { username, accessToken, refreshToken } = req.body;

//       // Create or update user in MongoDB
//       const user = await usersCollection.findOneAndUpdate(
//         { username },
//         { $set: { accessToken, refreshToken } },
//         { upsert: true, returnDocument: 'after' }
//       );

//       res.json({ message: 'User token stored successfully', user: user.value });
//     } catch (error) {
//       console.error('Error storing user token:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

//   app.listen(port, () => {
//     console.log(`DB Server is running on http://localhost:${port}`);
//   });
// });
