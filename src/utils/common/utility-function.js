const bcrypt = require('bcrypt');
const serverConfig = require('../../config/server-config');

function hashThePassword(password){
    const hashedPassword = bcrypt.hashSync(password,+serverConfig.SALTROUND);
    console.log(hashedPassword);
    return hashedPassword;
}

function validatePhoneNumber(phone){
    const phoneRegex = /^01[3-9]\d{8}$/;
    if(!phoneRegex.test(phone)) return false;
    else return true;
}

function validatePIN(PIN){
    const numberRegex = /^\d{6}$/;
    if(!numberRegex.test(PIN)) return false;
    else return true;
}

module.exports = {
    hashThePassword,
    validatePhoneNumber,
    validatePIN,
}