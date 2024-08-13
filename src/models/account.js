'use strict';
const {
  Model
} = require('sequelize');
const {Enums} = require('../utils/common');

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Accout_Role_Through,{
        foreignKey:'accNumber',
        sourceKey:'accNumber',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });

      this.hasOne(models.Transfer,{
        foreignKey:'senderAccount',
        sourceKey:'accNumber',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });

      this.hasOne(models.Transfer,{
        foreignKey:'reciverAccount',
        sourceKey:'accNumber',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });

      this.belongsTo(models.User,{
        foreignKey:'accNumber',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
    }
  }
  Account.init({
    accNumber: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
    },
    balance: {
      type:DataTypes.DECIMAL(10,2),
      allowNull:false,
      defaultValue:0,
      validate:{
        min:0,
      },
    },
    version:{
      type:DataTypes.INTEGER,
      defaultValue:0,
    }
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};