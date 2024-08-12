const {TransferRepository,SuspicionRepository,AccountRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes');
const serverConfig = require('../config/server-config');
const {Utility, Enums} = require('../utils/common');
const AccountService = require('./account-service');
const SuspicionService = require('./suspicion-service');

const TransferRepo = new TransferRepository();
const SuspicionRepo = new SuspicionRepository();
const AccountRepo = new AccountRepository();

async function TransferMoney(data){
    try {
        const transferType = await AccountService.getTransferType(data.senderAccount,data.reciverAccount);
        data.transactionType = transferType;

        const account = await AccountRepo.getByAccount(data.senderAccount);

        if(!Utility.checkPIN(data.PIN,account.PIN)){
            const suspicionResponse = await SuspicionService.create({
                accNumber:data.accNumber,
                type:Enums.SUSPICION.PIN});
            if(suspicionResponse.message){
                await AccountService.updateAccount(data.senderAccount,{accStatus:Enums.ACC_STATUS.BLOCKED});
                throw new AppError([suspicionResponse.message],StatusCodes.UNAUTHORIZED);
            }
            throw new AppError(['Incorrect PIN!'],StatusCodes.BAD_REQUEST);
        }

        const checkForSuspicion = await SuspicionRepo.getByAccountAndType(data.senderAccount,Enums.SUSPICION.PIN);
        if(checkForSuspicion){
            await SuspicionRepo.clearSuspicion(data.senderAccount,Enums.SUSPICION.PIN);
        }

        const response = await TransferRepo.TransferMoney(data);
        //console.log(response);
        let TransferResponse;
        if(response){
            data.status = Enums.TRANSACTION_STATUS.SUCCESSFUL;
            data.charges = response.charge;
            const transgerLog = await TransferRepo.logTransfer(data);
            TransferResponse = Utility.createResponseForTransfer(transgerLog.status,transgerLog.transactionId,transferType,response.amount,response.charge,response.reciverAccount);
        }else{
            data.status = Enums.TRANSACTION_STATUS.FAILED;
            data.charges = response.charge;
            const transgerLog = await TransferRepo.logTransfer(data);
            TransferResponse = Utility.createResponseForTransfer(transgerLog.status,transgerLog.transactionId,transferType,response.amount,response.charge,response.reciverAccount);
        }
        return TransferResponse;
    } catch (error) {
        if(error instanceof Error) throw error;
        throw new AppError(['Service Unavailable!'],StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    TransferMoney,
}