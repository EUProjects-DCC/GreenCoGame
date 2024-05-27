const e = require("cors");
const pool = require("../config/db.js");
const { text_for_screen, components_for_screen, questions_for_component, story_dialogue_for_component,
  question_valid_answers, next_screen, update_last_screen,start_answering_question, end_answering_question,
  get_error_message, background_for_screen, text_for_question, options_for_component,screens_for_level,
  assets_for_screen, get_user_award, text_for_null_screen, getAwardsUserLevel} = require("../queries/screenQueries.js");
const { get_last_screen, give_user_award, check_user_award, get_award_data, check_answered_correctly,
  update_score, start_date_question } = require("../queries/userQueries.js");
const { text_for_component, text_for_story_dialogue, unifyObjects } = require("../utils/format_text.js");
const { log } = require("../utils/logger.js");
const { validateJWT } = require("../utils/token.js");
const { validateAnswers } = require("../validators/screenValidator.js");
const { calculateScore } = require("../utils/score.js");

//Recover of level screens
const getLevelScreens = (res, level, planet) => {
  try {
    pool.query(screens_for_level, [level, planet]).then((rows) => {
      if (rows.length > 0) {
        text = text_for_component(rows);
        res.status(200).json(text);
      }
      else {
        res.status(404).json({ error: "Screen not found" });
      }
    })
  }
  catch (err) {
    log("screenController/getLevelScreen", "Internal server error ->" + err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}


//Get screen Texts
const getScreenText = (res, screen, language) => {
  /*
  * 1. Get the text of a screen in a specific language
  * 2. Return text
  * */

  try {
    if(screen=='0')
    {      
      pool.query(text_for_null_screen, [language]).then((rows) => {
        if (rows.length > 0) {
          text = text_for_component(rows);
          res.status(200).json(text);
        }
        else {
          res.status(404).json({ error: "Screen not found" });
        }
      })
    }else
    {
      pool.query(text_for_screen, [screen, language]).then((rows) => {
        if (rows.length > 0) {
          text = text_for_component(rows);
          res.status(200).json(text);
        }
        else {
          res.status(404).json({ error: "Screen not found" });
        }
      })
    }
  }
  catch (err) {
    log("screenController/getScreenText error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Get screen assets
const getScreenAssets = (res, screen, planet, language) => {
  /*
    1. Get he assets of a screen and the alternative texts of the images in specific language
    2. Return assets
  */
  try {
    pool.query(assets_for_screen, [screen, planet, language]).then((rows) => {
      if (rows.length > 0) {
        let props = {};
        rows.forEach((row) => {
          props[row.name] = {
            text: row.text,
            path: row.path
          }
        })
        res.status(200).json(props);
      }
      else {
        res.status(404).json({ error: "Screen not found" });
      }
    })
  }
  catch (err) {
    log("screenController/getScreenAssets error", err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Get last screen of a user
const getLastScreen = (res, token) => {
  /*
  1. Check the validation of a Token and get the id of the user
  2. Get hte last screen of an user
  3. Return the last screen
  */
  try {
    const user_id = validateJWT(token).id;
    if (user_id === undefined) {
      res.status(401).json({ error: "Invalid token" });
    }
    console.log("Request last screen of user: " + user_id)
    pool.query(get_last_screen, [user_id]).then((rows) => {
      if (rows.length > 0) {
        log("screenController/getLastScreen", "Return last screen");
        console.log(rows)
        res.status(200).json(rows[0]);
      }
      else {
        res.status(404).json({ error: "Screen not found" });
      }
    })
  }
  catch (err) {
    log("screenController/getLastScreen error", err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Get screen components
const getScreenComponents = (res, screen_id, planet_id = null) => {
  /*
  * 1. Get components of a screen un a specific planet
  * 2. Get components
  * 3. Get screen background
  * 4. Return components and background
  * */
  try {
    log("screenController/getScreenComponents", "getScreenComponents: screen:"+ screen_id +", planet:"+ planet_id);
    pool.query(components_for_screen, [screen_id, planet_id]).then((rows) => {
      if (rows.length > 0) {
        pool.query(background_for_screen, [screen_id, planet_id]).then((background) => {
          if (background.length > 0) {
            res.status(200).json(rows.concat(background));
          }
          else {
            res.status(404).json({ error: "Screen not found" });
          }
        })
      }
      else {
        res.status(404).json({ error: "Screen not found" });
      }
    })
  }
  catch (err) {
    log("screenController/getScreenComponents error", err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Begining of a question
const startAnsweringQuestion = (question_id, user_id) => {
  /*
  * 1. Inserts a record in the user_question table with the end date, the value of the answer and if it is correct empty
  * 2. Returns true if successfully inserted
  */
  let inserted = false;
  try {
    return pool.query(start_answering_question, [user_id, question_id]).then((rows) => {
      if (rows.affectedRows > 0) {
        inserted = true;
      }
      return inserted
    })
  }
  catch (err) {
    log("screenController/startAnsweringQuestion error", err.getErrorMessage);
  }
}

//Obtaining questions from a component
const getComponentQuestions = async (res, component_id, token, difficulty_id = 0, language) => {
  /*
  * 1. Gets the questions of a component (component_id) with a given difficulty (difficulty_id).
  * 2. Returns a random question (if there is more than one) or the only question.
  * 3. Get the text of the question.
  * 4. Return text of the question along with the question
  * 5. Start answering the question
  * */
  try {
    let component_data = await pool.query(questions_for_component, [component_id, difficulty_id]);
    if (component_data.length > 0) {
      if (component_data.length > 1) {
        component_data = component_data[Math.floor(Math.random() * component_data.length)];
      }
      else {
        component_data = component_data[0];
      }
      log("screenController/getComponentQuestions", "Get text of a question id:" + component_data.question_id + ", answer_id:" +component_data.answer_id + ", language:" + language)
      const component_text = await pool.query(text_for_question, [component_data.question_id, component_data.answer_id, language]);
      if (component_text.length > 0) {
        component_data.component_text = text_for_component(component_text);
        user_id = validateJWT(token).id;
        if (user_id === undefined) {          
          log("screenController/getComponentQuestions error", "Invalid token");
          res.status(401).json({ error: "Invalid token" });
        }
        const started = await startAnsweringQuestion(component_data.question_id, user_id);
        if (!started) {
          log("screenController/getComponentQuestions error", "Internal server error");
          res.status(500).json({ error: "Internal server error" });
        }
        log("screenController/getComponentQuestions", "Returning component_data");
        res.status(200).json(component_data);
      }
      else {
        log("screenController/getComponentQuestions error", "No text associated with question " + component_data.question_id );
        res.status(404).json({ error: "No text associated with question " + component_data.question_id });
      }
    }
    else {
      log("screenController/getComponentQuestions error", "No questions associated with component " + component_id );
      res.status(404).json({ error: "No questions associated with component " + component_id });
    }
  }
  catch (err) {
    log("screenController/getComponentQuestions error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Obtaining information from the narrative components of a screen
const getComponentStoryDialogue = (res, component, language, answer_id = null) => {
  /*
  * 1. Gets the information of the narrative components of a screen in a given language related to a given answer (answer_id) (if specified)
  * 2. Returns the information of the narrative components.
  */

  try {
    pool.query(story_dialogue_for_component, [component, language, answer_id]).then((rows) => {
      if (rows.length > 0) {
        log("screenController/getComponentStoryDialogue", "Returning Component info");
        res.status(200).json(text_for_story_dialogue(rows));
      }
      else {        
        log("screenController/getComponentStoryDialogue error", "Component not found");
        res.status(404).json({ error: "Component not found" });
      }
    }
    )
  }
  catch (err) {
    log("screenController/getComponentStoryDialogue error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Obtaining information from the choose options components of a screen
const getComponentOptions = (res, component, language) => {
  /*
  * 1. Obtains information from the choose options of a screen.
  * 2. Returns the information of the selection components.
  */
  try {
    pool.query(options_for_component, [component, language]).then((rows) => {
      if (rows.length > 0) {
        log("screenController/getComponentOptions error", "Returning information of a component");
        res.status(200).json(rows);
      }
      else {
        log("screenController/getComponentOptions error", "No options found for component");
        res.status(404).json({ error: "No options found for component " + component });
      }
    })
  }
  catch (err) {
    log("screenController/getComponentOptions error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

const giveUserAward = async (user_id, difficulty_id, planet_id, level_id) => {
  /*
  1. Checks if a user has already received a reward for a level
  2. If you have not received it, it is given to the user.
  3. If you have already received it but the difficulty is higher, the difficulty_id field of the achievement is updated.
  */
  try {
    //Check is the user has win the award previously of if it has lower level
    const rows = await pool.query(check_user_award, [user_id, difficulty_id, level_id, planet_id]);
    if (rows[0].count <= 0) {
      log("giveUserAward", "The award doesn't exists");
      const insertRows = await pool.query(give_user_award, [user_id, level_id, planet_id, difficulty_id, user_id]);
      log("giveUserAward", insertRows);
      if (insertRows.affectedRows > 0) {        
        log("giveUserAward", "Award inserted");
        return (level_id * planet_id);
      }
      else {
        log("giveUserAward", "Error registering award");
        return false;
      }
    } else {
      log("giveUserAward", "The award exists");
      const award_id = rows[0].award_id;
      if (rows[0].difficulty < difficulty_id) {
        log("giveUserAward", "The difficulty is lower than the previous award, It must be updated");
        const updated_row = await pool.query(update_award_difficulty, [difficulty_id, user_id, award_id]);
        if (updated_row.affectedRows > 0) {
          log("giveUserAward", "Award " + award_id + " Ok");
          return award_id;
        }
        else {
          log("giveUserAward", "Error updating award");
          return false;
        }
      }
      else {
        log("giveUserAward", "The difficulty is lower than the award that exists");
        return award_id;
      }
    }
  }
  catch (err) {
    log("screenController/giveUserAward error", err);
    return false;
  }
}

const getAwardData = async (res, token, difficulty_id, planet_id, level_id, language) => {
  /*
  1. Checks if a user has already received a reward for a level
  2. Gets the reward data of a level
  3. Returns the reward data
  */
  try {
    const user_id = validateJWT(token).id;
    if (user_id === undefined) {
      log("getAwardData", "Invalid token");
      res.status(401).json({ error: "Invalid token" });
    }
    const award_id = await giveUserAward(user_id, difficulty_id, planet_id, level_id); //The reward is given to the user
    if (!award_id) { //If the reward could not be granted, an error is returned.
      log("getAwardData", "Error giving award");
      res.status(500).json({ error: "Internal server error" });
    }
    else { //If the reward has been granted, the reward data (difficulty, level and planet in the specified language) are obtained
      const award_data = await pool.query(get_award_data,
        [difficulty_id, language, level_id, language, planet_id, language]);
      if (award_data.length > 0) {
        res.status(200).json(unifyObjects(award_data));        
        log("getAwardData", "Ok getting award");
      }
      else {
        res.status(404).json({ error: "Award not found" });
        log("getAwardData Error", "Error Award not found");
      }
    }

  }
  catch (err) {
    log("screenController/getAwardData error", err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getAwardsLevel = async (res, token, difficulty_id) => {
  /*
  1. Check if user has all the awards of a level
  2. Return the number of awards owned
  */
  try {
    const user_id = validateJWT(token).id;
    if (user_id === undefined) {
      log("screenController/getAwardsLevel", "Invalid token");
      res.status(401).json({ error: "Invalid token" });
    }
    const rows = await pool.query(getAwardsUserLevel, [user_id, difficulty_id]);    
    if (rows.length > 0) {
      log("screenController/getAwardsLevel", "Returning the number of awards");
      res.status(200).json(rows);
    }
    else {
      log("screenController/getAwardsLevel error", "No awards to return");
      res.status(404).json({ error: "No options found for component " + component });
    }
  }
  catch (err) {
    log("screenController/getAwardsLevel error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Updating the last screen visited by a user
const updateLastScreen = async (screen_id, token) => {
  /*
    1. Check the validation of a Token and get the id of the user
    2. Update the user's last screen
    3. Return true if successfully updated
  */
  try {
    const validate = validateJWT(token);
    if (validate.id === undefined) {
      return false;
    }
    return pool.query(update_last_screen, [screen_id, validate.id]).then((rows, err) => {
      if (rows.affectedRows > 0) {
        return true;
      }
      else {
        log("updateLastScreen", err);
        return false;
      }
    })
  }
  catch (err) {
    log("screenController/updateLastScreen error", err);
    return false;
  }
}

//Getting the next screen to be visited by a user
const getNextScreen = (res, screen, difficulty_id, planet_id, token) => {
  /*
  1. Get the next screen to be visited by a user based on the current screen (screen) and the difficulty (difficulty_id)
  2. Devolver la siguiente pantalla
  3. Update the last screen visited by the user (if the next screen was returned).
  */
  try {
    pool.query(next_screen, [screen, difficulty_id]).then(async (rows) => {
      if (rows.length > 0) {
        const screen_updated = await updateLastScreen(rows[0].screen_id, token);
        if (!screen_updated) {
          res.status(500).json({ error: "Internal server error" });
        }
        else {
          res.status(200).json(rows[0]);
        }
      }
      else {
        res.status(404).json({ error: "Screen not found" });
      }
    })
  }
  catch (err) {
    log("screenController/getNextScreen error", err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Completion of the answer to a question
const endAnsweringQuestion = (user_id, question_id, answer, correct) => {
  /*
  * 1. Updates the record in the user_question table with the end date, the value of the answer and whether it is correct.
  * 2. Returns true if successfully updated
  */
  let updated = false;
  try {
    return pool.query(end_answering_question, [answer, correct, user_id, question_id, user_id, question_id]).then((rows) => {
      if (rows.affectedRows > 0) {
        updated = true;
      }
      return updated
    })
  }
  catch (err) {
    log("screenController/endAnsweringQuestion error", err.getErrorMessage);
  }
}

//Updating a user's score
const updateScore = (res, user_id, question_id, difficulty_id) => {
  /*
  * 1. Update user score
  * 2. Returns true if successfully updated
  */
  try {
    pool.query(start_date_question, [user_id, question_id]).then((rows) => {
      if (rows.length > 0) {
        const start_date = rows[0].start_date;
        const lasted_time = Math.floor((new Date() - start_date) / 1000);
        console.log("Start_date:" + start_date + ", lasted_time:" + lasted_time)
        const score = calculateScore(difficulty_id, lasted_time);
        console.log("score" + score)
        pool.query(update_score, [score, user_id]).then((rows) => {
          if (rows.affectedRows > 0) {
            res.status(200).json(true);
          }
          else {
            res.status(500).json({ error: "Internal server error" });
          }
        })
      }
      else {
        res.status(404).json({ error: "Question not found" });
      }
    })
  }
  catch (err) {
    log("screenController/updateScore error", err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Checking whether a user has already answered a question
const checkAlreadyAnswered = (question_id, user_id) => {
  /*
  * 1. Checks if a user has already answered a question
  */
  try {
    return pool.query(check_answered_correctly, [user_id, question_id])
  }
  catch (err) {
    log("screenController/checkAlreadyAnswered error", err.getErrorMessage);
    return false;
  }
}

//Checking whether an answer is correct
const checkQuestionAnswers = (res, question_id, answer, difficulty, token, language) => {
  /*
    1. Obtains the correct answer to a question in a given language.
    2. Checks if the user's answer is correct (ignoring uppercase, lowercase and spaces). If it does not find the correct answer, the answer is considered to be correct (quiz questions).
    3. Checks if the token is valid and gets the user id.
    4. Updates the user's answer in the database and the date of completion.
  */
  try {
    pool.query(question_valid_answers, [question_id, language]).then(async (rows, error) => {

      if (rows.length > 0) {
        const user_answer = answer.toLowerCase().replaceAll(" ", "").replaceAll("á", "a").replaceAll("é", "e").replaceAll("í", "i").replaceAll("ó", "o").replaceAll("ú", "u");
        const posible_answers = rows.map((row) => row.text.toLowerCase().replaceAll(" ", "").replaceAll("á", "a").replaceAll("é", "e").replaceAll("í", "i").replaceAll("ó", "o").replaceAll("ú", "u"));
        
        log("screenController/checkQuestionAnswers", "There are answers for question " + question_id + ": user->" + user_answer + "<-, databse->" + posible_answers + "<-")
        const is_correct = validateAnswers(user_answer, posible_answers)
        const user_id = validateJWT(token).id;
        if (user_id === undefined) {
          res.status(401).json({ error: "Invalid token" });
          log("screenController/checkQuestionAnswers", "Error: Invalid token")
        }
        else {
          const updated = await endAnsweringQuestion(user_id, question_id, user_answer, is_correct);
          if (updated) {
            if (is_correct) {
              checkAlreadyAnswered(question_id, user_id).then((rows) => {
                if (rows[0].times_answered_correctly <= 1) {
                  updateScore(res, user_id, question_id, difficulty);
                  log("screenController/checkQuestionAnswers", "Increase score")
                }
                else {
                  log("screenController/checkQuestionAnswers", "Error: Already answered")
                  res.status(200).json(is_correct);
                }
              })
            }
            else {
              log("screenController/checkQuestionAnswers", "Answer incorrect")
              res.status(200).json(is_correct);
            }
          }
          else {
            log("screenController/checkQuestionAnswers", "Error: Internal server error")
            res.status(500).json({ error: "Internal server error" });
          }
        }
      }
      else {

        log("screenController/checkQuestionAnswers Error", "There are no answers for question " + question_id)
        if (error) {
          log("screenController/checkQuestionAnswers",error);
          res.status(404).json({ error: "Question not found" });
        }
        else {
          const user_id = validateJWT(token).id;
          if (user_id === undefined) {
            res.status(401).json({ error: "Invalid token" });
          }
          else {
            const user_answer = String(answer).toLowerCase().replaceAll(" ", "");
            const updated = await endAnsweringQuestion(user_id, question_id, user_answer, 1, language);
            if (updated) {
              res.status(200).json(null);
            }
            else {
              res.status(500).json({ error: "Internal server error" });
            }
          }
        }
      }
    }
    )
  }
  catch (err) {
    log("screenController/checkQuestionAnswers error", err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Get an error message
const getErrorMessage = (res, error, language) => {
  /*
  1. Get an error message in a specific language
  2. Return an error message
  */
  try {
    pool.query(get_error_message, [error, language]).then((rows) => {
      if (rows.length > 0) {
        res.status(200).json(rows[0].text);
      }
      else {
        res.status(404).json({ error: "Error not found" });
      }
    })
  }
  catch (err) {
    log("screenController/getErrorMessage error", err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Ger the list of the user's awards
const getUserAward = (res, token, language) => {
  try {    
    const user_id = validateJWT(token).id; //Get the user token with all the information and extract the user_id
    if (user_id === undefined) {
      log("screenController/getUserAward error", "Invalid token");
      res.status(401).json({ error: "Invalid token" });
    }
    pool.query(get_user_award, [user_id, language]).then((rows) => { //Query to get all the awards of the user_id
      res.status(200).json(rows);  //Awards list      
    })
  }
  catch (err) {
    log("screenController/getUserAward error", "Internal server error ->" + err);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Ger award's info
const getAward = (res, language, planet_id, level_id) => {
  try {    
    pool.query(get_award, [language, level_id, planet_id]).then((rows) => { //Query to get all the awards of the user_id
      res.status(200).json(rows);  //Awards list      
    })
  }
  catch (err) {
    log("screenController/getUserAward error", "Internal server error ->" + err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getLevelScreens,
  getScreenText,
  getScreenAssets,
  getScreenComponents,
  getComponentQuestions,
  getComponentStoryDialogue,
  getComponentOptions,
  getLastScreen,
  checkQuestionAnswers,
  getNextScreen,
  getErrorMessage,
  getAwardData, 
  getUserAward, 
  getAward,
  getAwardsLevel
}
