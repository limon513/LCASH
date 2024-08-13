const bcrypt = require('bcrypt');
const serverConfig = require('../../config/server-config');
const jwt = require('jsonwebtoken');
const AppError = require('../errors/app-error');
const { StatusCodes } = require('http-status-codes');
const Enums = require('./enums');
const TranVAR = require('./transactional-variables');


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

function calculateChargesOnTransfer(transferType,amount){
    let charge;
    switch (transferType) {
        case Enums.TRANSACTION_TYPE.CASHOUT:
            charge = parseFloat((amount * TranVAR.TV.cashoutCharges).toFixed(2));
            break;
        case Enums.TRANSACTION_TYPE.CASHIN:
            charge = parseFloat((0).toFixed(2));
            break;
        case Enums.TRANSACTION_TYPE.SENDMONEY:
            charge = parseFloat((TranVAR.TV.sendMoneyCharges).toFixed(2));
            break;
        case Enums.TRANSACTION_TYPE.PAYMENT:
            charge = parseFloat((0).toFixed(2));
            break;
        default:
            break;
    }
    return charge;
}

function createResponseForTransfer(status,transactionId,transferType,amount,charge,reciverAccount){
    if(status === Enums.TRANSACTION_STATUS.SUCCESSFUL){
        return `${transferType} ${amount}tk with charge ${charge}tk to ${reciverAccount} is successfull. TRANSACTION ID ${transactionId}`;
    }
    return `${transferType} to ${reciverAccount} failed. TRANSACTION ID ${transactionId}`;
}

function sortData(sortBy,order,data){
    if(order === 'asc'){
        data.sort((a,b) =>{
            return a[sortBy] - b[sortBy];
        })
        return data;
    }
    data.sort((a,b) =>{
        return b[sortBy] -a[sortBy];
    })
}


module.exports = {
    hashThePassword,
    validatePhoneNumber,
    validatePIN,
    checkPIN,
    createToken,
    generateVcode,
    calculateChargesOnTransfer,
    createResponseForTransfer,
    sortData,
}