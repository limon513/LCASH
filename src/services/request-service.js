const {RequestRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes');
const serverConfig = require('../config/server-config');
const {Utility} = require('../utils/common');
const {Enums} = require('../utils/common');

const RequestRepo = new RequestRepository();

async function create(data){
    try {
        const checkRequest = await RequestRepo.getByAccount(data.accNumber);
        if(checkRequest){
            throw new AppError(['Request Already Pending!'],StatusCodes.BAD_REQUEST);
        }
        const response = await RequestRepo.create(data);
        return response;
    } catch (error) {
        if(error instanceof Error) throw error;
        throw new AppError(['We are Having Some Issues, Please try again later!'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = {
    create,
}