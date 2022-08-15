import { Client } from '@elastic/elasticsearch';
import { Book } from './db.js';
const elasticUrl = process.env.ELASTIC_URL || "http://localhost:9200";
const client = new Client({ node: elasticUrl });

export async function searchElasticPath(keyword) {
    console.log(keyword);
    let search = await client.search({
        index: 'main',
        size: 100,
        query: {
            match: { path: keyword }
        }
    })
    search = search.hits.hits.map(x => x._source)
    return search
}

export async function syncElastic() {
    const book = await Book.findAll({ attributes: ['name', 'path', 'hash'], raw: true });
    console.log(book);
    for (const key in book) {
        await client.index({
            index: 'main',
            id: book[key].hash,
            document: {
                hash: book[key].hash,
                name: book[key].name,
                path: book[key].path
            }
        })
        console.log("added", book[key].path);
    }
    console.log(await client.indices.refresh({ index: 'main' }))
}

try {
    //let a = await searchElasticPath("txt");
    //console.log("ass", a);
} catch (error) {
}