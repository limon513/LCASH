const Crud = require("./crud-repository");

const {Request, sequelize} = require('../models');
const { Enums, TranVAR } = require("../utils/common");
const AccountRepository = require("./account-repository");
const AccountThroughRepository = require('./account-role-repository');
const serverConfig = require("../config/server-config");

const AccountRepo = new AccountRepository();
const AccountThroughRepo = new AccountThroughRepository();

class RequestRepository extends Crud{
    constructor(){
        super(Request);
    }

    async create(data){
        try {
            const response = await Request.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getById(id){
        try {
            const response = await Request.findByPk(id);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getByAccount(accNumber){
        try {
            const response = await Request.findOne({
                where:{
                    accNumber:accNumber,
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async acceptRequest(data){
        const transaction = await sequelize.transaction();
        try {
            const userUpdate = await AccountRepo.updateUser(data.accNumber,{NID:data.NID,NIDdetails:data.NIDdetails},{transaction:transaction});
            const accountUpdate = await AccountRepo.createAccount({accNumber:data.accNumber},{transaction:transaction});
            const limit = (data.accType === Enums.ACC_TYPE.PERSONAL) ? TranVAR.TV.personalAccountLimit : TranVAR.TV.dailyLimit;
            const accountRoleUpdate = await AccountThroughRepo.create({accNumber:data.accNumber,accType:data.accType,accStatus:Enums.ACC_STATUS.ACTIVE,dailyLimit:limit,remainingLimit:limit});
            const deleteRequest = await Request.destroy({where:{accNumber:data.accNumber}},{transaction:transaction});
            await transaction.commit();
            return {accNumber:data.accNumber,message:serverConfig.ACCEPTREQUEST};
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async rejectRequest(data){
        const transaction = await sequelize.transaction();
        try {
            const deleteRequest = await Request.destroy({where:{accNumber:data.accNumber}},{transaction:transaction});
            await transaction.commit();
            return {accNumber:data.accNumber,message:serverConfig.REJECTREQUEST};
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

}

module.exports = RequestRepository;