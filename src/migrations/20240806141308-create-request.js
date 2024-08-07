'use strict';
/** @type {import('sequelize-cli').Migration} */
const {Enums} = require('../utils/common')
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Requests', {
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
        references:{
          model: 'Users',
          key:'accNumber',
        },
      },
      accType: {
        type: Sequelize.ENUM(Enums.ACC_TYPE.PERSONAL,Enums.ACC_TYPE.MARCHENT,Enums.ACC_TYPE.SUPERADMIN),
        allowNull:false,
        defaultValue: Enums.ACC_TYPE.PERSONAL,
      },
      NID: {
        type: Sequelize.STRING
      },
      NIDdetails: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Requests');
  }
};