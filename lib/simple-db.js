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

    try {
      const file = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(file);
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`${id} not found.`);
      }
      throw err;
    }
  }

  //get all
  async getAll() {
    try {
      const array = await fs.readdir(this.dirPath);
      return await Promise.all(
        array.map(async (file) => {
          const file2read = await fs.readFile(
            `${this.dirPath}/${file}`,
            'utf-8'
          );
          return JSON.parse(file2read);
        })
      );
    } catch (err) {
      if (err.code === 'ENOENT') {
        return null;
      }
      throw err;
    }
  }
}

module.exports = SimpleDb;
