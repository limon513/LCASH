const {AccountRepository,AccountThroughRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcrypt');
const serverConfig = require('../config/server-config');
const {Utility} = require('../utils/common');
const SuspicionService = require('./suspicion-service');
const {Enums} = require('../utils/common');

const AccountRepo = new AccountRepository();
const AccountThroughRepo = new AccountThroughRepository();

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
        const checkForSuspicion = await SuspicionService.checkForSuspicion(data.accNumber,Enums.SUSPICION.LOGIN);
        if(checkForSuspicion && checkForSuspicion.message){
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
        const jwt = Utility.createToken({accNumber:data.accNumber},serverConfig.JWTEXPIRY);
        data.type = Enums.SUSPICION.LOGIN;
        const clear = await SuspicionService.clearSuspicion(data);
        const response = {
            accNumber:data.accNumber,
            token:jwt,
        }
        return response;
    } catch (error) {
        if(error instanceof Error) throw error;
        throw new AppError(['Internal Server Error,Please Try again Somethime'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getTransferType(senderAccount,reciverAccount){
    try {
        const sender = await AccountThroughRepo.getByAccount(senderAccount);
        const reciver = await AccountThroughRepo.getByAccount(reciverAccount);
        if(sender.accType === Enums.ACC_TYPE.PERSONAL &&
            reciver.accType === Enums.ACC_TYPE.AGENT
        ){
            return Enums.TRANSACTION_TYPE.CASHOUT;
        }
        if(sender.accType == Enums.ACC_TYPE.PERSONAL &&
            reciver.accType == Enums.ACC_TYPE.PERSONAL
        ){
            return Enums.TRANSACTION_TYPE.SENDMONEY;
        }
        if(sender.accType == Enums.ACC_TYPE.AGENT &&
            reciver.accType == Enums.ACC_TYPE.PERSONAL
        ){
            return Enums.TRANSACTION_TYPE.CASHIN;
        }
        if(sender.accType == Enums.ACC_TYPE.PERSONAL &&
            reciver.accType == Enums.ACC_TYPE.MARCHENT
        ){
            return Enums.TRANSACTION_TYPE.PAYMENT;
        }
    } catch (error) {
        throw new AppError(['Service Unavailable!'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateAccount(accNumber,data){
    try {
        const response = await AccountThroughRepo.updateAccountThroug(accNumber,data);
        return response;
    } catch (error) {
        if(error instanceof Error) throw error;
        throw new AppError(['Service Unavailable!'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAccountDetails(accNumber){
    try {
        const account = await AccountThroughRepo.getByAccount(accNumber);
        if(!account){
            throw new AppError(['Account Not Found!'],StatusCodes.NOT_FOUND);
        }
        return account;
    } catch (error) {
        if(error instanceof Error) throw error;
        throw new AppError(['Service unavailable'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function unblockAccount(accNumber){
    try {
        const checkAccount = await AccountThroughRepo.getByAccount(accNumber);
        if(!checkAccount) throw new AppError(['Account Number not correct!'],StatusCodes.NOT_FOUND);
        if(checkAccount && checkAccount.accStatus !== Enums.ACC_STATUS.BLOCKED) throw new AppError(['Account already active'],StatusCodes.BAD_REQUEST);
        const account = await AccountThroughRepo.unblockAccout(accNumber);
        return account;
    } catch (error) {
        if(error instanceof Error) throw error;
        throw new AppError(['Service unavailable'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    create,
    signIn,
    getTransferType,
    updateAccount,
    getAccountDetails,
    unblockAccount,
}