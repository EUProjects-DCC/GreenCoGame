const express = require('express');
const { body, validationResult } = require('express-validator');
const { getAvatars } = require('../controllers/assetsController');
const router = express.Router();


// You get the list with the avatar routes
router.get(
  '/avatar',
  (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        getAvatars(res, token);
    } 
    catch (err) {
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

module.exports = router;
