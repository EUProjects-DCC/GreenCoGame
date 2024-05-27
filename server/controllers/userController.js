const { decrypt, encrypt } = require("../utils/encrypt");
const { log, saveEvent } = require("../utils/logger");
const { validateJWT } = require("../utils/token");
const pool = require('../config/db');
const { get_last_screen, get_world_position, get_local_ranking, get_world_ranking, update_difficulty, update_planet, get_user_profile_brief, get_user_points } = require("../queries/userQueries");


//Check if the email is in use
const checkUsedEmail = (res, email) => {
  /*
  * 1. Check that the emails doesn't exist
  * 2. Return an error message if the email already exists.
  * 3. Return a success message if the email does not exist.
  */
  try{
    email = encrypt(email);
    pool.query("SELECT * FROM user WHERE email=?", [email]).then((rows,err)=>{
      if(rows.length<=0){
        res.status(200).json({ message: "Email does not exist"});
      }
      else{
        log("userController/checkUsedEmail Error", "Email already exists");
        res.status(409).json({ message: "Email already exists"});
      }
    })
  }
  catch (err) {
    log("userController/checkUsedEmail Error", "Internal server error ->" + err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Checks if the alias is already in use
const checkUsedAlias = (res, alias) => {
  /*
  * 1. Check that the alias doesn't exist
  * 2. Return an error message if the alias already exists.
  * 3. Return a success message if the alias does not exist.
  */
  try{
    alias = encrypt(alias);
    pool.query("SELECT * FROM user WHERE alias=?", [alias]).then((rows,err)=>{
      if(rows.length<=0){
        res.status(200).json({ message: "Alias does not exist"});
        console.log("No existe")
      }
      else{
        log("userController/checkUsedAlias Error", "Alias already exists");
        res.status(409).json({ message: "Alias already exists"});
      }
    })
  }
  catch (err) {
    log("userController/checkUsedAlias Error", "Internal server error ->" + err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}


const getUserProfile = (res, token) => {
  try{
     let validate = validateJWT(token)
      if(validate.valid){
        pool.query("SELECT alias,points,avatar FROM user WHERE id=?", [validate.id]).then((rows)=>{
          if(rows.length>0){
            rows[0].alias = decrypt(rows[0].alias)
            res.status(200).json(rows[0]);
          }
          else{
            log("userController/getUserProfile Error", "User not found");
            res.status(404).json({ error: "User not found" });
          }
        })
      }
      else{
        log("userController/getUserProfile Error", "Invalid token");
        res.status(401).json({ error: "Invalid token" });
      }
  }
  catch (err) {
    log("userController/getUserProfile Error", "Internal server error ->" + err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Obtains a reduced version of the user's profile
const getUserProfileBrief = (res, token) => {
  /*
   * 1. Check the validation of the Token  y obtener el id del usuario
   * 2. Get user's information
  */
 try{
   let validate = validateJWT(token)
   if(validate.valid){
     pool.query(get_user_profile_brief, [validate.id]).then((rows)=>{
       if(rows.length>0){
         rows[0].alias = decrypt(rows[0].alias)
         res.status(200).json(rows[0]);
       }
       else{
        log("userController/getUserProfileBrief Error", "User not found");
         res.status(404).json({ error: "User not found" });
       }
     })
   }
   else{
    log("userController/getUserProfileBrief Error", "Invalid token");
     res.status(401).json({ error: "Invalid token" });
   }
  }
  catch (err) {
    log("userController/getUserProfileBrief Error", "Internal server error ->" + err.getErrorMessage);
   res.status(500).json({ error: "Internal server error" });
 }
}


// Cambio de correo y contraseña (dentro de la web)
const updateProfile = (res, email, password, token) => {
  /*
    * 1. Check the validation of the Token 
    * 2. Check that the email is not in use  
    * 3. Encrypt the email and password
    * 4. Update user values in database
    * 5. Store the event in database
    * 6. Return a success message
  */
  try{
    const start_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let validate = validateJWT(token)
    if(validate.valid){
      pool.query("SELECT * FROM user WHERE email=?", [email]).then((rows)=>{
      if(rows.length<=0){
        password = encrypt(password);
        email = encrypt(email);
        pool.query("UPDATE user SET password=?, email=? WHERE id=?", [password,email,validate.id]).then((rows,err)=>{
            if (rows.affectedRows > 0) {
              const end_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
              saveEvent(validate.id, start_date, end_date, "update_profile");
              res.status(200).json({ success: true});
            }
            else {
              log("userController/getUserProfileBrief Error", "Internal server error");
              res.status(500).json({ error: "Internal server error" });
            }
        })
      }
      else{
    log("userController/updateProfile Error", "Email already used");
        res.status(404).json({ error: "Email already used" });
      }
      })
    }
    else{
      log("userController/updateProfile Error", "Invalid token");
      res.status(401).json({ error: "Invalid token" });
    }
  }
  catch (err) {
    log("userController/updateProfile Error", "Internal server error ->" + err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Avatar update
const updateAvatar = (res, avatar, token) => {
  
  /*
    * 1. Check the validation of the Token 
    * 2. Update the avatar in the database
    * 3. Store the event in database
    * 4. Return a success message
  */
  
  try{
   const start_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
   let validate = validateJWT(token)
   if(validate.valid){
     pool.query("UPDATE user SET avatar=? WHERE id=?", [avatar,validate.id]).then((rows,err)=>{
         if (rows.affectedRows > 0) {
           const end_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
           saveEvent(validate.id, start_date, end_date, "update_avatar");
           res.status(200).json({ avatar: avatar });
         }
         else {
          log("userController/updateAvatar Error", "Internal server error");
           res.status(500).json({ error: "Internal server error" });
         }
     })
   }
   else{
    log("userController/updateAvatar Error", "Invalid token");
     res.status(401).json({ error: "Invalid token" });
   }
  }
  catch (err) {
    log("userController/updateAvatar Error", "Internal server error ->" + err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}


//Gets the world ranking of users (segmented)
const getWorldwideRanking = (res, limit, offset, token) => {
  /*
    * 1. Check the validation of the Token 
    * 2. Get the world ranking of users (from offset to offset+limit) 
    * 3. Return ranking
    * 4. Return an error message if there are no more users
  */
  try{
    let validate = validateJWT(token)
      if(validate.valid){
        pool.query(get_world_ranking, [limit, offset]).then((rows,err)=>{
          if(rows.length>0){
            rows.forEach((element,index) => {
              element.position = offset+index+1;
              element.alias = decrypt(element.alias)
            });
            res.status(200).json(rows);
          }
          else{
            log("userController/getWorldwideRanking Error", "No users found");
            res.status(404).json({ error: "No users found" });
          }
        })
      }
      else{
        log("userController/getWorldwideRanking Error", "Invalid token");
        res.status(401).json({ error: "Invalid token" });
      }
  }
  catch (err) {
    log("userController/getWorldwideRanking Error", "Internal server error ->" + err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  } 
}

//Gets the local ranking of users (segmented)
const getLocalRanking = (res, limit, offset, token) => {
 /*
    * 1. Check the validation of the Token 
    * 2. Get the world ranking of users (from offset to offset+limit) 
    * 3. Return ranking
    * 4. Return an error message if there are no more users
 */
 try{
   let validate = validateJWT(token)
   if(validate.valid){
       pool.query("SELECT country_id from user where id = ?", [validate.id]).then((rows,err)=>{
         if(rows.length>0){
           country = rows[0].country_id;
           pool.query(get_local_ranking, [country, limit, offset]).then((rows,err)=>{
             if(rows.length>0){
               rows.forEach((element,index) => {
                 element.position = offset+index+1;
                 element.alias = decrypt(element.alias)
               });
               res.status(200).json(rows);
             }
             else{
              log("userController/getLocalRanking Error", "No users found");
               res.status(404).json({ error: "No users found" });
             }
           })
         }
         else{
          log("userController/getLocalRanking Error", "User not found");
           res.status(404).json({ error: "User not found" });
         }
       })
     }
     else{
      log("userController/getLocalRanking Error", "Invalid token");
       res.status(401).json({ error: "Invalid token" });
     }
 }
 catch (err) {
  log("userController/getLocalRanking Error", "Internal server error ->" + err);
   res.status(500).json({ error: "Internal server error" });
 }
}

//Get user points
const getUserPoints = (res, token) => {
  try{
    let validate = validateJWT(token)
    if(validate.valid){
      pool.query(get_user_points, [validate.id])
        .then((rows,err)=>{
          if(rows.length>0){
            res.status(200).json(rows[0]);
          }
          else{
            log("userController/getUserPoints Error", "User not found");
            res.status(404).json({ error: "User not found" });
          }
        })
      }
      else{
        log("userController/getUserPoints Error", "Invalid token");
        res.status(401).json({ error: "Invalid token" });
      }
  }
  catch (err) {
    log("userController/getUserPoints Error", "Internal server error ->" + err);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Gets the user's position in the world rankings
const getWorldPosition = (res, token) => {
  /*
    * 1. Check the validation of the Token 
    * 2. Obtain the user's position in the world ranking
    * 3. Return possition
  */
  try{
    let validate = validateJWT(token)
    if(validate.valid){
      pool.query(get_world_position, [validate.id])
        .then((rows,err)=>{
          if(rows.length>0){
            rows[0].alias = decrypt(rows[0].alias)
            rows[0].position = parseInt(rows[0].position);
            res.status(200).json(rows[0]);
          }
          else{
            log("userController/getWorldPosition Error", "User not found");
            res.status(404).json({ error: "User not found" });
          }
        })
      }
      else{
        log("userController/getWorldPosition Error", "Invalid token");
        res.status(401).json({ error: "Invalid token" });
      }
  }
  catch (err) {
    log("userController/getWorldPosition Error", "Internal server error ->" + err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Gets the user's position in the local rankings
const getLocalPosition = (res, token) => {
  /*
    * 1. Check the validation of the Token 
    * 2. Obtain the user's position in the local ranking
    * 3. Return possition
  */

  try{
    let validate = validateJWT(token)
    if(validate.valid){
      pool.query(
        `SELECT position, avatar, alias, points FROM (SELECT RANK() OVER (ORDER BY points DESC)
        AS position, id, avatar, alias, points FROM user WHERE country_id =
        (SELECT country_id FROM user WHERE id = ?))
        as ranked_users WHERE id = ?`, [validate.id, validate.id])
        .then((rows,err)=>{
          if(rows.length>0){
            rows[0].alias = decrypt(rows[0].alias)
            rows[0].position = parseInt(rows[0].position);
            res.status(200).json(rows[0]);
          }
          else{
            log("userController/getLocalPosition Error", "User not found");
            res.status(404).json({ error: "User not found" });
          }
        })
      }
      else{
        log("userController/getLocalPosition Error", "Invalid token");
        res.status(401).json({ error: "Invalid token" });
      }
  }
  catch (err) {
    log("userController/getLocalPosition Error", "Internal server error ->" + err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Updates the user's game difficulty
const updateDifficulty = (res, difficulty, token) => {
  /*
    * 1. Check the validation of the Token 
    * 2. Update difficulty in database
    * 3. Store the event in database
    * 4. Return user's game difficulty
  */
  try{
    let validate = validateJWT(token)
    if(validate.valid){
      pool.query(update_difficulty, [difficulty,validate.id]).then((rows,err)=>{
          if (rows.affectedRows > 0) {
            log("userController/updateDifficulty", "Level changed");
            res.status(200).json({ difficulty: difficulty });
          }
          else {
            log("userController/updateDifficulty Error", "Internal server error");
            res.status(500).json({ error: "Internal server error" });
          }
      })
    }
    else{
      log("userController/updateDifficulty Error", "Invalid token");
      res.status(401).json({ error: "Invalid token" });
    }
  }
  catch (err) {
    log("userController/updateDifficulty Error", "Internal server error ->" + err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Update user's palte
const updatePlanet = (res, planet, token) => {
  /*
    * 1. Check the validation of the Token 
    * 2. Update the user's plante in database
    * 3. Store the event in database
    * 4. Return the new planet
  */
  try{
    let validate = validateJWT(token)
    if(validate.valid){
      pool.query(update_planet, [planet,validate.id]).then((rows,err)=>{
          if (rows.affectedRows > 0) {
            res.status(200).json({ planet: planet });
          }
          else {
            log("userController/updatePlanet Error", "Internal server error");
            res.status(500).json({ error: "Internal server error" });
          }
      }
    )}
    else{
      log("userController/updatePlanet Error", "Invalid token");
      res.status(401).json({ error: "Invalid token" });
    }
  }
  catch (err) {
    log("userController/updatePlanet Error", "Internal server error ->" + err.getErrorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  checkUsedEmail
  ,checkUsedAlias
  ,getUserProfile
  ,getUserProfileBrief
  ,updateProfile
  ,updateAvatar
  ,getWorldwideRanking
  ,getLocalRanking
  ,getWorldPosition
  ,getLocalPosition
  ,updateDifficulty
  ,updatePlanet
  ,updateLastScreen,
  getUserPoints
}
