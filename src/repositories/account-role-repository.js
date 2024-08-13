const Crud = require("./crud-repository");

const {Accout_Role_Through,sequelize} = require('../models');
const SuspicionRepository = require('./suspicion-repository');
const { Enums } = require("../utils/common");

const SuspicionRepo = new SuspicionRepository();

class AccountThroughRepository extends Crud{
    constructor(){
        super(Accout_Role_Through);
    }

    async create(data){
        try {
            const response = await Accout_Role_Through.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getByAccount(accNumber){
        try {
            const response = await Accout_Role_Through.findOne({
                attributes:{ exclude : ['id'] },
                where:{
                    accNumber:accNumber,
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateAccountThroug(accNumber,data){
        try {
            const response = await Accout_Role_Through.update(data,{
                where:{
                    accNumber:accNumber,
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async resetTransferLimit(){
        try {
            const response = await sequelize.query('UPDATE Accout_Role_Throughs set remainingLimit = dailyLimit');
            return response;   
        } catch (error) {
            throw error;
        }
    }

    async unblockAccout(accNumber){
        const transaction = await sequelize.transaction();
        try {
            const suspicion = await SuspicionRepo.clearSuspicion(accNumber,Enums.SUSPICION.PIN,{transaction:transaction});
            const account = await this.updateAccountThroug(accNumber,{accStatus:Enums.ACC_STATUS.ACTIVE},{transaction:transaction});
            transaction.commit();
            return {accNumber:accNumber,message:'Account Unblocked!'};
        } catch (error) {
            transaction.rollback();
            throw error;
        }
    }

}

module.exports = AccountThroughRepository;