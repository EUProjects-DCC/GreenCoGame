const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { getScreenText, getScreenComponents, getComponentQuestions, getComponentStoryDialogue,
  checkQuestionAnswers, getLastScreen, getNextScreen, getErrorMessage, getComponentOptions, getLevelScreens, getAwardData, getScreenAssets, getUserAward, getAward, getAwardsLevel}
= require('../controllers/screenController');
const { error_code, level } = require('../validators/screenValidator');
const { language, planet, difficulty } = require('../validators/userValidator');
const { log } = require("../utils/logger.js");


// Gets the screenshots of a level
router.post(
  '/loadLevelScreens',
  body('level_id').isNumeric(),
  body('planet').matches(planet),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("screenRouter/loadLevelScreens Error", 'Error parsin values->' + errors);
        return res.status(400).json({ errors: errors.array() });
      }
      const { level_id, planet } = req.body;      
      log("screenRouter/loadLevelScreens", 'Get Level Screen for planet' + planet + " and level " + level_id);
      getLevelScreens(res, level_id, planet);
    }
    catch (err) {
      log("screenRouter/loadLevelScreens Error", 'Bad request->' + err.getErrorMessage);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

// Gets the text of a screen
router.post(
  '/loadScreenText',
  body('screen_id').isNumeric(),
  body('language').matches(language),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("screenRouter/loadScreenText Error", 'Error parsin values->' + errors);
        return res.status(400).json({ errors: errors.array() });
      }
      const { screen_id, language } = req.body;      
      log("screenRouter/loadScreenText", 'Get Text for screen ' + screen_id + ' in language ' + language);
      getScreenText(res, screen_id, language);
    }
    catch (err) {
      log("screenRouter/loadScreenText Error", 'Bad request->' + err);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

router.post(
  '/loadScreenAssets',
  body('screen_id').isNumeric(),
  body('planet_id').optional({ nullable: true }).matches(planet),
  body('language').matches(language),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("screenRouter/loadScreenAsset Errors", 'Error parsin values->' + errors);
        return res.status(400).json({ errors: errors.array() });
      }
      const { screen_id, planet_id, language } = req.body;
      log("screenRouter/loadScreenAsset", 'Getting Assets for screen ' + screen_id + ' in planet ' + planet_id + ' and language ' + language);
      getScreenAssets(res, screen_id, planet_id, language);
    }
    catch (err) {
      log("screenRouter/loadScreenAssets Error", 'Bad request->' + err);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

// Gets the id of the last screen visited by a user.
router.get(
  '/getLastScreenId',
  (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      log("screenRouter/getLastScreenId", 'Getting last Screen of a user');
      getLastScreen(res, token);
    }
    catch (err) {
      log("screenRouter/getLastScreenId Error", 'Bad request->' + err);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

// Obtains the components of a screen
router.post(
  '/loadScreenComponents',
  body('screen_id').isNumeric(),
  body('planet_id').optional().matches(planet),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("screenRouter/loadScreenComponents Error", 'Error parsing values->' + error);
        return res.status(400).json({ errors: errors.array() });
      }
      const { screen_id, planet_id } = req.body;
      log("screenRouter/loadScreenComponents", 'Getting components of a screen ' + screen_id + ' in planet ' + planet_id);
      getScreenComponents(res, screen_id, planet_id);
    }
    catch (err) {
      log("screenRouter/loadScreenComponents Error", 'Bad request->' + err);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

// Gets the questions of a component
router.post(
  '/loadComponentQuestions',
  body('component_id').isNumeric(),
  body('difficulty').matches(difficulty),
  body('language').matches(language),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("screenRouter/loadComponentQuestions Error", 'Error parsing values->' + errors);
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
      }
      const token = req.headers.authorization.split(' ')[1];
      const { component_id, difficulty, language } = req.body;
      
      log("screenRouter/loadComponentQuestions", 'Getting question of component ' + component_id + " in language "+ language + " and difficulty " + difficulty);
      getComponentQuestions(res, component_id, token, difficulty, language);
    }
    catch (err) {
      log("screenRouter/loadComponentQuestions Error", 'Bad request->' + err.getErrorMessage);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

// Gets the text of a story component as well as the name of the character who says it (if any).
router.post(
  '/loadComponentStoryDialogue',
  body('component_id').isNumeric(),
  body('language').matches(language),
  body('answer_id').optional({ nullable: true }).isNumeric(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("screenRouter/loadComponentStoryDialogue Error", 'Error parsing values->' + errors);
        return res.status(400).json({ errors: errors.array() });
      }
      const { component_id, language, answer_id } = req.body;
      log("screenRouter/loadComponentStoryDialogue", 'Getting text of a history and the name of character. Component: ' + component_id + " language:" + language + " Answer:" + answer_id);
      getComponentStoryDialogue(res, component_id, language, answer_id);
    }
    catch (err) {
      log("screenRouter/loadComponentStoryDialogue Error", 'Bad request->' + err.getErrorMessage);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

// Gets the options of a component (paths to assets)
router.post(
  '/loadComponentOptions',
  body('component_id').isNumeric(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("screenRouter/loadComponentOptions Error", 'Error parsing values->' + errors);
        return res.status(400).json({ errors: errors.array() });
      }
      const { component_id, language } = req.body;
      log("screenRouter/loadComponentOptions", 'Get options of a component ' + component_id);
      getComponentOptions(res, component_id, language);
    }
    catch (err) {
      log("screenRouter/loadComponentOptions Error", 'Bad request->' + err.getErrorMessage);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

//Add the award to the user 
router.post(
  '/loadAwardData',
  body('difficulty_id').matches(difficulty),
  body('planet_id').matches(planet),
  body('level_id').matches(level),
  body('language').matches(language),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("screenRouter/loadAwardData Error", 'Error parsing values->' + errors);
        return res.status(400).json({ errors: errors.array() });
      }
      const token = req.headers.authorization.split(' ')[1];
      const {difficulty_id, planet_id, level_id, language} = req.body;
      log("screenRouter/loadAwardData", 'Getting award data for difficulty ' + difficulty_id + ", planet:" + planet_id + ", level:" + level_id + ", language:" + language);
      getAwardData(res, token, difficulty_id, planet_id, level_id, language);
    }
    catch (error) {
      log("screenRouter/loadAwardData Error", 'Bad request->' + error.getErrorMessage);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

//Chek if the user have all the awards of a level
router.post(
  '/checkAwardsLevel',
  body('difficulty_id').matches(difficulty),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("screenRouter/checkAwardsLevel Error", 'Error parsing values->' + errors);
        return res.status(400).json({ errors: errors.array() });
      }
      const token = req.headers.authorization.split(' ')[1];
      const {difficulty_id} = req.body;
      log("screenRouter/checkAwardsLevel", 'Check award data for difficulty ' + difficulty_id);
      getAwardsLevel(res, token, difficulty_id);
    }
    catch (error) {
      log("screenRouter/checkAwardsLevel Error", 'Bad request->' + error);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

// Checks if the answer to a question is correct
router.post(
  '/checkQuestionAnswer',
  body('question_id').isNumeric(),
  body('answer').isString(),
  body('difficulty').matches(difficulty),
  body('language').matches(language),
  (req, res) => {
    try {
      log("screenRouter/checkQuestionAnswer", "Checking answers");
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("screenRouter/checkQuestionAnswer Error", 'Error parsing values->' + errors);  
        console.log(errors)      
        return res.status(400).json({ errors: errors.array() });
      }
      const token = req.headers.authorization.split(' ')[1];
      const { question_id, answer, difficulty, language } = req.body;
      log("screenRouter/checkQuestionAnswer", 'Check if the answer is correct. Question: ' + question_id + ", answer:" + answer + ", difficulty:" + difficulty + ", language:" + language );
      checkQuestionAnswers(res, question_id, answer, difficulty, token, language);
    }
    catch (err) {
      log("checkQuestionAnswer/checkQuestionAnswer Error", 'Bad request->' + err);
      res.status(400).json({
        error: 'Bad request',
      });
      return res.status(400).json({ errors: errors.array() });
    }
  }
);

// You get the following screen
router.post(
  '/getNextScreen',
  body('screen_id').isNumeric(),
  body('difficulty_id').matches(difficulty),
  body('planet_id').optional({ nullable: true }).matches(planet),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("screenRouter/getNextScreen Error", 'Error parsing values->' + errors);
        return res.status(400).json({ errors: errors.array() });
      }
      const token = req.headers.authorization.split(' ')[1];
      const { screen_id, difficulty_id, planet_id} = req.body;
      log("screenRouter/getNextScreen","Getting next screen. Screen:" +  screen_id + ", diffuculty:" + difficulty_id + ", planet:" + planet_id)
      getNextScreen(res, screen_id, difficulty_id, planet_id, token);
    }
    catch (err) {
      log("screenRouter/getNextScreen Error", 'Bad request->' + err.getErrorMessage);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

// Gets the error message from an error code
router.post(
  '/getErrorMessage',
  body('type').matches(error_code),
  body('language').matches(language),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("screenRouter/getErrorMessage Error", 'Error parsing values->' + errors);
        return res.status(400).json({ errors: errors.array() });
      }
      const { type, language } = req.body;
      log("screenRouter/getErrorMessage", 'Getting Error message ' + type + " language: " + language);
      getErrorMessage(res, type, language);
    }
    catch (err) {
      log("screenRouter/getErrorMessage Error", 'Bad request->' + err);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

// Gets the user's list of awards
router.post(
  '/getUserAward',
  body('language').matches(language),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("screenRouter/getUserAward Error", 'Error parsing values->' + errors);
        return res.status(400).json({ errors: errors.array() });
      }      
      const token = req.headers.authorization.split(' ')[1];
      const { language } = req.body;
      log("screenRouter/getUserAward", 'Getting user awards in language ' + language);
      getUserAward(res, token, language);
    }
    catch (err) {
      log("screenRouter/getUserAward Error", 'Bad request->' + err);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);

// Gets the information to print an award
router.post(
  '/getAward',
  body('language').matches(language),
  body('planet_id').matches(planet),
  body('level_id').matches(level),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("screenRouter/getAward Error", 'Error parsing values->' + errors);
        return res.status(400).json({ errors: errors.array() });
      }      
      const { language, planet_id, level_id, difficulty_id } = req.body;
      log("screenRouter/getAward", 'Getting user award information');
      getAward(res, language, planet_id, level_id);
    }
    catch (err) {
      log("screenRouter/getAward Error", 'Bad request->' + err);
      res.status(400).json({
        error: 'Bad request',
      });
    }
  }
);
module.exports = router;
