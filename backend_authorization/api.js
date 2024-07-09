const fs = require("fs").promises

const express = require("express");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");
const app = express();

const content = await fs.readFile("credentials.json")
const credentials = JSON.parse(content)

// Configure Passport OAuth strategy
passport.use(

  new OAuth2Strategy(
    {
      authorizationURL: credentials.auth_uri,
      tokenURL: credentials.token_uri,
      clientID: credentials.client_id,
      clientSecret: credentials.client_secret,
      callbackURL: "http://localhost:3000/auth/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Here you would find or create a user in your database
      const user = {"name" : "user1"};
      return done(null, user);
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


// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
