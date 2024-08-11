const {TransferRepository,SuspicionRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes');
const serverConfig = require('../config/server-config');
const {Utility, Enums} = require('../utils/common');
const AccountService = require('./account-service');

const TransferRepo = new TransferRepository();
const SuspicionRepo = new SuspicionRepository();

async function CashOut(data){
    try {
        const transferType = await AccountService.getTransferType(data.senderAccount,data.reciverAccount);
        data.transactionType = transferType;
        
        const response = await TransferRepo.CashOut(data);
        console.log(response);
        if(response){
            data.status = Enums.TRANSACTION_STATUS.SUCCESSFUL;
            data.charges = response.charge;
            await TransferRepo.logTransfer(data);
        }else{
            data.status = Enums.TRANSACTION_STATUS.FAILED;
            data.charges = 0;
        }
        return response;
    } catch (error) {
        if(error instanceof Error) throw error;
        throw new AppError(['Service Unavailable!'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    CashOut,
}