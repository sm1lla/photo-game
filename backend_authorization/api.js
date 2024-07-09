const axios = require('axios');
const fs = require("fs").promises;
const express = require("express");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");
const cors = require("cors");
const session = require("express-session");
const app = express();



const corsOptions = {
  origin: 'http://localhost:3000', // Allow this origin
  optionsSuccessStatus: 200,
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
// Use CORS middleware
app.use(cors(corsOptions));
app.use(session({
  secret: 'your-secret-key', // Ändern Sie dies in einen sicheren geheimen Schlüssel
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

async function startServer() {
  try {
    const content = await fs.readFile("credentials.json");
    const credentials = JSON.parse(content).web;

    // Configure Passport OAuth strategy
    passport.use(
      new OAuth2Strategy(
        {
          authorizationURL: credentials.auth_uri,
          tokenURL: credentials.token_uri,
          clientID: credentials.client_id,
          clientSecret: credentials.client_secret,
          callbackURL: "http://localhost:8080/auth/callback",
          scope: ['profile', 'email'], // Define scopes here
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            console.log('profile', accessToken)
            const response = await axios.post('http://localhost:8081/api/user-token', {
              username: 'name', // Adjust as per your profile structure
              accessToken,
              refreshToken,
            });
            console.log('User data stored:', response.data);
            // Here you would typically do something with the user data
            done(null, profile); // Example: Pass the profile as user
          } catch (error) {
            console.error('Error storing user data:', error);
            done(error, null);
          }
         
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((obj, done) => {
      done(null, obj);
    });

    app.use(passport.initialize());

    // Middleware for authentication
    function isAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.status(401).json({ message: "Unauthorized" });
    }

    // Middleware for authorization
    function isAuthorized(req, res, next) {
      // Assuming user roles are available in req.user.profile.roles
      if (
        req.user &&
        req.user.profile &&
        req.user.profile.roles.includes("write")
      ) {
        return next();
      }
      res.status(403).json({ message: "Forbidden" });
    }

    // Routes
    app.get("/auth", passport.authenticate("oauth2"));

    app.get(
      "/auth/callback",
      passport.authenticate("oauth2", { failureRedirect: "/" }),
      (req, res) => {
        res.redirect("/");
      }
    );

    app.post("/api/auth", (req, res) => {
      passport.authenticate("oauth2") 
    });
    // Start the server
    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  } catch (error) {
    console.error("Error reading credentials:", error);
  }
}

startServer();
