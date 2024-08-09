const { StatusCodes } = require("http-status-codes")
const { ErrorResponse, Enums } = require("../utils/common")
const AppError = require("../utils/errors/app-error")

function validateRequest(req,res,next){
    if(!req.body.accNumber){
        ErrorResponse.error = new AppError(['Account Number needed!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.accType){
        ErrorResponse.error = new AppError(['Please confirm account type'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(![Enums.ACC_TYPE.PERSONAL,Enums.ACC_TYPE.AGENT,Enums.ACC_TYPE.MARCHENT,Enums.ACC_TYPE.SUPERADMIN].includes(req.body.accType)){
        ErrorResponse.error = new AppError(['Accurate account type not defined.'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.NID){
        ErrorResponse.error = new AppError(['NID number Required to Verify!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.NIDdetails){
        ErrorResponse.error = new AppError(['NID details needed!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}

function validateResolveRequest(req,res,next){
    if(!req.params.id){
        ErrorResponse.error = new AppError(['Requset identifier missing!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.headers['resolve']){
        ErrorResponse.error = new AppError(['Resolve type not defined!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    const resolve = +req.headers['resolve'];
    if(resolve > 2 || resolve < 1){
        ErrorResponse.error = new AppError(['Resolve type not defined!'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}

module.exports = {
    validateRequest,
    validateResolveRequest,
}