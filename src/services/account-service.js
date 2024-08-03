const {AccountRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcrypt');
const serverConfig = require('../config/server-config');
const {Utility} = require('../utils/common');

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
        if(!Utility.checkPIN(data.PIN,chechAccountNumber.PIN)){
            throw new AppError(['Incorrect PIN!'],StatusCodes.BAD_REQUEST);
        }
        const jwt = Utility.createToken({number:data.accNumber});
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

module.exports = {
    create,
    signIn,
}