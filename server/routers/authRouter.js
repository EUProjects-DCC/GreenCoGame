const express = require('express');
const { body, validationResult } = require('express-validator');
const { loginUser, signupUser, guestSignup, resetPasswordEmail, sendEmailPassword, resetPassword } = require('../controllers/authController');
const { alias, email, password, date, gender, country } = require('../validators/userValidator');
const { generateJWT } = require('../utils/token');
const { sendEmail } = require('../mail/email');
const { log } = require("../utils/logger.js");
const router = express.Router();

// User authentication

/*
  matches() -> Checks that the field value complies with the regular expression
  isOptional() -> Allows the field to be optional
  isOptional({nullable: true}) -> Allows the field to be optional and null.
*/

// User login (alias and password)
router.post(
  '/login',
  body('alias').matches(alias),
  body('password').matches(password),
  (req, res) => {
    try {
      log("authRouter/login", 'Try to login');
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { alias, password } = req.body;
      loginUser(res, alias, password);
    }
    catch (err) {
      log("authRouter/login Error", 'Bad request->' + err.getErrorMessage);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

// User registration
router.post(
  '/signup',
  body('alias').matches(alias),
  body('email').matches(email),
  body('password').matches(password),
  body('birthDate').matches(date),
  body('gender').matches(gender),
  body('country').matches(country),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { alias, email, password, birthDate, country, gender } = req.body;
      signupUser(res, alias, email, password, birthDate, country, gender);
    }
    catch (err) {
      log("authRouter/signup Error", 'Bad request->' + err.getErrorMessage);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

// Guest user registration
router.get('/signup/guest', (req, res) => {
  guestSignup(res);
});

// Reset password (send email)
router.post('/reset-password',
  body('email').matches(email),
  (req, res) => {
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      else {
        const { email } = req.body;
        sendEmailPassword(res, email);
      }
    }
    catch (err) {
      log("authRouter/reset-password Error", 'Bad request->' + err.getErrorMessage);
      res.status(400).json({
        error: 'Bad request',
      });
    }
});

// Reset password (change password)
router.put('/reset-password/:token',
  body('password').matches(password),
(req, res) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    else {
      const { password } = req.body;
      const token = req.params.token;
      resetPassword(res, password, token);
    }
  }
  catch (err) {
    log("authRouter/reset-password/:token", 'Bad request->' + err.getErrorMessage);
    res.status(400).json({
      error: 'Bad request',
    });
  }
});

module.exports = router;
