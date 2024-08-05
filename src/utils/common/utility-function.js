const bcrypt = require('bcrypt');
const serverConfig = require('../../config/server-config');
const jwt = require('jsonwebtoken');
const AppError = require('../errors/app-error');
const { StatusCodes } = require('http-status-codes');

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

function checkPIN(plainPIN,encryptPIN){
    try {
        return bcrypt.compareSync(plainPIN,encryptPIN);
    } catch (error) {
        throw new AppError(['Server side problem,please retry sometime later.'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

function createToken(payload){
    try {
        return jwt.sign(payload,serverConfig.JWTSECRET,{expiresIn:serverConfig.JWTEXPIRY});
    } catch (error) {
        console.log(error);
        throw new AppError(['Server side problem,please retry sometime later.'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

function generateVcode(){
    return Math.floor(100000 + Math.random() * 900000);
}

module.exports = {
    hashThePassword,
    validatePhoneNumber,
    validatePIN,
    checkPIN,
    createToken,
    generateVcode,
}