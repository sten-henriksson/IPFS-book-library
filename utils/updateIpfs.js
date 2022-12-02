/* eslint-disable import/extensions */
import dotenv from 'dotenv';
import { IniDb } from '../src/db.js';
import { addBooksToIpfs, startIPFSNode } from '../src/ipfs.js';

dotenv.config();
try {
  console.log('start');
  await IniDb();
  const node = await startIPFSNode();
  addBooksToIpfs(node);
  console.log('done');
} catch (error) {
  console.log('error', error);
}
