const fs = require('fs');

/* ==== Import users and books database ==== */
const {
  usersDbPath
} = require("../db/index.js");

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
const createUser = function (req, res) {
  const body = [];

  /* === Data event is fired when the server receives data from the client === */
  req.on('data',
    (chunk) => {
      /* == Push each data received to the body array == */
      body.push(chunk);
    });

  req.on('end',
    () => {
      /* === Concatenate raw data into a single buffer string === */
      const parsedBody = Buffer.concat(body).toString();
      const newUser = JSON.parse(parsedBody); // parse the buffer string into a JSON object

      /* === Get ID of last user in the database === */
      const lastUser = usersDB[usersDB.length - 1];
      const lastUserId = lastUser.id;
      newUser.id = lastUserId + 1;

      /* === Save to DB === */
      usersDB.push(newUser);
      fs.writeFile(usersDbPath, JSON.stringify(usersDB), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(JSON.stringify({
            message: 'Internal Server Error. Could not save book to database.'
          }));
        }

        res.end(JSON.stringify(newUser));
      });
    });
}

const authenticateUser = function (req, res) {
  const body = []

  req.on("data", (chunk) => {
    body.push(chunk)
  })

  req.on("end", () => {
    const parsedBody = Buffer.concat(body).toString()

    if (!parsedBody) {
      res.writeHead(400);
      res.end(JSON.stringify({
          message: "No email or password provided"
        }));
    }

    const loginDetails = JSON.parse(parsedBody)

    const users = usersDB;
    const userFound = users.find((user) => {
      return (user.email === loginDetails.email)
    })


    if (!userFound) {
      res.writeHead(404);
      res.end(JSON.stringify({
          message: "User not found! Please sign up!"
        }));
      return
    }

    if (userFound.password !== loginDetails.password) {
      res.writeHead(404);
      res.end(JSON.stringify({
          message: "Invalid password!"
        }));
      return
    }
    
    res.end(JSON.stringify({
          message: "User found!",
          userInfo: userFound
        }));
  })
}

module.exports = {
  getAllUsers,
  createUser,
  authenticateUser
}