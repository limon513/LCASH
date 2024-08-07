const Crud = require("./crud-repository");

const {Request} = require('../models');
const { Enums } = require("../utils/common");

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

}

module.exports = RequestRepository;