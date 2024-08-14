const Crud = require("./crud-repository");
const {Account, sequelize, Transfer,Accout_Role_Through} = require('../models');
const {Transaction, where} = require('sequelize');
const {server_config} = require('../config');
const { TranVAR , Utility, Enums } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");


class TransferRepository extends Crud{
    constructor(){
        super(Transfer);
    }

    async TransferMoney(data){
        const transaction = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        });
        let retries = 0;

        const senderAccountInfo = await Accout_Role_Through.findOne({
            where:{
                accNumber:data.senderAccount,
            }
        },{transaction:transaction});

        if(senderAccountInfo.dailyLimit != TranVAR.TV.dailyLimit && senderAccountInfo.remainingLimit < data.actualAmount){
            throw new AppError([`Your Todays Limit excceded! you can transfer only ${senderAccountInfo.remainingLimit}tk for today.`],StatusCodes.BAD_REQUEST);
        }

        const Lcash = await Account.findOne({
            where:{
                accNumber: TranVAR.TV.LcashAccount,
            }
        });

        while(retries < TranVAR.TV.maxRetriesOnFailedTransactions){
            try {
                const sender = await Account.findOne({
                    where:{
                        accNumber:data.senderAccount,
                    },
                },{transaction:transaction});

                const reciver = await Account.findOne({
                    where:{
                        accNumber:data.reciverAccount,
                    },
                },{transaction:transaction});

                if(sender.balance < data.userLose){
                    throw new AppError(['Insufficient Balance'],StatusCodes.BAD_REQUEST);
                }
                
                await sender.decrement('balance',{
                    by:data.userLose,
                },{transaction:transaction});

                await reciver.increment('balance',{
                    by:data.reciverGets,
                },{transaction:transaction});

                if(senderAccountInfo.dailyLimit != TranVAR.TV.dailyLimit)
                    await senderAccountInfo.decrement('remainingLimit',{
                        by:parseInt(data.actualAmount),
                    },{transaction:transaction});

                if(data.LcashGets){
                    await Lcash.increment('balance',{
                        by:data.LcashGets,
                    },{transaction:transaction});
                }

                //taking some time for manual tesing with axios
                for(let i=0; i<100000000; i++);

                await transaction.commit();

                const response = {reciverAccount:data.reciverAccount,
                                    amount:data.actualAmount,
                                    charge:data.charge,
                                };
                return response;

            } catch (error) {
                if(error instanceof Error) throw error;
                await transaction.rollback();
                //console.log(error);
                retries = retries + 1;
                console.log(`retries = ${retries}`);
                await new Promise(resolve => setTimeout(resolve, 2 ** retries * 100)); //exponential backoff on every retries;
                continue;
            }
        }
        throw new AppError(['Transaction failed after multiple retries,Please try again later!'],StatusCodes.REQUEST_TIMEOUT);
    }

    async logTransfer(data){
        try {
            const response = await Transfer.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getTransactions(data){
        try {
            const response = await Transfer.findAll({
                attributes:{ exclude : ['senderAccount','updatedAt','status'] },
                where:{
                    senderAccount:data.accNumber,
                    status:Enums.TRANSACTION_STATUS.SUCCESSFUL,
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = TransferRepository;