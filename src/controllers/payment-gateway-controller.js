const { PaymentGateWayService, VerificationService } = require('../services');
const {ErrorResponse,SuccessResponse} = require('../utils/common');
const {StatusCodes} = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const serverConfig = require('../config/server-config');

function getApiKey(req,res){
    try {
        const payload = {accNumber:req.body.accNumber};
        const response = PaymentGateWayService.getApiKey(payload);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

async function requrestVerificationCode(req,res){
    try {
        const code = await VerificationService.generateCode({accNumber:req.body.senderAccount});
        const response = {
            senderAccount: req.body.senderAccount,
            message: serverConfig.AFTERCODESENT,
        };
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        if(error instanceof Error) ErrorResponse.error = error;
        else ErrorResponse.error = new AppError(['Service unavaiable'],StatusCodes.INTERNAL_SERVER_ERROR);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
}

async function matchCode(req,res){
    try {
        const response = await VerificationService.matchCode(req.body);
        if(!response) throw new AppError(['Verfication code not matching'],StatusCodes.UNAUTHORIZED);
        SuccessResponse.data = {
            message:'verified successfull',
            tempToken: response.tempToken,
        };
        return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
    } catch (error) {
        console.log(error);
        if(error instanceof Error) ErrorResponse.error = error;
        else ErrorResponse.error = new AppError(['Service unavaiable'],StatusCodes.INTERNAL_SERVER_ERROR);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
}




module.exports = {
    getApiKey,
    requrestVerificationCode,
    matchCode,
}