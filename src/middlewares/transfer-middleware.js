const jwt = require('jsonwebtoken');
const {SuccessResponse,ErrorResponse, Enums} = require('../utils/common');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const serverConfig = require('../config/server-config');
const { AccountRepository } = require('../repositories');

const AccountRepo = new AccountRepository();


async function transferValidate(req,res,next){
    if(!req.body.reciverAccount){
        ErrorResponse.error = new AppError(['Empty Reciver Account Number!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.PIN){
        ErrorResponse.error = new AppError(['Six degit PIN required!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.amount){
        ErrorResponse.error = new AppError(['Amount not given!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    try {
        const account = await AccountRepo.getFromAccount(req.body.accNumber);
        if(!account){
            ErrorResponse.error = new AppError(['No active user found! Please verify your Account First.'],StatusCodes.NOT_FOUND);
            return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
        }
        if(account.accStatus !== Enums.ACC_STATUS.ACTIVE){
            ErrorResponse.error = new AppError(['Your account is blocked due to security concern. Please contact hotline and verify.'],StatusCodes.UNAUTHORIZED);
            return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
        }
        req.body.senderAccount = req.body.accNumber;
        const reciveraccount = await AccountRepo.getFromAccount(req.body.reciverAccount);
        if(!reciveraccount){
            ErrorResponse.error = new AppError(['No Lcash account in this number!'],StatusCodes.NOT_FOUND);
            return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
        }
        if(reciveraccount.accStatus !== Enums.ACC_STATUS.ACTIVE){
            ErrorResponse.error = new AppError(['Reciver Account is not active!'],StatusCodes.BAD_REQUEST);
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
    transferValidate,
}