'use strict';
/** @type {import('sequelize-cli').Migration} */
const {Enums} = require('../utils/common');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Suspicions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accNumber: {
        type: Sequelize.STRING,
        allowNull:false,
        references:{
          model: 'Users',
          key:'accNumber',
        },
      },
      type: {
        type: Sequelize.ENUM(Enums.SUSPICION.LOGIN,Enums.SUSPICION.PIN),
        allowNull:false,
        defaultValue: Enums.SUSPICION.LOGIN,
      },
      attempt: {
        type: Sequelize.INTEGER,
        defaultValue:0,
        allowNull:false,
      },
      vcode: {
        type: Sequelize.STRING,
      },
      message: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Suspicions');
  }
};