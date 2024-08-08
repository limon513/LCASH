const Crud = require("./crud-repository");

const {Request, sequelize} = require('../models');
const { Enums } = require("../utils/common");
const AccountRepository = require("./account-repository");
const serverConfig = require("../config/server-config");

const AccountRepo = new AccountRepository();

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
            const accountUpdate = await AccountRepo.createAccount({accNumber:data.accNumber,accType:data.accType,accStatus:Enums.ACC_STATUS.ACTIVE},{transaction:transaction});
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