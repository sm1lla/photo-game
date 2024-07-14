const express = require('express');
const { isAuthorized, usePassword, sessionConfig } = require('./middleware');

const cors = require('cors')
const passport = require('passport')
const session = require("express-session");

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

usePassword();

app.get('/protected2', isAuthorized, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

app.get('/', (req, res) => {
  res.json({});
});

app.get('/login', (req, res) => {
  res.json({ message: 'Login for Authentication' });
});

const PORT = 8082;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});