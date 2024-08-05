'use strict';
const {
  Model
} = require('sequelize');
const {Enums} = require('../utils/common');

module.exports = (sequelize, DataTypes) => {
  class Suspicion extends Model {
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
  Suspicion.init({
    accNumber: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    type: {
      type:DataTypes.ENUM(Enums.SUSPICION.LOGIN,Enums.SUSPICION.PIN),
      allowNull:false,
      defaultValue: Enums.SUSPICION.LOGIN,
    },
    attempt: {
      type:DataTypes.INTEGER,
      defaultValue:0,
      allowNull:false,
    },
    vcode: {
      type:DataTypes.INTEGER,
    },
    message:{
      type:DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Suspicion',
  });
  return Suspicion;
};