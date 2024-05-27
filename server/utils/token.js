const jwt = require('jsonwebtoken');
const { log } = require("./logger");
require('dotenv').config(); //Load environment variables from the .env file

const already_used = new Map(); //Map for storing tokens already used
 
//Generate JWT
const generateJWT = (id, expiration="2h") => {
    try{
      const payload = {
        id: id,
      };
    
      const options = {
        expiresIn: expiration,
      };
    
      const token = jwt.sign(payload, process.env.JWT_KEY);
      return token;
    }
    catch(err){
      log("generateJWT", err)
    }
    
};
  
// Validate JWT
const validateJWT = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if(already_used.has(token)){
      log("validateJWT", "Token already used")
      return { valid: false, id: null };
    }
    return { valid: true, id: decoded.id};
  } 
  catch (error) {
    log("validateJWT", error)
    return { valid: false, id: null };
  }
}


//Delete token 
const deleteToken = (token) => {
  try {
    already_used.set(token, true); //Add the token to the map
  }
  catch (error) {
    log("deleteToken", error)
  }
}

module.exports = {
  generateJWT,
  validateJWT,
  deleteToken
}