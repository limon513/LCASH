const { StatusCodes } = require('http-status-codes');
const {VerificationRepository} = require('../repositories');
const { Utility } = require('../utils/common');
const {compareTime} = require('../utils/helpers/datetime-helpers');
const AppError = require('../utils/errors/app-error');
const serverConfig = require('../config/server-config');

const VerificationRepo = new VerificationRepository();

async function generateCode(data){
    try {
        data.code = Utility.generateVcode();
        const response = await VerificationRepo.generateCode(data);
        return response;
    } catch (error) {
        throw new AppError(['Service Unavaiable'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function reGenerateCode(data){
    try {
        data.code = Utility.generateVcode();
        const response = await VerificationRepo.updateCode(data);
        return response;
    } catch (error) {
        throw new AppError(['Service Unavaiable'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function matchCode(data){
    try {
        const accNumber = data.senderAccount;
        const response = await VerificationRepo.getCode(accNumber);
        if(!response) throw new AppError(['no code found for this number,'],StatusCodes.NOT_FOUND);
        if(!compareTime(response.updatedAt)) throw new AppError(['code expired'],StatusCodes.REQUEST_TIMEOUT);
        if(data.code != response.code) throw new AppError(['wrong code'],StatusCodes.BAD_REQUEST);
        const temporaryToken = Utility.createToken({accNumber:data.senderAccount},serverConfig.JWT_PAYMENT_EXPIRY);
        return {tempToken: temporaryToken};
    } catch (error) {
        if(error instanceof Error) throw error;
        throw new AppError(['Service unavailable'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    generateCode,
    reGenerateCode,
    matchCode,
}