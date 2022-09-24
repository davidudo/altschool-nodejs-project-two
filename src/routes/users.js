const fs = require('fs');

/* ==== Import users and books database ==== */
const {
  usersDbPath
} = require("../../db/index.js");

/* ==== Initialise empty array for database ==== */
let usersDB = [];

/* ===== Add all users DB content to empty array ===== */
usersDB = JSON.parse(fs.readFileSync(usersDbPath, 'utf8'));

/* ========================== */
/* ===== Get All Users ===== */
/* ======================== */
const getAllUsers = function (req, res) {
  fs.readFile(usersDbPath, "utf8", (err, users)=> {
    if (err) {
      console.log(err)
      res.writeHead(400)
      res.end("An error occured")
    }

    res.end(users);
  })
}

/* ======================== */
/* ===== Create User ===== */
/* ====================== */
const createUser = function (req, res, newUser) {
  /* === Add the new user to the end of the existing users array === */
  fs.readFile(usersDbPath,
    "utf8",
    (err, users) => {
      if (err) {
        console.log(err)
        res.writeHead(400)
        res.end("An error occured")
      }

      /* === Get ID of last user in the database === */
      const lastUser = usersDB[usersDB.length - 1];
      const lastUserId = lastUser.id;
      newUser.id = lastUserId + 1;
      
      /* === Make role of newUser reader by default === */
      newUser.role = "reader";

      const oldUsers = JSON.parse(users);
      const allUsers = [...oldUsers,
        newUser];

      fs.writeFile(usersDbPath, JSON.stringify(allUsers), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(JSON.stringify({
            message: 'Internal Server Error. Could not save book to database.'
          }));
        }

        res.end(JSON.stringify(newUser));
      });
    })
}

module.exports = {
  getAllUsers,
  createUser
}