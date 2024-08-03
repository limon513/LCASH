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

module.exports = {
    create,
}