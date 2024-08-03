'use strict';
/** @type {import('sequelize-cli').Migration} */
const {Enums} = require('../utils/common');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accNumber: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true,
      },
      accType: {
        type: Sequelize.ENUM(Enums.ACC_TYPE.PERSONAL,Enums.ACC_TYPE.MARCHENT,Enums.ACC_TYPE.SUPERADMIN),
        allowNull:false,
        defaultValue: Enums.ACC_TYPE.PERSONAL,
      },
      accStatus: {
        type: Sequelize.ENUM(Enums.ACC_STATUS.ACTIVE,Enums.ACC_STATUS.PENDING,Enums.ACC_STATUS.BLOCKED),
        allowNull:false,
        defaultValue: Enums.ACC_STATUS.PENDING,
      },
      balance: {
        type:Sequelize.DECIMAL(10,2),
        allowNull:false,
        defaultValue:0,
        validate:{
          min:0,
        },
      },
      version:{
        type:Sequelize.INTEGER,
        defaultValue:0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Accounts');
  }
};