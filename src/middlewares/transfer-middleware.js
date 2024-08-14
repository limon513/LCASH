const jwt = require('jsonwebtoken');
const {SuccessResponse,ErrorResponse, Enums} = require('../utils/common');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const serverConfig = require('../config/server-config');
const { AccountThroughRepository } = require('../repositories');

const AccountThroughRepo = new AccountThroughRepository();


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
    if(!req.body.transactionType){
        ErrorResponse.error = new AppError(['Transfer type not defined!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    
    next();
}


module.exports = {
    transferValidate,
}