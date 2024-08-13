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
    await queryInterface.addConstraint('Accout_Role_Throughs',{
      fields:['accNumber'],
      type:'foreign key',
      name:'account-role-accnumber-constraint',
      references:{
        table:'Accounts',
        field:'accNumber',
      },
      onDelete:'CASCADE',
      onUpdate:'CASCADE',
    });

    await queryInterface.addConstraint('Accout_Role_Throughs',{
      fields:['accType'],
      type:'foreign key',
      name:'account-role-role-constraint',
      references:{
        table:'Roles',
        field:'accType',
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
    await queryInterface.removeConstraint('Accout_Role_Throughs','account-role-accnumber-constraint');
    await queryInterface.removeConstraint('Accout_Role_Throughs','account-role-role-constraint');    
  }
};
