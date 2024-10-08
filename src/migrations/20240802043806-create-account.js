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