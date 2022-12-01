/* eslint-disable import/extensions */
import express from 'express';
import { IniDb, updateLibrary, Book, updateTagsDb } from './src/db.js';
import route from './src/api-routes.js';
import { syncElastic } from './src/elastic.js';
import { addBooksToIpfs, startIPFSNode } from './src/ipfs.js';
import dotenv from 'dotenv'
dotenv.config()
try {
    await IniDb();
    const book = await Book.findAll();
    updateTagsDb(book)
    console.log("done");
    //syncElastic();
} catch (error) {
    console.log(error);
}
