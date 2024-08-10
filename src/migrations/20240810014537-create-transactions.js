'use strict';
/** @type {import('sequelize-cli').Migration} */
const {Enums} = require('../utils/common');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      transactionId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      senderAccount: {
        type: Sequelize.STRING,
        allowNull:false,
        references:{
          model:'Accounts',
          key:'accNumber',
        }
      },
      reciverAccount: {
        type: Sequelize.STRING,
        allowNull:false,
        references:{
          model:'Accounts',
          key:'accNumber',
        }
      },
      transactionType: {
        type: Sequelize.ENUM(Enums.TRANSACTION_TYPE.CASHIN,Enums.TRANSACTION_TYPE.CASHOUT,Enums.TRANSACTION_TYPE.SENDMONEY,Enums.TRANSACTION_TYPE.PAYMENT,Enums.TRANSACTION_TYPE.LEND),
        allowNull:false,
      },
      amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull:false,
      },
      charges: {
        type: Sequelize.DECIMAL(10,2),
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
    await queryInterface.addIndex('Accounts',['accNumber'],{
      unique:true,
      indexName:'accNumberIndex',
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
    await queryInterface.removeIndex('Accounts','accNumberIndex');
  }
};