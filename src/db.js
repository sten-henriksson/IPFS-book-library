/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Sequelize, DataTypes } from 'sequelize';
import { unlinkSync } from 'node:fs';
import dotenv from 'dotenv';
import getAllChildHashes from './fs-crawler.js';

dotenv.config();
console.log(process.env);
// eslint-disable-next-line max-len
const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.MYSQL_IP,
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
  tag: DataTypes.STRING,
});

export const pathTags = sequelize.define('path_tags', {
  path: {
    type: DataTypes.STRING,
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
function creattag(pathString) {
  const path = pathString.split('/');
  path.splice(0, 3);
  path.pop();
  while (true) {
    if (path.length <= 3) {
      break;
    } else {
      path.pop();
    }
  }
  // while (path.length >= 3) {
  //   path.pop();
  // }
  return path.join('/');
}
/**
 * @param  {} path path where it will crawl ower children and add to db. duplicate gets removed
 */
export async function updateLibrary(path) {
  const hashes = await getAllChildHashes(path);
  // creat db models from children in "path"
  const bookModels = hashes.map((x) => Book.build({
    name: x.name, hash: x.hash, path: x.path, tag: creattag(x.path),
  }));
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
        console.log('1', error);
      }
    }
  });
}
function getTags(bookArr) {
  return bookArr.map((x) => creattag(x.path));
}
export function updateTagsDb(x) {
  x.forEach(async (book) => {
    if (book.hash) {
      try {
        const bookTag = creattag(book.path);
        console.log(book.path);
        console.log(bookTag);
        let path = bookTag.split('/');
        path.shift();
        path = path.join('/');
        // eslint-disable-next-line no-param-reassign
        book.tag = path;
        await book.save();
      } catch (error) {
        console.log('2', error);
      }
    }
  });
  return getTags(x).forEach((element) => {
    console.log('element', element);
    if (!element.includes('3rd Party')) {
      if (!element.includes('.zip')) {
        if (!element.includes('.7z')) {
          try {
            let path = element.split('/');
            path.shift();
            path = path.join('/');
            pathTags.upsert({
              path,
            });
            console.log(path);
          } catch (error) {
            console.log('2', error);
          }
        }
      }
    }
  });
}
