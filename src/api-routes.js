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
  app.get('/tagsearch/:tagId', async (req, res) => {
    if (!req.params.tagId) {
      return false;
    }
    console.log(req.params.tagId.replace('&', '/'));
    let tag = req.params.tagId.split("&")
    tag = tag.join("/")
    console.log(tag);
    tag = "Pathfinder/" + tag
    console.log(tag);
    const books = await Book.findAll({ where: { tag: tag }, raw: true })
    let pathsort = books.sort((a, b) => a.name.localeCompare(b.name))
    if (pathsort.length == 0) {
      pathsort = [{ name: "bad search", path: false, hash: false }]
    }
    res.json(pathsort)
  });
  app.get('/search/:tagId', async (req, res) => {
    if (!req.params.tagId) {
      return false;
    }
    const elasticSeach = await searchElasticPath(req.params.tagId.replace('&', '/'));
    let pathsort = elasticSeach.sort((a, b) => a.name.localeCompare(b.name))
    if (pathsort.length == 0) {
      pathsort = [{ name: "bad search", path: false, hash: false }]
    }
    res.json(pathsort)
  });
}
