const Crud = require("./crud-repository");
const {Account, sequelize, Transfer} = require('../models');
const {Transaction} = require('sequelize');
const {server_config} = require('../config');
const { TranVAR , Utility } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

class TransferRepository extends Crud{
    constructor(){
        super(Transfer);
    }

    async CashOut(data){
        const transaction = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        });
        let retries = 0;
        const amount = parseInt(data.amount);
        const charge = parseFloat((amount * TranVAR.TV.cashoutCharges).toFixed(2));

        const totalAmount = charge + amount;
        const agentCommision = parseFloat((charge * TranVAR.TV.agenGetsOnCashOut).toFixed(2));
        const LcashRevenue = charge - agentCommision;
        const agentGets = amount + agentCommision;

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

                if(sender.balance < totalAmount){
                    throw new AppError(['Insufficient Balance'],StatusCodes.BAD_REQUEST);
                }
                
                await sender.decrement('balance',{
                    by:totalAmount,
                },{transaction:transaction});

                await reciver.increment('balance',{
                    by:agentGets,
                    transaction:transaction,
                },{transaction:transaction});

                await Lcash.increment('balance',{
                    by:LcashRevenue,
                    transaction:transaction,
                },{transaction:transaction});
                //taking some time for manual tesing with axios
                for(let i=0; i<100000000; i++);

                await transaction.commit();

                const response = {message:`${amount}tk Cash out to agent ${reciver.accNumber} is successfull.`,charge: charge,};

                return response;

            } catch (error) {
                if(error instanceof Error) throw error;
                await transaction.rollback();
                //console.log(error);
                retries = retries + 1;
                console.log(`retries = ${retries}`);
                //await new Promise(resolve => setTimeout(resolve, 2 ** retries * 100));
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
}

module.exports = TransferRepository;