const fs = require('fs/promises');
const path = require('path');
const shortid = require('shortid');

class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }

  //save one file
  save(file) {
    const id = shortid.generate();
    file.id = id;
    const fileName = `${id}.json`;
    this.filePath = path.join(this.dirPath, fileName);
    this.stringyFile = JSON.stringify(file);

    return fs.writeFile(this.filePath, this.stringyFile);
  }

  //get by id
  async getById(id) {
    this.filePath = path.join(this.dirPath, `${id}.json`);

    return fs
      .readFile(this.filePath, 'utf-8')
      .then((file) => {
        return JSON.parse(file);
      })
      .catch((err) => {
        if (err.code === 'ENOENT') {
          throw new Error(`${id} not found.`);
        }
        throw err;
      });
  }

  //get all
  async getAll() {
    return fs.readdir(this.dirPath).then((array) =>
      Promise.all(
        array.map((file) => {
          return fs
            .readFile(`${this.dirPath}/${file}`, 'utf-8')
            .then((fileContents) => {
              return JSON.parse(fileContents);
            })
            .catch((err) => {
              if (err.code === 'ENOENT') {
                return null;
              }
              throw err;
            });
        })
      )
    );
  }
}

module.exports = SimpleDb;
