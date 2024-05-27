const pool = require("../config/db");
const { validateJWT } = require("../utils/token");

// List of avatars
const getAvatars= (res,token) => {

    /* 
        * 1. Check a valid token
        * 2. Get avatar path, fitering by type "profile_img" in assests table
        * 3. Return avatar path
    */
    try{
        const validate = validateJWT(token);
        const filter = "profile_img"; // Filter to obtain the avatars
        if(validate.valid){
            pool.query("SELECT path FROM assets WHERE type=?", [filter]).then((rows,err)=>{
                if(rows.length>0){
                    res.status(200).json({ rows });
                }
                else{
                    res.status(404).json({ error: "User not found" });
                }
            })
        }
        else{
            log("assetsController/getAvatars Error", "Invalid token" + err); // Error log
            res.status(401).json({ error: "Invalid token" }); // invalid token
        }
    }
    catch (err) {
        log("assetsController/getAvatars Error", "Internal server error" + err); // Log de errores
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getAvatars
}
