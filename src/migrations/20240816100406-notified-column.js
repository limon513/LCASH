'use strict';

const { DataTypes } = require('sequelize');
const { Enums } = require('../utils/common');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Transfers','senderEmail',{
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Transfers','reciverEmail',{
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Transfers','notified',{
      type: Sequelize.ENUM(Enums.NOTIFIED_STATUS.SUCCESSFUL,Enums.NOTIFIED_STATUS.FAILED,Enums.NOTIFIED_STATUS.PENDING),
      defaultValue: Enums.NOTIFIED_STATUS.PENDING,
      allowNull:false,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Transfers','senderEmail');
    await queryInterface.removeColumn('Transfers','reciverEmail');
    await queryInterface.removeColumn('Transfers','notified');
  }
};
