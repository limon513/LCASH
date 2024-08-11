'use strict';
const {
  Model
} = require('sequelize');
const {Enums} = require('../utils/common');
module.exports = (sequelize, DataTypes) => {
  class Transfer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Account,{
        foreignKey:'senderAccount',
        targetKey:'accNumber',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
      this.belongsTo(models.Account,{
        foreignKey:'reciverAccount',
        targetKey:'accNumber',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
    }
  }
  Transfer.init({
    TransferId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    senderAccount: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    reciverAccount: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    TransferType: {
      type: DataTypes.ENUM(Enums.Transfer_TYPE.CASHIN,Enums.Transfer_TYPE.CASHOUT,Enums.Transfer_TYPE.SENDMONEY,Enums.Transfer_TYPE.PAYMENT,Enums.Transfer_TYPE.LEND),
      allowNull:false,
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull:false,
    },
    charges: {
      type: DataTypes.DECIMAL(10,2),
      allowNull:false,
    },
    status:{
      type:DataTypes.ENUM(Enums.Transfer_STATUS.SUCCESSFUL,Enums.Transfer_STATUS.FAILED),
      allowNull:false,
    },
  }, {
    sequelize,
    modelName: 'Transfer',
  });
  return Transfer;
};