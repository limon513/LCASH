class Crud{
    constructor(model){
        this.model = model;
    }

    async create(data){
        return await this.model.create(data);
    }
}

module.exports = Crud;