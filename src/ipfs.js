/* eslint-disable import/extensions */
import { readFileSync } from 'node:fs';
import { create } from 'ipfs-http-client';
import { Book } from './db.js';

async function addToNode(node, path) {
  let a;
  try {
    a = await node.add(readFileSync(path), {
      pin: true,
    });
  } catch (error) {
    a = false;
  }

  console.log('a', path);
  return a;
}

export async function addBooksToIpfs(node) {
  const books = await Book.findAll({ attributes: ['path'], raw: true });
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < books.length; index++) {
    console.log(`${index}/${books.length}`);
    const book = books[index];
    // eslint-disable-next-line no-await-in-loop
    await addToNode(node, book.path);
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
