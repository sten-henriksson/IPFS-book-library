/* eslint-disable import/extensions */
import express from 'express';
import dotenv from 'dotenv';
import { IniDb } from './src/db.js';
import route from './src/api-routes.js';
import { syncElastic } from './src/elastic.js';

dotenv.config();
try {
  await IniDb();
  await syncElastic();
} catch (error) {
  console.log('error');
}
const app = express();
route(app);
app.listen(process.env.PORT || 1337, () => {
  console.log(`Example app listening on port ${process.env.PORT || 1337}`);
});
