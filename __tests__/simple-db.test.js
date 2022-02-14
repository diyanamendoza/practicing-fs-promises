const fs = require('fs/promises');
const path = require('path');
const SimpleDb = require('../lib/simple-db');

const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

describe('simple database', () => {
  beforeEach(async () => {
    await fs.rm(TEST_DIR, { force: true, recursive: true });
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  it('should get a file by id', async () => {
    // make db
    const db1 = new SimpleDb(TEST_DIR);
    // save a file
    const filePath = path.join(TEST_DIR, '1234.json');
    await fs.writeFile(
      filePath,
      JSON.stringify({ title: 'sample title', content: 'hi' })
    );

    // get the file by id
    const file = await db1.getById(1234);
    expect(file).toEqual({ title: 'sample title', content: 'hi' });
  });

  it('should convert ENOENT error to a Not found error', async () => {
    // make db
    const db = new SimpleDb(TEST_DIR);

    try {
      await db.getById(1234);
    } catch (err) {
      expect(err.message).toMatch('1234 not found.');
    }
  });

  it('should save a file', async () => {
    // make db
    const db2 = new SimpleDb(TEST_DIR);
    // save a file
    await db2.save({ title: 'sample title', content: 'hi' });
    // get all files in dir
    const files = await db2.getAll();
    expect(files).toEqual(
      expect.arrayContaining([
        { id: expect.any(String), title: 'sample title', content: 'hi' },
      ])
    );
  });

  it('should get all files', async () => {
    // make db
    const db1 = new SimpleDb(TEST_DIR);
    // save a few files
    const filePath = path.join(TEST_DIR, '1234.json');
    await fs.writeFile(
      filePath,
      JSON.stringify({ title: 'sample title', content: 'hi' })
    );

    const filePath2 = path.join(TEST_DIR, '1111.json');
    await fs.writeFile(
      filePath2,
      JSON.stringify({ title: 'sample title', content: 'bye' })
    );

    // get all files
    const files = await db1.getAll();
    expect(files).toEqual(
      expect.arrayContaining([
        { title: 'sample title', content: 'hi' },
        { title: 'sample title', content: 'bye' },
      ])
    );
  });
});
