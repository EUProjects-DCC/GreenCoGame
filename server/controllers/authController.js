const crypto = require("crypto");
const { decrypt, encrypt } = require("../utils/encrypt"); // Encript and deencript Functions
const { log, saveEvent } = require("../utils/logger"); // Logging functions
const { generateJWT, validateJWT, deleteToken } = require("../utils/token"); // JWT Funtions
const { sendEmail } = require("../mail/email"); // Functions to send email
require("dotenv").config(); //Load environment variables

const pool = require("../config/db.js");
const { last_guest_id } = require("../queries/userQueries");


//User autentication
const loginUser = (res, alias, password) => {
  /*
  * 1. Check that user and passwords are correct
  * 2. Generate new Token
  * 3. Return Token
  * 4. Store the event in database
  * 5. Return Token e información del usuario
  */
  try {
    log("authController/loginUser", "Atempt of login of " + alias);
    const start_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const aliasEncrypted = encrypt(alias);
    const passwordEncrypted = encrypt(password);
    pool.query("SELECT alias, password, id, avatar, points, planet_id, difficulty_id, last_screen FROM user WHERE alias=? AND password=?", [aliasEncrypted, passwordEncrypted])
      .then((rows) => {
        if (rows.length > 0) {
          let token = generateJWT(rows[0].id) // Generate Token
          if (token) {
            const end_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            saveEvent(rows[0].id, start_date, end_date, "login"); // Store the event in database
            res.status(200).json({ alias: alias, password: password, token: token, avatar: rows[0].avatar, points: rows[0].points, planet_id: rows[0].planet_id, difficulty_id: rows[0].difficulty_id, last_screen: rows[0].last_screen });
          }
          else {
            log("authController/loginUser Error", "Internal server error");
            res.status(500).json({ error: "Internal server error" });
          }
        }
        else {
          log("authController/loginUser Error", "Invalid credentials");
          res.status(401).json({ error: "Invalid credentials" });
        }
      })
  }
  catch (err) {
    log("authController/loginUser Error", "Internal server error ->" + err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//User register
const signupUser = (res, alias, email, password, birthDate, country, gender) => {
  /*
  * 1. Check that the alias and email doesn't exist
  * 2. GuesEncript alias, email and password
  * 3. Insert user in database
  * 4. Generate new Token
  * 5. Return Token
  * 6. Store the event in database
  * 7. Return Token e información del usuario
  * */

  try {
    const start_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    alias = encrypt(alias);
    email = encrypt(email);
    password = encrypt(password);
    pool.query("SELECT * FROM user WHERE alias=? or email=?", [alias, email]).then((rows, err) => {
      if (rows.length <= 0) {
        pool.query("INSERT INTO user (alias, password, email,birth_date, country_id, gender) VALUES (?,?,?,STR_TO_DATE(?, '%d/%m/%Y'),?,?)", [alias, password, email, birthDate, country, gender]).then((result, err) => {
          if (result.affectedRows > 0) {
            const end_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            saveEvent(result.insertId, start_date, end_date, "signup");
            res.status(200).json({ message: "User created" });
          }
          else {
            log("authController/signupUser Error", "Internal server error");
            res.status(500).json({ error: "Internal server error" });
          }
        })
      }
      else {
        log("authController/signupUser Error", "User already exists");
        res.status(409).json({ error: "User already exists" });
      }
    })
  }
  catch (err) {
    log("authController/signupUser Error", "Internal server error ->" + err);
    res.status(500).json({ error: "Internal server error" });
  }
}


// Get the last id of a guest user
const getLastGuest = () => {
  try {
    return pool.query(last_guest_id)
  }
  catch (err) {
    log("getLastGuest", err);
    return null;
  }
}

// Gues user register
const guestSignup = async (res) => {

  /*
    1. Get the last id of a guest user
    2. Generate new alias fo the new user throug the las returned id
    3. Insert user in database
    4. Generate new Token
    5. Return Token
    6. Store the event in database
    7. Return Token and user information
  */
  try {
    const start_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const lastGuest = await getLastGuest();
    if (lastGuest) {
      let alias = encrypt("guest" + Number(lastGuest[0].id + 1));
      pool.query("INSERT INTO user(alias) VALUES (?)", [alias]).then((result, err) => {
        if (result.affectedRows > 0) {
          let id = Number(result.insertId);
          let token = generateJWT(id)
          alias = decrypt(alias)
          if (token) {
            const end_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            saveEvent(id, start_date, end_date, "signup_guest");
            res.status(200).json({ alias: alias, token: token });
          }
          else {
            log("authController/guestSignup Error", "Internal server error");
            res.status(500).json({ error: "Internal server error" });
          }
        }
        else {
          log("authController/guestSignup Error", "Internal server error");
          res.status(500).json({ error: "Internal server error" });
        }
      })
    }
    else {
      log("authController/guestSignup Error", "Internal server error");
      res.status(500).json({ error: "Internal server error" });
    }
  }
  catch (err) {
    log("authController/guestSignup Error", "Internal server error ->" + err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Send emain to recover password
const sendEmailPassword = (res, email) => {

  /*
    1. Check that the email exists
    2. Generate new Token
    3. Enviar un email con el token y la url de reseteo de contraseña
  */

  try {
    const start_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    pool.query("SELECT * from user where email=?", [encrypt(email)]).then((result, err) => {
      if (result.length > 0) {
        let id = Number(result[0].id);
        let token = generateJWT(id, '5m')
        let user = decrypt((result[0].alias))
        if (token) {

          const url_front = `${process.env.FRONTEND_URL}/auth/reset-password/${user}/${token}`;

          let html = `
            <!doctype html>
            <html>
              <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
              </head>
              <body style="font-family: sans-serif;">
                <div style="display: block; margin: auto; max-width: 600px;" class="main">
                  <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">GreenCo Application Password Reset Notification</h1>
                  <p>Hi ${user},<br>
                  You recently requested a new password for your GreenCo account with the email address ${email}.<br>
                  Click here to reset your password: ${url_front}<br>
                  If you did not request this password change, please do not click on the link above!<br>
                  Regards,<br><br>
                  The GreenCo Team</p>
                </div>
                <style>
                  .main { background-color: white; }
                  a:hover { border-left-width: 1em; min-height: 2em; }
                </style>
              </body>
            </html>
          `;
          sendEmail(id, email, "GreenCo Application Password Reset Notification", html, start_date, res);
        }
        else {
          log("authController/sendEmailPassword Error", "Internal server error");
          res.status(500).json({ error: "Internal server error" });
        }
      }
      else {
        log("authController/sendEmailPassword Error", "Email doesnt exist");
        res.status(401).json({ error: "Email doesnt exist" });
      }
    })
  }
  catch (err) {
    log("authController/sendEmailPassword Error", "Internal server error ->" + err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Password reset
const resetPassword = (res, password, token) => {

  /*
    1. Check validation of token
    2. Encript password
    3. Update password in database
    4. Store the event in database
  */

  try {
    const start_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let validate = validateJWT(token);
    if (validate.valid) {
      //Search previous password
      pool.query("select * from user where password = ? and id = ?", [encrypt(password), validate.id]).then((rows) => {
        if (rows.affectedRows > 0) {
          log("authController/resetPassword Error", "Same password than previous one");
          res.status(402).json({ error: "Same password than the previous one" });
        }
        else {
          pool.query("UPDATE user SET password = ? WHERE id = ?", [encrypt(password), validate.id]).then((rows) => {
            if (rows.affectedRows > 0) {
              const end_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
              saveEvent(validate.id, start_date, end_date, "reset_password");
              res.status(200).json({ message: "Password updated" });
            }
            else {
              log("authController/resetPassword Error", "User not found");
              res.status(404).json({ error: "User not found" });
            }
          })
        }
      })
    }
    else {
      log("authController/resetPassword Error", "Invalid token");
      res.status(401).json({ error: "Invalid token" });
    }

  }
  catch (err) {
    log("authController/resetPassword Error", "Internal server error ->" + err);
    res.status(500).json({ error: "Internal server error" });
  }

  finally {
    deleteToken(token);
  }
}

module.exports = {
  loginUser,
  signupUser,
  guestSignup,
  sendEmailPassword,
  resetPassword
};
