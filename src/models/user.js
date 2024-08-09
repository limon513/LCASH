'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Account,{
        foreignKey:'accNumber',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
      this.hasOne(models.Suspicion,{
        foreignKey:'accNumber',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
      this.hasOne(models.Request,{
        foreignKey:'accNumber',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
    }
  }
  User.init({
    userName: {
      type:DataTypes.STRING,
    },
    useEmail:{
      type:DataTypes.STRING,
      unique:true,
      allowNull:true,
      validate:{
        isEmail:true,
      },
    },
    accNumber: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
    },
    PIN: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    NID: {
      type:DataTypes.STRING,
    },
    NIDdetails: {
      type:DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};