/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Sequelize, DataTypes } from 'sequelize';
import { unlinkSync } from 'node:fs';
import getAllChildHashes from './fs-crawler.js';
import dotenv from 'dotenv'
dotenv.config()
console.log(process.env);
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
/**
 * @param  {} path path where it will crawl ower children and add to db. duplicate gets removed
 */
export async function updateLibrary(path) {
  const hashes = await getAllChildHashes(path);
  // creat db models from children in "path"
  const bookModels = hashes.map((x) => Book.build({ name: x.name, hash: x.hash, path: x.path, tag: creattag(x.path) }));
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
        console.log("1", error);
      }
    }
  });
}
export function updateTagsDb(x) {
  return getTags(x).map(element => {
    console.log("element", element);
    if (!element.includes(".pdf")) {
      if (!element.includes(".zip")) {
        if (!element.includes(".7z")) {
          try {
            let path = element.split("/")
            path.shift();
            path = path.join("/")
            pathTags.upsert({
              path: path
            })
          } catch (error) {
            console.log("2", error);
          }
        }
      }
    }
  })
}
function getTags(bookArr) {
  return bookArr.map((x) => {
    return creattag(x.path)
  });
}

function creattag(pathString) {
  console.log("path", pathString);
  const path = pathString.split("/")
  let tags = []
  let tagStart = false
  let depth = process.env.TAG_DEPTH || 0
  for (let index = 0; index < path.length; index++) {
    const element = path[index];
    // will make all dir before TAGSTART not be part of formated string
    if (element == process.env.TAGSTART) {
      tagStart = true
    }
    // after Folder trigger add next 3 folder name to tag name
    if (tagStart) {
      if (depth < 3) {
        tags.push(element)
        depth++;
      }
    }
  }
  console.log(tags.join("/"));
  return tags.join("/");
}