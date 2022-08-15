import { readdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import Hash from 'ipfs-only-hash';
/**
 * @param  {string} path parrent path that all children get checked for hashes
 * @returns {Array.Object.<path, hash>} {path,hash} ipfs hash and path
 */
function concatPath(path, fold) {
  return `${path}/${fold.name}`;
}

async function getIpfsHash(path) {
  let hash = false
  try {
    hash = await Hash.of(readFileSync(path));
  } catch (error) {
    console.log(error);
    hash = false
  }
  return hash
}

export default async function getAllChildHashes(path) {
  let dirrs = [path];
  let allFiles = [];
  while (dirrs.length !== 0) {
    const dirrPath = dirrs.pop();
    try {
      // https://nodejs.org/docs/latest/api/fs.html#direntisdirectory
      // eslint-disable-next-line no-await-in-loop
      const files = await readdir(dirrPath, { withFileTypes: true });
      console.log(files[0]);
      const dirr = files.filter((x) => x.isDirectory());
      const file = files.filter((x) => x.isFile());
      dirrs = dirrs.concat(dirr.map((x) => concatPath(dirrPath, x)));
      // return object with path and hash
      allFiles = allFiles.concat(
        file.map(async (x) => ({
          name: x.name,
          hash: await getIpfsHash(concatPath(dirrPath, x)),
          path: concatPath(dirrPath, x),
        })),
      );
    } catch (err) {
      console.error(err);
    }
  }
  return Promise.all(allFiles);
}
