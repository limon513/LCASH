'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userName: {
        type: Sequelize.STRING,
      },
      useEmail:{
        type:Sequelize.STRING,
        allowNull:true,
        validate:{
          isEmail:true,
        },
      },
      accNumber: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true,
      },
      PIN: {
        type: Sequelize.STRING,
        allowNull:false,
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
    await queryInterface.dropTable('Users');
  }
};