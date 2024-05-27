const express = require('express');
const { body, validationResult } = require('express-validator');
const { email, password, difficulty } = require('../validators/userValidator');
const { avatar } = require('../validators/assetsValidator');
const { getUserProfile, updateProfile, getWorldwideRanking, getLocalRanking, checkUsedEmail, checkUsedAlias, updateAvatar, getUserPoints, getWorldPosition, getLocalPosition, updateDifficulty, updatePlanet, getUserProfileBrief } = require('../controllers/userController');
const router = express.Router();
const { log } = require("../utils/logger.js");

router.get('/profile', (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    getUserProfile(res, token);
  }
  catch (err) {
    log("userRouter/profile Error", "Bad request ->" + err);
    res.status(400).json({
      error: 'Bad request',
    });
  }
});

router.get('/profile/brief', (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    getUserProfileBrief(res, token);
  }
  catch (err) {
    log("userRouter/profile/brief Error", "Bad request ->" + err);
    res.status(400).json({
      error: 'Bad request',
    });
  }
});

router.put('/profile',
  body('email').matches(email),
  body('password').matches(password),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("userRouter/profile Error", "Errores ->" + json({ errors: errors.array() }));
        return res.status(400).json({ errors: errors.array() });
      }
      const token = req.headers.authorization.split(' ')[1];
      let { email, password } = req.body;
      updateProfile(res,  email, password, token);
    }
    catch (err) {
      log("userRouter/profile Error", "Bad request ->" + err);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

router.post(
    '/checkEmail',
    body('email').matches(email),
    (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          log("userRouter/checkEmail Error", "Errores ->" + json({ errors: errors.array() }));
          return res.status(400).json({ errors: errors.array() });
        } else {
          const { email } = req.body;
          checkUsedEmail(res, email);
        }
      }
      catch (err) {
        log("userRouter/checkEmail Error", "Bad request ->" + err);
        res.status(400).json({
          error: 'Bad request',
        });
      }
    }
);

router.post(
    '/checkAlias',
    body('alias').isLength({ min: 2, max: 16 }),
    (req, res) => {
      try {
        const errors = validationResult(req);   
        console.log(errors.array())
        if (!errors.isEmpty()) {
          log("userRouter/checkAlias Error", "Errores ->" + json({ errors: errors.array() }));
          console.log(errors)
          return res.status(400).json({ errors: errors.array() });
        }
        const { alias } = req.body;
        console.log(req.body)
        checkUsedAlias(res, alias);
      }
      catch (err) {
        res.status(400).json({
          error: 'Bad request',
        });
      }
    }
);

router.get('/ranking/world', (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    getWorldPosition(res, token);
  }
  catch (err) {
    log("userRouter/ranking/world GET Error", "Bad request ->" + err);
    res.status(400).json({
      error: 'Bad request',
    });
  }
});

router.get('/getPoints', (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log("Pidiendo puntos")
    getUserPoints(res, token);
  }
  catch (err) {
    log("userRouter/getPoints Error", "Bad request ->" + err);
    res.status(400).json({
      error: 'Bad request',
    });
  }
});


router.put(
    '/ranking/world',
    body('page').isNumeric(),
    body('limit').isNumeric(),
    (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          log("userRouter/ranking/world Error", "Errores ->" + json({ errors: errors.array() }));
          return res.status(400).json({ errors: errors.array() });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const token = req.headers.authorization.split(' ')[1];

        getWorldwideRanking(res, limit, offset, token);
      }
      catch (err) {
        log("userRouter/ranking/world PUT Error", "Bad request ->" + err);
        res.status(400).json({
          error: 'Bad request',
        });
      }
    }
);

router.get('/ranking/local', (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    getLocalPosition(res, token);
  }
  catch (err) {
    log("userRouter/ranking/local GET Error", "Bad request ->" + err);
    res.status(400).json({
      error: 'Bad request',
    });
  }
});


router.put(
    '/ranking/local',
    body('page').isNumeric(),
    body('limit').isNumeric(),
    (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          log("userRouter/ranking/local Error", "Errores ->" + json({ errors: errors.array() }));
          return res.status(400).json({ errors: errors.array() });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const token = req.headers.authorization.split(' ')[1];
        getLocalRanking(res, limit, offset, token);
      }
      catch (err) {
        log("userRouter/ranking/local PUT Error", "Bad request ->" + err);
        res.status(400).json({
          error: 'Bad request',
        });
      }
    }
);

router.put(
    '/avatar',
    body('avatar').matches(avatar),
    (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          log("userRouter/avatar Error", "Errores ->" + json({ errors: errors.array() }));
          return res.status(400).json({ errors: errors.array() });
        }
        const token = req.headers.authorization.split(' ')[1];
        const { avatar } = req.body;
        updateAvatar(res, avatar, token);
      }
      catch (err) {
        log("userRouter/avatar PUT Error", "Bad request ->" + err);
        res.status(400).json({
          error: 'Bad request',
        });
      }
    }
)

router.put('/difficulty',
  body('difficulty').matches(difficulty),
(req, res) => {
  try {
    log("userRouter/difficulty", "Change difficulty ");
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
      console.log("emptu")
      log("userRouter/difficulty Error", "Errores ->" + json({ errors: errors.array() }));
      return res.status(400).json({ errors: errors.array() });
    }else{
      
      console.log("not empty")
    }
    const token = req.headers.authorization.split(' ')[1];
    const { difficulty } = req.body;
    updateDifficulty(res, difficulty, token);
  }
  catch (err) {
    log("userRouter/difficulty PUT Error", "Bad request ->" + err);
    res.status(400).json({
      error: 'Bad request',
    });
  }
});

router.put('/planet',
  body('planet').matches(planet),
(req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      log("userRouter/planet Error", "Errores ->" + json({ errors: errors.array() }));
      return res.status(400).json({ errors: errors.array() });
    }
    const token = req.headers.authorization.split(' ')[1];
    const { planet } = req.body;
    updatePlanet(res, planet, token);
  }
  catch (err) {
    log("userRouter/planet PUT Error", "Bad request ->" + err);
    res.status(400).json({
      error: 'Bad request',
    });
  }
});

module.exports = router;
