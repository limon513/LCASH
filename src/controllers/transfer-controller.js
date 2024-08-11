const serverConfig = require('../config/server-config');
const TransferService = require('../services/transfer-service');
const {ErrorResponse,SuccessResponse} = require('../utils/common');
const {StatusCodes} = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

async function CashOut(req,res){
    try {
        const response = await TransferService.CashOut(req.body);
        SuccessResponse.data = response;
        return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
    } catch (error) {
        if(error instanceof Error){
            ErrorResponse.error = error;
            return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
        }
        ErrorResponse.error = new AppError(['Service unavailale!'],StatusCodes.INTERNAL_SERVER_ERROR);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    CashOut,
}