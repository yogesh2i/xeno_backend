const express = require("express");
const User = require("../models/User");
const axios = require("axios");
const { generateToken } = require("../middlewares/auth");
const jwt = require('jsonwebtoken');
const router = express.Router();

/*
 * POST api/auth/register 
 * create a new user

*/
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const newUser = new User({ username, password, email });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

/*
* POST api/auth/login 
* Login user
*/
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * POST /api/auth/google
 * Register with Google.
 */
router.post("/google", async (req, res) => {
    const { code } = req.body;
  
    if (!code) {
      return res.status(400).json({ error: "Authorization code is required." });
    }
  
    try {
      
      const response = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: process.env.GAUTH_CLIENT_ID,
        client_secret: process.env.GAUTH_CLIENT_SECRET,
        redirect_uri: process.env.GAUTH_CALLBACK_URL,
        grant_type: "authorization_code",
      });
  
      const { access_token } = response.data;
  
      // Fetch user info from Google
      const userInfo = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
      );
  
      const { sub: googleId, email, name } = userInfo.data;
  
      // Check if the user already exists
      let user = await User.findOne({ googleId });
      if (!user) {
        // Create a new user if not found
        user = new User({ googleId, email, name });
        await user.save();
      }
  
      // Generate JWT token
      const token = generateToken(user);
  
      res.json({ token, user });
    } catch (error) {
      console.error("Error logging in with Google:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  /*
   * GET /api/auth/verify-token 
   * verify if token expired or not
  */
  router.get("/verify-token", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      res.status(200).json({ valid: true, user: decoded }); // Token is valid
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ error: "Unauthorized: Invalid or expired token" }); // Token is invalid or expired
    }
  });
module.exports = router;