const crypto = require('crypto');

//Encrypt data
const encrypt = (text) => {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'utf8');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};
  
// Decrypt data
const decrypt = (encrypted) => {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'utf8');
    const cipherText = Buffer.from(encrypted, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(cipherText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = {
    encrypt,
    decrypt
};