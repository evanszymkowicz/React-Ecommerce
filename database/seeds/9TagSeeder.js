'use strict';

const Database = use('Database');
const Factory = use('Factory');

class TagSeeder {
  async run() {
    try {
      const tag = await Database.raw(`
        INSERT INTO freshgear.tags (title)
        Values("cool")
      `);
    } catch (error) {
      console.log(error);
    }
    try {
      const tag = await Database.raw(`
        INSERT INTO freshgear.tags (title)
        Values("hypebeast")
      `);
    } catch (error) {
      console.log(error);
    }
    try {
      const tag = await Database.raw(`
        INSERT INTO freshgear.tags (title)
        Values("cheap")
      `);
    } catch (error) {
      console.log(error);
    }
    try {
      const tag = await Database.raw(`
        INSERT INTO freshgear.tags (title)
        Values("red")
      `);
    } catch (error) {
      console.log(error);
    }
    try {
      const tag = await Database.raw(`
        INSERT INTO freshgear.tags (title)
        Values("baby blue")
      `);
    } catch (error) {
      console.log(error);
    }
    try {
      const tag = await Database.raw(`
        INSERT INTO freshgear.tags (title)
        Values("new")
      `);
    } catch (error) {
      console.log(error);
    }
    try {
      const tag = await Database.raw(`
        INSERT INTO freshgear.tags (title)
        Values("fresh")
      `);
    } catch (error) {
      console.log(error);
    }
    console.log('Added Tags to Tags Table');
  }
}

module.exports = TagSeeder;
