# Crawl
Crawls and find pdfs on the filesystem. Index them and upload them to a ipfs node.

# Api
mysql and elasticsearch connected to restful api to provide pdf data and ipfs adress

## view/frontend
> https://github.com/raskenstam/bookbock

# Getting started
## crawler
```
 npm install
```
> modify example.env then save as .env

> run fsCrawl.js

> run updateIpfs.js to add all books scraped to a node
## rest api
> make sure docker-compose.yml is setup and running
```
node index.js
```

# todo
    add when clicked to show most popular tags first