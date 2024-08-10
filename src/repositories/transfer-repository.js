const Crud = require("./crud-repository");
const {Account, sequelize} = require('../models')
const {Transaction} = require('sequelize')

class Transfer extends Crud{
    constructor(){
        super(Transaction);
    }

    async moneyTransfer(data){
        const transaction = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        });
        try {
            const sender = await Account.findOne({
                where:{
                    accNumber:data.senderAccount
                }
            });
            const reciver = await Account.findOne({
                where:{
                    accNumber:reciverAccount
                }
            });

            

        } catch (error) {
            
        }
    }

}