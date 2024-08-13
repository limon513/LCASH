'use strict';
const {
  Model
} = require('sequelize');
const {Enums} = require('../utils/common');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Accout_Role_Through,{
        foreignKey:'accType',
        sourceKey:'accType',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
      });
    }
  }
  Role.init({
    accType: {
      type:DataTypes.ENUM(Enums.ACC_TYPE.PERSONAL,Enums.ACC_TYPE.AGENT,Enums.ACC_TYPE.MARCHENT,Enums.ACC_TYPE.SUPERADMIN),
      allowNull:false,
      unique:true,
      defaultValue: Enums.ACC_TYPE.PERSONAL,
    }
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};