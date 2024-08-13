const {RequestRepository, AccountRepository,AccountThroughRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes');
const serverConfig = require('../config/server-config');
const {Utility} = require('../utils/common');
const {Enums} = require('../utils/common');

const RequestRepo = new RequestRepository();
const AccountRepo = new AccountRepository();
const AccountThroughRepo = new AccountThroughRepository();

async function create(data){
    try {
        const checkRequest = await RequestRepo.getByAccount(data.accNumber);
        if(checkRequest){
            throw new AppError(['Request Already Pending!'],StatusCodes.BAD_REQUEST);
        }
        const checkAlreadyResolved = await AccountThroughRepo.getByAccount(data.accNumber);
        if(checkAlreadyResolved){
            throw new AppError(['Account Already Resolved'],StatusCodes.BAD_REQUEST);
        }
        const checkRegisteredNID = await AccountRepo.getByNID(data.NID);
        if(checkRegisteredNID && checkRegisteredNID.NID && checkRegisteredNID.NID === data.NID){
            throw new AppError(['One account already registered with this NID, please use that account'],StatusCodes.BAD_REQUEST);
        }
        const response = await RequestRepo.create(data);
        return response;
    } catch (error) {
        if(error instanceof Error) throw error;
        throw new AppError(['We are Having Some Issues, Please try again later!'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function resolveRequest(id,resolve){
    try {
        const account = await RequestRepo.getById(+id);
        if(!account) throw new AppError(['Request Not found'],StatusCodes.NOT_FOUND);
        let response;
        if(+resolve == 1){
            response = await RequestRepo.acceptRequest(account);
        }
        if(+resolve == 2){
            response = await RequestRepo.rejectRequest(account);
        }
        return response;
    } catch (error) {
        // console.log(error);
        if(error instanceof Error) throw error;
        throw new AppError(['We are Having Some Issues, Please try again later!'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function resetTransferLimit(){
        try {
            return await AccountThroughRepo.resetTransferLimit();
        } catch (error) {
            return false;
        }
    }

module.exports = {
    create,
    resolveRequest,
    resetTransferLimit,
}