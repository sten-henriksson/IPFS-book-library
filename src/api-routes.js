/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
import { Book } from './db.js';

export default async function route(app) {
  /* app.get('/api/:tagId', (req) => {
    if (!req.params.tagId) {
      return false;
    }
    // send ipfs hash and torrent datahash/uri
    //
  }); */
  app.get('/books', async (req, res) => {
    const book = await Book.findAll({ attributes: ['name', 'hash'], raw: true });
    res.json(book);
  });
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
}
