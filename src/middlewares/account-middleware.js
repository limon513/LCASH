const { StatusCodes } = require("http-status-codes")
const { ErrorResponse, Utility } = require("../utils/common")
const AppError = require("../utils/errors/app-error")

function userValidate(req,res,next){
    if(!req.body.accNumber){
        ErrorResponse.error = new AppError(['Account Number required!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.PIN){
        ErrorResponse.error = new AppError(['Six degit PIN required!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!Utility.validatePhoneNumber(req.body.accNumber.trim())){
        ErrorResponse.error = new AppError(['Phone Number not Valid!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!Utility.validatePIN(req.body.PIN.trim())){
        ErrorResponse.error = new AppError(['Only Six degit Number allowed!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    req.body = {
        userName:req.body.userName,
        accNumber:req.body.accNumber.trim(),
        PIN:req.body.PIN.trim(),
    };
    next();
}

function signInValidate(req,res,next){
    if(!req.body.accNumber){
        ErrorResponse.error = new AppError(['Empty Account Number!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.PIN){
        ErrorResponse.error = new AppError(['Six degit PIN required!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    req.body = {
        accNumber:req.body.accNumber.trim(),
        PIN:req.body.PIN.trim(),
    };
    next();
}

module.exports = {
    userValidate,
    signInValidate,
}