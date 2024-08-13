'use strict';
/** @type {import('sequelize-cli').Migration} */
const {Enums,TranVAR} = require('../utils/common')
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Accout_Role_Throughs', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      accNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      accType: {
        type:Sequelize.ENUM(Enums.ACC_TYPE.PERSONAL,Enums.ACC_TYPE.AGENT,Enums.ACC_TYPE.MARCHENT,Enums.ACC_TYPE.SUPERADMIN),
        allowNull:false,
        defaultValue: Enums.ACC_TYPE.PERSONAL,
      },
      accStatus: {
        type:Sequelize.ENUM(Enums.ACC_STATUS.ACTIVE,Enums.ACC_STATUS.BLOCKED),
        allowNull:false,
        defaultValue: Enums.ACC_STATUS.BLOCKED,
      },
      dailyLimit: {
        type:Sequelize.DECIMAL(10,2),
        allowNull:false,
        defaultValue: TranVAR.TV.dailyLimit,
      },
      remainingLimit: {
        type:Sequelize.DECIMAL(10,2),
        allowNull:false,
        defaultValue: TranVAR.TV.dailyLimit,
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
    await queryInterface.dropTable('Accout_Role_Throughs');
  }
};