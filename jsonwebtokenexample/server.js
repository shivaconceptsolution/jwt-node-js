const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Secret key for signing JWT
const SECRET_KEY = 'shivaconcept';

// POST API to login and generate JWT token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // In real cases, validate user credentials (this is just a demo)
  if (username === 'user' && password === 'pass') {
    // Generate a JWT token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });

    // If token is valid, save to request for use in other routes
    req.user = decoded;
    next();
  });
};

// POST API to access protected resource
app.post('/protected', verifyToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you have access to this route!` });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
