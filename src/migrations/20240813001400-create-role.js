'use strict';
/** @type {import('sequelize-cli').Migration} */
const {Enums} = require('../utils/common');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accType: {
        type: Sequelize.ENUM(Enums.ACC_TYPE.PERSONAL,Enums.ACC_TYPE.AGENT,Enums.ACC_TYPE.MARCHENT,Enums.ACC_TYPE.SUPERADMIN),
        unique:true,
        allowNull:false,
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
    await queryInterface.dropTable('Roles');
  }
};