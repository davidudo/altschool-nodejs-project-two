/** ================================================== *
* =================================================== *
* This file contains all authentication functions, two
* modes of authentication used are password
* authentication and token authentication.
* =================================================== *
* =================================================== */

const fs = require("fs")
const path = require("path");

const {
  usersDbPath
} = require("../../db/index.js");

/* === Gets all users in database === */
function getAllUsers() {
  return new Promise((resolve, reject) => {
    fs.readFile(usersDbPath, "utf8", (err, users) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(users));
    })
  })
}

/* ================================ */
/* === Password Authentication === */
/* ============================== */
function authenticateUser(req, res, roles) {
  return new Promise((resolve,
    reject) => {
    const body = [];

    req.on('data',
      (chunk) => {
        body.push(chunk);
      });

    req.on('end',
      async () => {
        const parsedBody = Buffer.concat(body).toString();
        if (!parsedBody) {
          reject("Please enter your username and password");
        }

        const {
          user: loginDetails,
          data
        } = JSON.parse(parsedBody);
        const users = await getAllUsers();
        const userFound = users.find(user => user.email === loginDetails.email && user.password === loginDetails.password);

        if (!userFound) {
          reject("Username or password incorrect");
        }

        if (!roles.includes(userFound.role)) {
          reject("You do not have the required role to access this resource");
        }

        resolve(data);
      });
  })
}


module.exports = {
  authenticateUser,
  getAllUsers
}