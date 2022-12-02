/* eslint-disable no-promise-executor-return */
/* eslint-disable import/extensions */

import dotenv from 'dotenv';
import {
  IniDb, updateLibrary, Book, updateTagsDb,
} from '../src/db.js';

dotenv.config();
try {
  await IniDb();
  await new Promise((r) => setTimeout(r, 10000));
  await updateLibrary(process.env.BOOK_PATH);
  await new Promise((r) => setTimeout(r, 10000));
  const book = await Book.findAll({ attributes: ['path'], raw: true });
  updateTagsDb(book);
  console.log('done');
  // syncElastic();
} catch (error) {
  console.log(error);
}
