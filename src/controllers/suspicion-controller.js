const serverConfig = require('../config/server-config');
const {SuspicionService} = require('../services');
const {ErrorResponse,SuccessResponse} = require('../utils/common');
const {StatusCodes} = require('http-status-codes');

async function clearSuspicion(req,res){
    try {
        const response = await SuspicionService.clearSuspicion(req.body);
        SuccessResponse.data = response;
        SuccessResponse.message = serverConfig.SUCCESSFULLVERIFICATIONMESSAGE;
        return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    clearSuspicion,
}