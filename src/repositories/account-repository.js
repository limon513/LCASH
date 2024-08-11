const Crud = require("./crud-repository");

const {User,Account, sequelize} = require('../models');
const SuspicionRepository = require('./suspicion-repository');
const { Enums } = require("../utils/common");

const SuspicionRepo = new SuspicionRepository();

class AccountRepository extends Crud{
    constructor(){
        super(User);
    }

    async create(data){
        try {
            const response = await User.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getByAccount(accNumber){
        try {
            const response = await User.findOne({
                where:{
                    accNumber:accNumber,
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getByNID(NID){
        try {
            const response = await User.findOne({
                where:{
                    NID:NID,
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getFromAccount(accNumber){
        try {
            const response = await Account.findOne({
                where:{
                    accNumber:accNumber,
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(accNumber,data){
        try {
            const response = await User.update(data,{
                where:{
                    accNumber:accNumber,
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async createAccount(data){
        try {
            const response = await Account.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateAccount(accNumber,data){
        try {
            const response = await Account.update(data,{
                where:{
                    accNumber:accNumber,
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async unblockAccout(accNumber){
        const transaction = await sequelize.transaction();
        try {
            const suspicion = await SuspicionRepo.clearSuspicion(accNumber,Enums.SUSPICION.PIN,{transaction:transaction});
            const account = await this.updateAccount(accNumber,{accStatus:Enums.ACC_STATUS.ACTIVE},{transaction:transaction});
            transaction.commit();
            return {accNumber:accNumber,message:'Account Unblocked!'};
        } catch (error) {
            transaction.rollback();
            throw error;
        }
    }

}

module.exports = AccountRepository;