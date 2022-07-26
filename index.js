/* eslint-disable import/extensions */
import express from 'express';
import { IniDb, updateLibrary } from './src/db.js';
import route from './src/api-routes.js';
import { addBooksToIpfs, startIPFSNode } from './src/ipfs.js';

try {
  await IniDb();
  await updateLibrary('testpdf');
  const node = await startIPFSNode();
  addBooksToIpfs(node);
} catch (error) {
  console.log('error');
}
const app = express();
route(app);
app.listen(5010, () => {
  console.log(`Example app listening on port ${5010}`);
});
