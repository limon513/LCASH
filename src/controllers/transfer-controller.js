const serverConfig = require('../config/server-config');
const TransferService = require('../services/transfer-service');
const { ErrorResponse, SuccessResponse, Utility, Enums } = require('../utils/common');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

const IdempotencyRedis = {};

async function TransferMoney(req, res) {
    req.body.senderAccount = req.body.accNumber;
    try {
        const idempotencyKey = req.headers['x-idempotency-key'];

        if (!idempotencyKey) {
            throw new AppError(['Idempotency Key missing!'], StatusCodes.BAD_REQUEST);
        }

        if (IdempotencyRedis[idempotencyKey]) {
            throw new AppError(['Duplicate Request!'], StatusCodes.BAD_REQUEST);
        }

        const response = await TransferService.TransferMoney(req.body);

        IdempotencyRedis[idempotencyKey] = idempotencyKey;

        SuccessResponse.data = response;
        return res
            .status(StatusCodes.ACCEPTED)
            .json(SuccessResponse);

    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            ErrorResponse.error = error;
            return res
                        .status(ErrorResponse.error.statusCode)
                        .json(ErrorResponse);
        }
        ErrorResponse.error = new AppError(['Service unavailale!'], StatusCodes.INTERNAL_SERVER_ERROR);
        return res
                    .status(ErrorResponse.error.statusCode)
                    .json(ErrorResponse);
    }
}

async function getTransactions(req,res){
    try {
        const response = await TransferService.getTransactions(req.body);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    TransferMoney,
    getTransactions,
}