'use strict';
const {
  Model
} = require('sequelize');
const {Enums, TranVAR} = require('../utils/common');
module.exports = (sequelize, DataTypes) => {
  class Accout_Role_Through extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Account,{
        foreignKey:'accNumber',
        targetKey:'accNumber',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
      this.belongsTo(models.Role,{
        foreignKey:'accType',
        targetKey:'accType',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
    }
  }
  Accout_Role_Through.init({
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
    accStatus: {
      type:DataTypes.ENUM(Enums.ACC_STATUS.ACTIVE,Enums.ACC_STATUS.BLOCKED),
      allowNull:false,
      defaultValue: Enums.ACC_STATUS.BLOCKED,
    },
    dailyLimit: {
      type:DataTypes.DECIMAL(10,2),
      allowNull:false,
      defaultValue: TranVAR.TV.dailyLimit,
    },
    remainingLimit: {
      type:DataTypes.DECIMAL(10,2),
      allowNull:false,
      defaultValue: TranVAR.TV.dailyLimit,
    }
  }, {
    sequelize,
    modelName: 'Accout_Role_Through',
  });
  return Accout_Role_Through;
};