'use strict';

const Database = use('Database');
const Factory = use('Factory');

class RoleUserSeeder {
  async run() {
    try {
      const customer = await Database.raw(`
        INSERT INTO freshgear.role_user (role_id, user_id)
        Values(1,1)
      `);
    } catch (error) {
      console.log(error);
    }
    try {
      const customer = await Database.raw(`
        INSERT INTO freshgear.role_user (role_id, user_id)
        Values(1,2)
      `);
    } catch (error) {
      console.log(error);
    }
    try {
      const customer = await Database.raw(`
        INSERT INTO freshgear.role_user (role_id, user_id)
        Values(1,3)
      `);
    } catch (error) {
      console.log(error);
    }
    try {
      const customer = await Database.raw(`
        INSERT INTO freshgear.role_user (role_id, user_id)
        Values(2,4)
      `);
    } catch (error) {
      console.log(error);
    }
    try {
      const customer = await Database.raw(`
        INSERT INTO freshgear.role_user (role_id, user_id)
        Values(3,5)
      `);
    } catch (error) {
      console.log(error);
    }
    console.log(`added roles to 5 users on Role_User Table`);
  }
}

module.exports = RoleUserSeeder;
