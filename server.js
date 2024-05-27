const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const { json, urlencoded } = require('body-parser');
const { header, validationResult } = require('express-validator');
require('dotenv').config();

// Routers
const assetsRouter = require('./server/routers/assetsRouter'); // Assets router
const authRouter = require('./server/routers/authRouter'); // Authentication router
const userRouter = require('./server/routers/userRouter'); // User router
const screenRouter = require('./server/routers/screenRouter'); // screen router

// Middleware
app.use(cors()); // Allows requests from any origin
app.use(json()); // Allows request on JSON format
app.use(urlencoded({ extended: true })); // Allows request with URL encoded format
app.use(express.static('build')); // Allows to serve React static files

//Log
const { log, saveEvent } = require("./server/utils/logger");

const PORT = process.env.PORT || 80; // Server port

const validateToken = (req, res, next) => {
  const protectedRoutes = [
    '/API/user',
    '/API/assets',
  ];

  if (!protectedRoutes.includes(req.path)) {
    return next();
  }

  header('Authorization')
    .trim()
    .notEmpty()
    .withMessage('Authorization field cannot be empty.')(req, res, () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    });
};

app.use(validateToken);
app.use('/API/assets', assetsRouter);
app.use('/API/auth', authRouter);
app.use('/API/screen', screenRouter);
app.use('/API/user', userRouter);

// Main path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html')); 
});

// Not found
app.use(
  (req, res, next) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
  }
);

// Error handler
app.use((err, req, res) => {
  log("Server", err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Starting the server
app.listen(PORT, () => {
  log("Server",`Server running on port ${PORT}`);
});