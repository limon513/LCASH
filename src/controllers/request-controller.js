const {RequestService} = require('../services');
const {ErrorResponse,SuccessResponse} = require('../utils/common');
const {StatusCodes} = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

async function create(req,res){
    try {
        const response = await RequestService.create(req.body);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        if(error instanceof Error){
            ErrorResponse.error = error;
        }
        else ErrorResponse.error = new AppError(['Service Unavailable, Please try again later.'],StatusCodes.INTERNAL_SERVER_ERROR);
        return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
    }
}


module.exports = {
    create,
}