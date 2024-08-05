const Crud = require("./crud-repository");

const {Suspicion, sequelize} = require('../models');
const { Enums } = require("../utils/common");

class SuspicionRepository extends Crud{
    constructor(){
        super(Suspicion);
    }

    async create(data){
        try {
            const response = await Suspicion.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async update(accNumber,type,data){
        try {
            const response = await Suspicion.update(data,{
                where : {
                    accNumber:accNumber,
                    type:type,
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getByAccountAndType(accNumber,type){
        try {
            const response = await Suspicion.findOne({
                where:{
                    accNumber:accNumber,
                    type:type,
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
            const response = await Suspicion.destroy({
                where: {
                    accNumber:accNumber,
                    type:type,
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

module.exports = SuspicionRepository;