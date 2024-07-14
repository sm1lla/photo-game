const axios = require('axios');
require('dotenv').config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const app = express();
const { isAuthorized, usePassword, sessionConfig, isAuthenticated } = require('./middleware');

const handleAuthCallback = (req, res, next) => {
  passport.authenticate('oauth2', { failureRedirect: 'http://localhost:3000/login' }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('http://localhost:3000/login');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      req.session.save(() => {
        res.redirect('http://localhost:3000/protected');
      });
    });
  })(req, res, next);
};

const corsOptions = {
  origin: ['http://localhost:3000','http://localhost:8082'], //add all servers, that need autorization
  credentials: true,
};
app.use(cors(corsOptions));
app.use(sessionConfig);

app.use(passport.initialize());
app.use(passport.session());

async function startServer() {
  try {
    usePassword();

    app.get("/auth", passport.authenticate("oauth2"));

    app.get('/auth/callback', handleAuthCallback);

    app.get('/protected2', isAuthenticated, isAuthorized, (req, res) => {
      res.json({ message: 'This is a protected route'});
    });

    app.listen(process.env.AUTHPORT, () => {
      console.log(`Server is running on port ${process.env.AUTHPORT}`);
    });
  } catch (error) {
    console.error("Error reading credentials:", error);
  }
}

startServer();
