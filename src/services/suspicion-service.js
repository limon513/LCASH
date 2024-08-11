const {SuspicionRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes');
const serverConfig = require('../config/server-config');
const {Utility, Enums} = require('../utils/common');

const SuspicionRepo = new SuspicionRepository();

async function create(data){
    try {
        const checkForEntry = await SuspicionRepo.getByAccountAndType(data.accNumber,data.type);
        if(checkForEntry){
            if(checkForEntry.attempt >= +serverConfig.ACCEPTLOGINATTEMPT){
                if(checkForEntry.message){
                    return {accNumber:checkForEntry.accNumber,message:checkForEntry.message};
                }
                const updateSuspicion = await SuspicionRepo.update(data.accNumber,data.type,{
                    message: serverConfig.LOGINATTEMPTMESSAGE,
                    vcode: Utility.generateVcode(),
                });
                return {accNumber:updateSuspicion.accNumber,message:updateSuspicion.message};
            }
            const incrementData = await checkForEntry.increment({attempt:1});
            return {accNumber:incrementData.accNumber};
        }
        const response = await SuspicionRepo.create(data);
        return {accNumber:response.accNumber};
    } catch (error) {
        console.log(error);
        if(error instanceof Error) throw error;
        throw new AppError(['Internal Server Error!'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function clearSuspicion(data){
    try {
        const suspicion = await SuspicionRepo.getByAccountAndType(data.accNumber,data.type);
        if(!suspicion){
            return true;
        }
        if(suspicion.vcode && suspicion.vcode != data.PIN){
            throw new AppError(['Verification Code not matching!'],StatusCodes.BAD_REQUEST);
        }
        const response = await SuspicionRepo.clearSuspicion(data.accNumber,data.type);
        if(!response){
            throw new AppError(['Verification service unavailable, Please try again later!'],StatusCodes.INTERNAL_SERVER_ERROR);
        }
        return response;
    } catch (error) {
        if(error instanceof Error) throw error;
        throw new AppError(['Internal Server Error!'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function checkForSuspicion(accNumber,type){
    try {
        const suspicion = await SuspicionRepo.getByAccountAndType(accNumber,type);
        if(suspicion && suspicion.vcode && suspicion.message) return suspicion;
        return false;
    } catch (error) {
        throw new AppError(['Internal Server Error!'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    create,
    clearSuspicion,
    checkForSuspicion,
}