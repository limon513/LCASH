'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint('Accounts',{
      fields:['accNumber'],
      type:'foreign key',
      name:'accoun-user-constraint',
      references:{
        table:'Users',
        field:'accNumber',
      },
      onDelete:'CASCADE',
      onUpdate:'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('Accounts','accoun-user-constraint');
  }
};
