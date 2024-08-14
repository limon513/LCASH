const jwt = require('jsonwebtoken');
const {SuccessResponse,ErrorResponse, Enums} = require('../utils/common');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const serverConfig = require('../config/server-config');
const { AccountThroughRepository } = require('../repositories');

const AccountThroughRepo = new AccountThroughRepository();

function verifyToken(req,res,next){
    const token = req.headers['x-access-token'];
    if(!token){
        ErrorResponse.error = new AppError(['JWT not found!'],StatusCodes.UNAUTHORIZED);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
    try {
        const user = jwt.verify(token,serverConfig.JWTSECRET);
        req.body.accNumber = user.accNumber;
        next();
    } catch (error) {
        ErrorResponse.error = new AppError(error.message,StatusCodes.UNAUTHORIZED);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
}

async function isActive(req,res,next){
    const accNumber = req.body.accNumber;
    try {
        const senderAccount = await AccountThroughRepo.getByAccount(accNumber);
        if(!senderAccount){
            ErrorResponse.error = new AppError(['No active user found! Please verify your Account First.'],StatusCodes.NOT_FOUND);
            return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
        }
        if(senderAccount.accStatus !== Enums.ACC_STATUS.ACTIVE){
            ErrorResponse.error = new AppError(['Your account is blocked due to security concern. Please contact hotline and verify.'],StatusCodes.UNAUTHORIZED);
            return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
        }
        const reciverAccount = await AccountThroughRepo.getByAccount(req.body.reciverAccount);
        if(!reciverAccount){
            ErrorResponse.error = new AppError(['No active reciver found!'],StatusCodes.NOT_FOUND);
            return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
        }
        if(reciverAccount.accStatus !== Enums.ACC_STATUS.ACTIVE){
            ErrorResponse.error = new AppError(['reciver account is not active!'],StatusCodes.NOT_ACCEPTABLE);
            return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
        }
        if(reciverAccount.accType !== Enums.ACC_TYPE.AGENT){
            ErrorResponse.error = new AppError(['you can only cashout to agents!'],StatusCodes.NOT_ACCEPTABLE);
            return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
        }
        next();
    } catch (error) {
        if(error instanceof Error) ErrorResponse.error = error;
        else ErrorResponse.error = new AppError(['Service Unavailable!'],StatusCodes.INTERNAL_SERVER_ERROR);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
}

//TODO: authorize superadmins
async function authSuperAdmin(req,res,next){
    const accNumber = req.body.accNumber;
    try {
        const superAdmin = await AccountThroughRepo.getByAccount(accNumber);
        if(!superAdmin){
            ErrorResponse.error = new AppError(['No active user found!'],StatusCodes.NOT_FOUND);
            return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
        }
        if(superAdmin.accStatus !== Enums.ACC_STATUS.ACTIVE){
            ErrorResponse.error = new AppError(['You are not Authorized for this!'],StatusCodes.NOT_FOUND);
            return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
        }
        if(superAdmin.accType !== Enums.ACC_TYPE.SUPERADMIN){
            ErrorResponse.error = new AppError(['You are not Authorized for this!'],StatusCodes.UNAUTHORIZED);
            return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
        }
        next();
    } catch (error) {
        if(error instanceof Error) ErrorResponse.error = error;
        else ErrorResponse.error = new AppError(['Service Unavailable!'],StatusCodes.INTERNAL_SERVER_ERROR);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
}



module.exports = {
    verifyToken,
    authSuperAdmin,
    isActive,
}