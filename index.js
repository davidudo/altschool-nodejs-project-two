const http = require("http");

/* ==== Import book routes methods functions ==== */
const {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  loanOutBooks,
  returnBooks
} = require("./routes/books.js");

/* === Import user routes method functions === */
const {
  getAllUsers,
  createUser,
  authenticateUser
} = require("./routes/users.js");

const HOST_NAME = 'localhost';
const PORT = 8000;


/* ========================== */
/* ==== Request Handler ==== */
/* ======================== */
const requestHandler = function (req, res) {
  /* ==== Set Headers === */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Content-Type", "application/json");

  const {
    url,
    method
  } = req;

  /* === Server Methods for User and Book Routes === */
  if (url === '/users' && method === 'GET') {
    getAllUsers(req, res);
  } else if (url === '/users' && method === 'POST') {
    createUser(req, res);
  } else if (url === '/authenticateUser' && method === 'POST') {
    authenticateUser(req, res);
  } else if (url === '/books/loanout' && method === 'POST') {
    loanOutBooks(req, res);
  } else if (url === '/books/returnbooks' && method === 'POST') {
    returnBooks(req, res);
  } else if (url === '/books' && method === 'GET') {
    getAllBooks(req, res);
  } else if (url === '/books' && method === 'POST') {
    addBook(req, res);
  } else if (url === '/books' && method === 'PUT') {
    updateBook(req, res);
  } else if (url.startsWith('/books') && method === 'DELETE') {
    deleteBook(req, res);
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({
      message: 'Method Not Supported'
    }));
  }
}

/* ========================= */
/* ==== Create server ==== */
/* ====================== */
const server = http.createServer(requestHandler)

server.listen(PORT, HOST_NAME, () => {
  // booksDB = JSON.parse(fs.readFileSync(booksDbPath, 'utf8'));
  console.log(`Server is listening on ${HOST_NAME}:${PORT}`)
})