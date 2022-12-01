import { Client } from '@elastic/elasticsearch';
import { Book } from './db.js';
import dotenv from 'dotenv'
dotenv.config()
const elasticUrl = process.env.ELASTIC_URL || "http://localhost:9200";
const client = new Client({ node: elasticUrl });

export async function searchElasticPath(keyword) {
    console.log(keyword);
    let search = await client.search({
        index: process.env.ELASTIC_INDEX,
        size: 5800,
        query: {
            match: { path: keyword }
        }
    })
    search = search.hits.hits.map(x => x._source)
    return search
}

export async function syncElastic() {
    const book = await Book.findAll({ attributes: ['name', 'path', 'hash'], raw: true });
    console.log("search", book);
    for (const key in book) {
        await client.index({
            index: process.env.ELASTIC_INDEX,
            id: book[key].hash,
            document: {
                hash: book[key].hash,
                name: book[key].name,
                path: book[key].path
            }
        })
        console.log("added", book[key].path);
    }
    console.log(await client.indices.refresh({ index: process.env.ELASTIC_INDEX }))
}

try {
    //let a = await searchElasticPath("txt");
    //console.log("ass", a);
} catch (error) {
}