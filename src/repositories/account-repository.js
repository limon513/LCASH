const Crud = require("./crud-repository");

const {User,Account} = require('../models');

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

    

}

module.exports = AccountRepository;