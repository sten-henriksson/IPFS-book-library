/* eslint-disable import/extensions */
import { IniDb, updateLibrary } from './src/db.js';
import { addBooksToIpfs, startIPFSNode } from './src/ipfs.js';
import dotenv from 'dotenv'
dotenv.config()
try {
    console.log("start");
    await IniDb();
    const node = await startIPFSNode();
    addBooksToIpfs(node);
    console.log("done");
} catch (error) {
    console.log('error', error);
}
