/* eslint-disable import/extensions */
import { readFileSync } from 'node:fs';
import { create } from 'ipfs-http-client';
import { Book } from './db.js';

async function addToNode(node, path) {
  const a = await node.add(readFileSync(path), {
    pin: true,
  });
  console.log("node", a);
  return a;
}

export async function addBooksToIpfs(node) {
  const books = await Book.findAll({ attributes: ['path'], raw: true });
  for (let index = 0; index < books.length; index++) {
    const book = books[index];
    await addToNode(node, book.path)
  }
}

export async function startIPFSNode() {
  return create();
}

/*
try {
  let a = await create();
  console.log(await addToNode(a, '/home/stenasd3/disk/qbit/Books/Pathfinder/Flip Mats/Flip Mat - Cavernous Lair.pdf'))
} catch (error) {
  console.log(error);
}
*/
