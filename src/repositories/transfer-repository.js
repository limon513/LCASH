const Crud = require("./crud-repository");
const {Account, sequelize} = require('../models');
const {Transaction} = require('sequelize');
const {server_config} = require('../config');
const { TranVAR , Utility } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

class TransferRepository extends Crud{
    constructor(){
        super(Transaction);
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
                });

                const reciver = await Account.findOne({
                    where:{
                        accNumber:data.reciverAccount,
                    },
                });

                if(sender.balance >= totalAmount){
                    await sender.decrement('balance',{
                        by:totalAmount,
                        transaction:transaction,
                    });

                    await reciver.increment('balance',{
                        by:agentGets,
                        transaction:transaction,
                    });

                    await Lcash.increment('balance',{
                        by:LcashRevenue,
                        transaction:transaction,
                    });

                }else{
                    throw new AppError(['Insufficient Balance'],StatusCodes.BAD_REQUEST);
                }

                await transaction.commit();
                return {message:`${amount}tk Cash out to agent ${reciver.accNumber} is successfull.New balance is ${sender.balance-totalAmount}tk`};

            } catch (error) {
                await transaction.rollback();
                if(error instanceof Error) throw error;
                console.log(error);
                retries = retries + 1;
                await new Promise(resolve => setTimeout(resolve, 2 ** retries * 100));
                continue;
            }
        }
        throw new AppError(['Transaction failed after multiple retries,Please try again later!'],StatusCodes.REQUEST_TIMEOUT);
    }

    async logTransaction(data){
        try {
            
        } catch (error) {
            
        }
    }
}

module.exports = TransferRepository;