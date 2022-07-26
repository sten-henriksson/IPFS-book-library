/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Sequelize, DataTypes } from 'sequelize';
import { unlinkSync } from 'node:fs';
import getAllChildHashes from './fs-crawler.js';

const sequelize = new Sequelize('main', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});
export const Book = sequelize.define('book', {
  name: DataTypes.STRING,
  hash: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  path: DataTypes.STRING,
});

export const AddedHash = sequelize.define('added_hash', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
});

export async function IniDb() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', error);
  }
}
/**
 * @param  {} path path where it will crawl ower children and add to db. duplicate gets removed
 */
export async function updateLibrary(path) {
  const hashes = await getAllChildHashes(path);
  // creat db models from children in "path"
  const bookModels = hashes.map((x) => Book.build({ name: x.name, hash: x.hash, path: x.path }));
  bookModels.forEach(async (element) => {
    try {
      // saves to db
      await element.save();
    } catch (error) {
      // delete files with duplicate hash
      if (error.original.errno === 1062) {
        const book = await Book.findOne({ where: { path: element.path }, raw: true });
        // if it got matching path its already added
        if (!book) {
          console.log('err1', `delete ${element.path}`);
          unlinkSync(element.path);
        }
      } else {
        console.log(error);
      }
    }
  });
}
