const jwt = require('jsonwebtoken');
const {SuccessResponse,ErrorResponse, Enums} = require('../utils/common');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const serverConfig = require('../config/server-config');
const { AccountThroughRepository } = require('../repositories');

const AccountThroughRepo = new AccountThroughRepository();

function validateVerification(req,res,next){
    if(!req.body.senderAccount){
        ErrorResponse.error = new AppError(['sender account empty!'],StatusCodes.BAD_REQUEST);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
    next();
}

function validateVerify(req,res,next){
    if(!req.body.senderAccount){
        ErrorResponse.error = new AppError(['sender account empty!'],StatusCodes.BAD_REQUEST);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
    if(!req.body.code){
        ErrorResponse.error = new AppError(['verification code empty!'],StatusCodes.BAD_REQUEST);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
    next();
}

function verifyApiKey(req,res,next){
    const apiKey = req.headers['x-api-key'];
    if(!apiKey){
        ErrorResponse.error = new AppError(['Api Key not found!'],StatusCodes.UNAUTHORIZED);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
    try {
        const marchent = jwt.verify(apiKey,serverConfig.JWTSECRET);
        req.body.reciverAccount = marchent.accNumber;
        next();
    } catch (error) {
        if(error.name == 'TokenExpiredError') error.message = "Api Key expired";
        if(error.name == 'JsonWebTokenError') error.message = "Invalid Api Key";
        ErrorResponse.error = new AppError(error.message,StatusCodes.UNAUTHORIZED);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
}

function verifyTepmToken(req,res,next){
    const token = req.headers['x-temp-token'];
    if(!token){
        ErrorResponse.error = new AppError(['access token not found!'],StatusCodes.UNAUTHORIZED);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
    try {
        const user = jwt.verify(token,serverConfig.JWTSECRET);
        req.body.senderAccount = user.accNumber;
        next();
    } catch (error) {
        ErrorResponse.error = new AppError(error.message,StatusCodes.UNAUTHORIZED);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
}

async function authMarchent(req,res,next){
    console.log(req.body.reciverAccount);
    const accNumber = req.body.reciverAccount;
    try {
        const marchent = await AccountThroughRepo.getByAccount(accNumber);
        if(!marchent){
            ErrorResponse.error = new AppError(['No active marchent found!'],StatusCodes.NOT_FOUND);
            return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
        }
        if(marchent.accStatus !== Enums.ACC_STATUS.ACTIVE){
            ErrorResponse.error = new AppError(['Marchent not found!'],StatusCodes.NOT_FOUND);
            return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
        }
        if(marchent.accType !== Enums.ACC_TYPE.MARCHENT){
            ErrorResponse.error = new AppError(['You are not Authorized for this!'],StatusCodes.UNAUTHORIZED);
            return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
        }
        next();
    } catch (error) {
        console.log(error);
        if(error instanceof Error) ErrorResponse.error = error;
        else ErrorResponse.error = new AppError(['Service Unavailable!'],StatusCodes.INTERNAL_SERVER_ERROR);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }   
}


module.exports = {
    verifyApiKey,
    verifyTepmToken,
    authMarchent,
    validateVerification,
    validateVerify,
}