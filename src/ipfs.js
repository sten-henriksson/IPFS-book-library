/* eslint-disable import/extensions */
import { readFileSync } from 'node:fs';
import { create } from 'ipfs-http-client';
import { Book } from './db.js';

async function addToNode(node, path) {
  const a = await node.add(path, {
    pin: true,
  });//readFileSync(path));
  console.log(a);
  return a;
}

export async function addBooksToIpfs(node) {
  const books = await Book.findAll({ attributes: ['path'], raw: true });
  books.forEach((book) => {
    addToNode(node, book.path);
  });
}
export async function startIPFSNode() {
  return create();

}
/*
try {
  let a = await create();
  addToNode(a, "")
} catch (error) {
  console.log(error);
}
*/