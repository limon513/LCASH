'use strict';

/** @type {import('sequelize-cli').Migration} */
const {Enums} = require('../utils/common');
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Roles',[
    {
      accType:Enums.ACC_TYPE.PERSONAL,
      createdAt:new Date(),
      updatedAt:new Date(),
    },
    {
      accType:Enums.ACC_TYPE.AGENT,
      createdAt:new Date(),
      updatedAt:new Date(),
    },
    {
      accType:Enums.ACC_TYPE.MARCHENT,
      createdAt:new Date(),
      updatedAt:new Date(),
    },
    {
      accType:Enums.ACC_TYPE.SUPERADMIN,
      createdAt:new Date(),
      updatedAt:new Date(),
    }
   ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
