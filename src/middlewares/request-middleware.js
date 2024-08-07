const { StatusCodes } = require("http-status-codes")
const { ErrorResponse } = require("../utils/common")
const AppError = require("../utils/errors/app-error")

function validateRequest(req,res,next){
    if(!req.body.accNumber){
        ErrorResponse.error = new AppError(['Account Number needed!'],StatusCodes.BAD_REQUEST);
        res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.accType){
        ErrorResponse.error = new AppError(['Please confirm account type'],StatusCodes.BAD_REQUEST);
        res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.NID){
        ErrorResponse.error = new AppError(['NID number Required to Verify!'],StatusCodes.BAD_REQUEST);
        res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.NIDdetails){
        ErrorResponse.error = new AppError(['NID details needed!'],StatusCodes.BAD_REQUEST);
        res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}

module.exports = {
    validateRequest,
}