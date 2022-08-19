/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
import { Book, pathTags } from './db.js';
import { searchElasticPath } from './elastic.js';
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
    console.log(req.params.tagId.replace('_', '/'));
    let tag = req.params.tagId.split("_")
    tag = tag.join("/")
    console.log(tag);
    tag = "Pathfinder/" + tag
    console.log(tag);
    const books = await Book.findAll({ where: { tag: tag }, raw: true })
    let pathsort = books.sort((a, b) => a.name.localeCompare(b.name))
    if (pathsort.length == 0) {
      pathsort = [{ name: "bad search", path: false, hash: false }]
    }
    const page_amount = 31
    let page = req.params.page - 1
    let startpage = page * page_amount
    let sendvar = pathsort.slice(startpage, startpage + page_amount)
    res.json({ books: sendvar, pages: Math.floor(pathsort.length / page_amount) + 1 })
  });
  app.get('/search/:page/:tagId', async (req, res) => {
    if (!req.params.tagId) {
      return false;
    }
    if (!req.params.page) {
      return false;
    }
    const elasticSeach = await searchElasticPath(req.params.tagId.replace('_', '/'));
    let pathsort = elasticSeach//elasticSeach.sort((a, b) => a.name.localeCompare(b.name))
    if (pathsort.length == 0) {
      pathsort = [{ name: "bad search", path: false, hash: false }]
    }
    const page_amount = 31
    let page = req.params.page - 1
    let startpage = page * page_amount
    let sendvar = pathsort.slice(startpage, startpage + page_amount)
    res.json({ books: sendvar, pages: Math.floor(pathsort.length / page_amount) + 1 })
  });
}
