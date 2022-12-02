/* eslint-disable import/extensions */
import dotenv from 'dotenv';
import {
  IniDb, Book, updateTagsDb,
} from '../src/db.js';

dotenv.config();
try {
  console.log('start');
  await IniDb();
  const book = await Book.findAll();
  updateTagsDb(book);
  console.log('done');
  // syncElastic();
} catch (error) {
  console.log(error);
}
