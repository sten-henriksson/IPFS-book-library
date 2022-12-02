/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
// eslint-disable-next-line import/extensions
import { Book, pathTags } from './db.js';
import { searchElasticPath } from './elastic.js';

export default async function route(app) {
  app.get('/books', async (req, res) => {
    const book = await Book.findAll({ attributes: ['name', 'hash'], raw: true });
    res.json(book);
  });
  app.get('/tags', async (req, res) => {
    const tags = await pathTags.findAll({ attributes: ['path'], raw: true });
    res.json(tags);
  });
  app.get('/tagsearch/:page/:tagId', async (req, res) => {
    if (!req.params.tagId) {
      return false;
    }
    if (!req.params.page) {
      return false;
    }
    let tag = req.params.tagId.split('_');
    tag = tag.join('/');
    const books = await Book.findAll({ where: { tag }, raw: true });
    let pathsort = books.sort((a, b) => a.name.localeCompare(b.name));
    if (pathsort.length === 0) {
      pathsort = [{ name: 'bad search', path: false, hash: false }];
    }
    const pageAmount = 31;
    const page = req.params.page - 1;
    const startpage = page * pageAmount;
    const sendvar = pathsort.slice(startpage, startpage + pageAmount);
    res.json({ books: sendvar, pages: Math.floor(pathsort.length / pageAmount) + 1 });
  });
  app.get('/search/:page/:tagId', async (req, res) => {
    if (!req.params.tagId) {
      return false;
    }
    if (!req.params.page) {
      return false;
    }
    const elasticSeach = await searchElasticPath(req.params.tagId.replace('_', '/'));
    let pathsort = elasticSeach;// elasticSeach.sort((a, b) => a.name.localeCompare(b.name))
    if (pathsort.length === 0) {
      pathsort = [{ name: 'bad search', path: false, hash: false }];
    }
    const pageAmount = 31;
    const page = req.params.page - 1;
    const startpage = page * pageAmount;
    const sendvar = pathsort.slice(startpage, startpage + pageAmount);
    res.json({ books: sendvar, pages: Math.floor(pathsort.length / pageAmount) + 1 });
  });
}
