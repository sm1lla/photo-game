const axios = require('axios');
require('dotenv').config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const app = express();
const { isAuthorized, usePassword, sessionConfig, isAuthenticated } = require('./middleware');

const handleAuthCallback = (req, res, next) => {
  passport.authenticate('oauth2', { failureRedirect: 'http://localhost:3000/' }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('http://localhost:3000/');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      req.session.save(() => {
        res.redirect('http://localhost:3000/game');
      });
    });
  })(req, res, next);
};

const corsOptions = {
  origin: ['http://localhost:3000','http://localhost:3002', 'http://localhost:3005'], //add all servers, that need autorization
  credentials: true,
};
app.use(cors(corsOptions));
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

async function startServer() {
  try {
    usePassword(passport);
    app.get("/auth", passport.authenticate("oauth2"));
    app.get('/auth/callback', handleAuthCallback);

    app.listen(8080, () => {
      console.log(`Server is running on port ${8080}`);
    });
  } catch (error) {
    console.error("Error reading credentials:", error);
  }
}

startServer();
