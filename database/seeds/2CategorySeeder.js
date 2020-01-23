'use strict';

const Database = use('Database');
const Factory = use('Factory');

class CategorySeeder {
  async run() {
    try {
      const category1 = await Database.raw(`
        INSERT INTO freshgear.categories (title)
        Values("Male")
      `);
      console.log(`added Male to Categories Table`);
    } catch (error) {
      console.log(error);
    }
    try {
      const category2 = await Database.raw(`
        INSERT INTO freshgear.categories (title)
        Values("Female")
      `);
      console.log(`added Female to Categories Table`);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = CategorySeeder;
