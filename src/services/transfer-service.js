const {TransferRepository,SuspicionRepository,AccountRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes');
const serverConfig = require('../config/server-config');
const {Utility, Enums, TranVAR} = require('../utils/common');
const AccountService = require('./account-service');
const SuspicionService = require('./suspicion-service');

const TransferRepo = new TransferRepository();
const SuspicionRepo = new SuspicionRepository();
const AccountRepo = new AccountRepository();

async function cashOut(data){
    let userLoseMoney = parseInt(data.amount);
    data.actualAmount = userLoseMoney;
    const charge = Utility.calculateChargesOnTransfer(data.transactionType,userLoseMoney);
    data.charge = charge;
    userLoseMoney += charge;
    data.userLose = userLoseMoney;
    const reciverGetsMoney = data.actualAmount + parseFloat((charge * TranVAR.TV.agenGetsOnCashOut).toFixed(2));
    data.reciverGets = reciverGetsMoney;
    const LcashGetsMoney = userLoseMoney - reciverGetsMoney;
    data.LcashGets = LcashGetsMoney;

    try {
        return await TransferRepo.TransferMoney(data);
    } catch (error) {
        throw error;
    }
}

async function cashIn(data){
    let userLoseMoney = parseInt(data.amount);
    data.actualAmount = userLoseMoney;
    const charge = Utility.calculateChargesOnTransfer(data.transactionType,userLoseMoney);
    data.charge = charge;
    userLoseMoney += charge;
    data.userLose = userLoseMoney;
    const reciverGetsMoney = data.actualAmount + charge
    data.reciverGets = reciverGetsMoney;
    const LcashGetsMoney = userLoseMoney - reciverGetsMoney;
    data.LcashGets = LcashGetsMoney;

    try {
        return await TransferRepo.TransferMoney(data);
    } catch (error) {
        throw error;
    }
}

async function sendMoney(data){
    let userLoseMoney = parseInt(data.amount);
    data.actualAmount = userLoseMoney;
    const charge = Utility.calculateChargesOnTransfer(data.transactionType,userLoseMoney);
    data.charge = charge;
    userLoseMoney += charge;
    data.userLose = userLoseMoney;
    const reciverGetsMoney = data.actualAmount;
    data.reciverGets = reciverGetsMoney;
    const LcashGetsMoney = userLoseMoney - reciverGetsMoney;
    data.LcashGets = LcashGetsMoney;

    try {
        return await TransferRepo.TransferMoney(data);
    } catch (error) {
        throw error;
    }
}

async function payment(data){
    let userLoseMoney = parseInt(data.amount);
    data.actualAmount = userLoseMoney;
    const charge = Utility.calculateChargesOnTransfer(data.transactionType,userLoseMoney);
    data.charge = charge;
    data.userLose = userLoseMoney;
    const reciverGetsMoney = data.actualAmount - charge;
    data.reciverGets = reciverGetsMoney;
    const LcashGetsMoney = charge;
    data.LcashGets = LcashGetsMoney;

    try {
        return await TransferRepo.TransferMoney(data);
    } catch (error) {
        throw error;
    }
}

async function TransferMoney(data){
    try {
        const account = await AccountRepo.getByAccount(data.senderAccount);

        if(data.PIN && !Utility.checkPIN(data.PIN,account.PIN)){
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

        if(data.senderAccount === data.reciverAccount){
            throw new AppError(['You can not transfer to you!'],StatusCodes.BAD_REQUEST);
        }

        let response;

        const transferType = data.transactionType;

        if(transferType === Enums.TRANSACTION_TYPE.CASHOUT){
            response = await cashOut(data);
        }
        
        if(transferType === Enums.TRANSACTION_TYPE.CASHIN){
            response = await cashIn(data);
        }

        if(transferType === Enums.TRANSACTION_TYPE.SENDMONEY){
            response = await sendMoney(data);
        }

        if(transferType === Enums.TRANSACTION_TYPE.PAYMENT){
            response = await payment(data);
        }

        let TransferResponse;
        if(response){
            data.status = Enums.TRANSACTION_STATUS.SUCCESSFUL;
            data.charges = response.charge;
            const senderDetails = await AccountRepo.getByAccount(data.senderAccount);
            const reciverDetails = await AccountRepo.getByAccount(data.reciverAccount);
            data.senderEmail = senderDetails.useEmail;
            data.reciverEmail = reciverDetails.useEmail;
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

async function getTransactions(data){
    try {
        const response = await TransferRepo.getTransactions(data);
        if(!response){
            throw new AppError(['No transactions found'],StatusCodes.NOT_FOUND);
        }
        return response;
    } catch (error) {
        if(error instanceof Error) throw error;
        throw new AppError(['Service unavailable'].StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getPendingNotifiedTransactions(notified){
    try {
        const transfers = await TransferRepo.getPendingNotifiedTransactions(notified);
        return transfers;
    } catch (error) {
        throw error;
    }
}

async function resolveTransferOnNotification(id){
    try {
        const resolve = await TransferRepo.resolveTransferOnNotification(id,{notified:Enums.NOTIFIED_STATUS.SUCCESSFUL});
        return resolve;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    TransferMoney,
    getTransactions,
    getPendingNotifiedTransactions,
    resolveTransferOnNotification,
}