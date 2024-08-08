const {AccountRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcrypt');
const serverConfig = require('../config/server-config');
const {Utility} = require('../utils/common');
const SuspicionService = require('./suspicion-service');
const {Enums} = require('../utils/common');

const AccountRepo = new AccountRepository();

async function create(data){
    try {
        const checkforAccount = await AccountRepo.getByAccount(data.accNumber);
        if(checkforAccount){
            throw new AppError(['Account already exists! Login insteed.'],StatusCodes.BAD_REQUEST);
        }
        data.PIN = Utility.hashThePassword(data.PIN);
        console.log('inside service');
        console.log(data.PIN);
        const user = await AccountRepo.create(data);
        return user;
    } catch (error) {
        console.log(error);
        if(error instanceof Error) throw error;
        throw new AppError(['Internal Server Error!'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signIn(data){
    try {
        const chechAccountNumber = await AccountRepo.getByAccount(data.accNumber);
        if(!chechAccountNumber){
            throw new AppError(['Wrong Account Number!'],StatusCodes.BAD_REQUEST);
        }
        const checkForSuspicion = await SuspicionService.checkForSuspicion(data.accNumber);
        if(checkForSuspicion){
            throw new AppError([checkForSuspicion.message],StatusCodes.UNAUTHORIZED);
        }
        if(!Utility.checkPIN(data.PIN,chechAccountNumber.PIN)){
            const suspicionResponse = await SuspicionService.create({
                accNumber:data.accNumber,
                type:Enums.SUSPICION.LOGIN});
            if(suspicionResponse.message){
                throw new AppError([suspicionResponse.message],StatusCodes.UNAUTHORIZED);
            }
            throw new AppError(['Incorrect PIN!'],StatusCodes.BAD_REQUEST);
        }
        const jwt = Utility.createToken({accNumber:data.accNumber});
        const response = {
            accNumber:data.accNumber,
            token:jwt,
        }
        await SuspicionService.clearSuspicion(data);
        return response;
    } catch (error) {
        if(error instanceof Error) throw error;
        throw new AppError(['Internal Server Error,Please Try again Somethime'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports = {
    create,
    signIn,
}