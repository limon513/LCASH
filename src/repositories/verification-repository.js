const Crud = require("./crud-repository");

const {Verification, sequelize} = require('../models');
const { Enums } = require("../utils/common");

class VerificationRepository extends Crud{
    constructor(){
        super(Verification);
    }

    async generateCode(data){
        try {
            const checkcode = await Verification.findOne({
                where:{
                    accNumber:data.accNumber,
                }
            });
            let response;
            if(checkcode) response = await this.updateCode(data.accNumber,data);
            else response = await Verification.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateCode(accNumber,data){
        try {
            const response = await Verification.update(data,{
                where : {
                    accNumber:accNumber,
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getCode(accNumber){
        try {
            const response = await Verification.findOne({
                where:{
                    accNumber:accNumber,
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async clearSuspicion(accNumber,type){
        const transaction = await sequelize.transaction();
        try {
            const response = await Verification.destroy({
                where: {
                    accNumber:accNumber,
                },
            },
            {
                transaction:transaction
            });
            await transaction.commit();
            return response;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    

}

module.exports = VerificationRepository;