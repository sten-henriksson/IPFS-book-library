/* eslint-disable import/extensions */
import express from 'express';
import { IniDb, updateLibrary } from './src/db.js';
import route from './src/api-routes.js';
import { syncElastic } from './src/elastic.js';
import { addBooksToIpfs, startIPFSNode } from './src/ipfs.js';
import dotenv from 'dotenv'
dotenv.config()
try {
  await IniDb();
  await syncElastic();
} catch (error) {
  console.log('error');
}
const app = express();
route(app);
app.listen(process.env.PORT || 1337, () => {
  console.log(`Example app listening on port ${process.env.ELASTIC_URL || 1337}`);
});
