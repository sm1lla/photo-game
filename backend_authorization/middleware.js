const axios = require('axios');
// const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const fs = require("fs").promises;
require('dotenv').config(); 

async function getUserFromDatabaseById(id) {
  try {
    const response = await axios.get(`http://localhost:8081/api/user-token/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user from database:', error);
    throw new Error('User not found');
  }
}

let sessionConfig = session({
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
})

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
  return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

function isAuthorized(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.role && req.user.role == process.env.ROLE)
      return next();
  }
  res.status(401).send('Unauthorized');
}      

async function usePassword(passport) {
  const content = await fs.readFile("../backend_authorization/credentials.json");
  const credentials = JSON.parse(content).web;

  passport.use(
    new OAuth2Strategy(
      {
        authorizationURL: credentials.auth_uri,
        tokenURL: credentials.token_uri,
        clientID: credentials.client_id,
        clientSecret: credentials.client_secret,
        callbackURL: `http://localhost:${process.env.AUTHPORT}/auth/callback`,
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, params, profile, done) => {
        user_info = { id: params['id_token'], accessToken, refreshToken, role: process.env.ROLE }
        try {
          const response = await axios.post(`http://localhost:${process.env.DBPORT}/api/user-token`, user_info);
          user = response.config.data;
          done(null, user_info);
        } catch (error) {
          console.error('Error storing user data:', error);
          done(null, error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    process.nextTick(function() {
      return done(null, user.id);
    }
    )
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserFromDatabaseById(id);
      done(null, user); 
    } catch (error) {
      done(error); 
    }
  });
}

module.exports = {
  isAuthorized, usePassword, sessionConfig, isAuthenticated
};