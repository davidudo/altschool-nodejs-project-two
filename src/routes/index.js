/** ================================================== *
* =================================================== *
* All routes and their methods are channelled through
* this file to the index.js file in the root directory.
* =================================================== *
* =================================================== */

/* ==== Import book routes methods functions ==== */
const {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  loanRequest,
  returnBook
} = require("./books.js");

/* === Import user routes method functions === */
const {
  getAllUsers,
  createUser,
} = require("./users.js");

/* === Import utils === */
const {
  authenticateUser
} = require("../utils/authenticate.js");


/* ============================= */
/* ==== Book Route Methods ==== */
/* =========================== */
function bookRouteMethods(req, res) {
  const {
    url,
    method
  } = req;

  /* === Server Methods for Book Routes === */
  if (url.startsWith('/books/loanrequest') && method === 'PUT') {
    authenticateUser(req, res, ["admin", "reader"])
    .then(() => {
      loanRequest(req, res);
    })
    .catch((err) => {
      res.statusCode = 401;
      res.end(JSON.stringify({
        error: err
      }));
    });
  } else if (url.startsWith('/books/returnbook') && method === 'PUT') {
    authenticateUser(req, res, ["admin", "reader"])
    .then(() => {
      returnBook(req, res);
    })
    .catch((err) => {
      res.statusCode = 401;
      res.end(JSON.stringify({
        error: err
      }));
    });
  } else if (url === '/books' && method === 'GET') {
    getAllBooks(req, res);
  } else if (url === '/books' && method === 'POST') {
    authenticateUser(req, res, ["admin"])
    .then((book) => {
      addBook(req, res, book);
    })
    .catch((err) => {
      res.statusCode = 401;
      res.end(JSON.stringify({
        error: err
      }));
    });
  } else if (url === '/books' && method === 'PUT') {
    authenticateUser(req, res, ["admin"])
    .then((book) => {
      updateBook(req, res, book);
    })
    .catch((err) => {
      res.statusCode = 401;
      res.end(JSON.stringify({
        error: err
      }));
    });
  } else if (url.startsWith('/books') && method === 'DELETE') {
    authenticateUser(req, res, ["admin"])
    .then(() => {
      deleteBook(req, res);
    })
    .catch((err) => {
      res.statusCode = 401;
      res.end(JSON.stringify({
        error: err
      }));
    });
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({
      message: 'Method Not Supported!'
    }));
  }
}

/* ============================= */
/* ==== User Route Methods ==== */
/* =========================== */
function userRouteMethods(req, res) {
  const {
    url,
    method
  } = req;

  /* === Server Methods for User Routes === */
  if (url === '/users' && method === 'POST') {
    authenticateUser(req, res, ["admin"])
    .then((user) => {
      createUser(req, res, user);
    })
    .catch((err) => {
      res.statusCode = 401;
      res.end(JSON.stringify({
        error: err
      }));
    });
  } else if (url === '/users' && method === 'GET') {
    authenticateUser(req, res, ["admin"])
    .then(() => {
      getAllUsers(req, res);
    })
    .catch((err) => {
      res.statusCode = 401;
      res.end(JSON.stringify({
        error: err
      }));
    });
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({
      message: 'Method Not Supported'
    }));
  }
}

module.exports = {
  bookRouteMethods,
  userRouteMethods
}
