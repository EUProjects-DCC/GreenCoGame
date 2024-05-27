const fs = require('fs');
const pool = require('../config/db');

// Save log information, mainly for errors
const log = (method,message) => {
    let date = new Date().toISOString()
    let log = `\n[${date}] ${method}: ${message}`
    if(method.includes("Error"))
    {
      fs.appendFile('server_log.txt', log, (err) => {
        if (err) throw err;
      });
    }
    console.log(method + "->" + message)
}

//Saving information about when users access to the page
const saveEvent = (user_id, start_date, end_date, type) => {
  try{
    pool.query("INSERT INTO user_event(user_id, start_date, end_date, type) VALUES (?,?,?,?)", [user_id, start_date, end_date, type])
  }
  catch (err) {
    log("saveEvent", err);
  }
}
module.exports = { log, saveEvent };
