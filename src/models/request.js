'use strict';
const {
  Model
} = require('sequelize');
const {Enums} = require('../utils/common')
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User,{
        foreignKey:'accNumber',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
    }
  }
  Request.init({
    accNumber: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
    },
    accType: {
      type:DataTypes.ENUM(Enums.ACC_TYPE.PERSONAL,Enums.ACC_TYPE.AGENT,Enums.ACC_TYPE.MARCHENT,Enums.ACC_TYPE.SUPERADMIN),
      allowNull:false,
      defaultValue: Enums.ACC_TYPE.PERSONAL,
    },
    NID: {
      type:DataTypes.STRING,
    },
    NIDdetails: {
      type:DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Request',
  });
  return Request;
};