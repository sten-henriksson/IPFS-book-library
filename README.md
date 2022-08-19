# resources

- https://stackoverflow.com/questions/60046604/node-less-way-to-generate-a-cid-that-matches-ipfs-desktop-cid
- https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md#ipfsadddata-options
- https://www.npmjs.com/package/ipfs-http-client#api
- https://github.com/ipfs-examples/js-ipfs-examples/tree/master/examples
- http://www.bittorrent.org/beps/bep_0003.html
- https://towardsdatascience.com/how-to-synchronize-elasticsearch-with-mysql-ed32fc57b339
- https://stackoverflow.com/questions/62005208/api-caching-for-next-js
- https://nextjs.org/docs/basic-features/data-fetching/get-static-props
- https://www.npmjs.com/package/@elastic/elasticsearch
- https://planetscale.com/pricing


sudo chown -R 1000:root docker_data   to give elastic accses to folder
sudo chown -R 1000:root esdata
# fscrawler

## todo
- unit test creat tag
- unit test getAllChildHashes
- faq
- env to select dnd or pathfinder api
- enable "pages" and send in json how many pages there is. before sending and sorting arr select correct page and add an extra param to url
- next page is hidden if first / last

## done
- 2 search endpoints name and path. path is used to search tags
- links open new tab
- change & to %
- split path to give tags
- 3 explore webtorrent
- searchable from db
- 2 express routes   
- 3 get cid hash to check for duplicate files
- 1 Setup docker db
- 2 creat models and add sequlize
- 1 add files to db
- 1 delete duplicate files
- 2 add ipfs deamon
- 2 add to ipfs
- 2 get mysql data 
- running addlibrary() twice deletes all
- 4 ipfs poc
- path to harddrive and update ipfs path
# express rest
- see parrent folder as a way to sort to catagor.
# dbdesign
- book: id,hash,path
- in_ipfs: id
# torrent
- add each pdf as a single torrent
- use dht 
# misc
to add autoformat
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "eslint.validate": ["javascript"]
}

# plan
> frontend and backend testing
> split into mulitiple websites warhammer dnd 5e
> diffrent elastic index for each sub part
> https://www.reddit.com/r/nextjs/comments/usrdr3/what_is_the_best_way_to_deploy_nextjs_website_to/i98gk27/?context=8&depth=9

docker run -d \
  --name=ipfs \
  -e PUID=1000 \
  -e PGID=1000 \
  -e TZ=Europe/London \
  -p 80:80 \
  -p 4001:4001 \
  -p 5001:5001 \
  -p 8080:8080 \
  -p 443:443 `#optional` \
  -v /path/to/data:/config \
  --restart unless-stopped \
  lscr.io/linuxserver/ipfs