const fs = require('fs');
const path = require("path");

/* ==== Import main users and books database ==== */
const {
  booksDbPath,
  usersDbPath
} = require("../../db/index.js");

/* ==== Import test users and books database ==== */
const testBooksDbPath = path.join(__dirname, 'books.json');
const testUsersDbPath = path.join(__dirname, 'users.json');

function resetDb() {
  writeIntoDb(testBooksDbPath, booksDbPath);
  writeIntoDb(testUsersDbPath, usersDbPath);
}

function writeIntoDb(testDbPath, mainDbPath) {
  const data = fs.readFileSync(testDbPath, 'utf8');

  fs.writeFile(mainDbPath, data, (err) => {
    if (err) {
      console.log(err);
      res.writeHead(500);
      res.end(JSON.stringify({
        message: 'Internal Server Error. Could not reset database.'
      }));
    }
  });
}

module.exports = {
  resetDb
}