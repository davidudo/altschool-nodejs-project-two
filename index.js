/** ================================================== *
 * =================================================== *
 * This is the file were the server is created and all
 * requests being sent are handled.
 * =================================================== *
 * =================================================== */

const http = require("http");

/* === Import all routes and their methods === */
const {
  bookRouteMethods,
  userRouteMethods
} = require("./src/routes/index.js");

const HOST_NAME = 'localhost';
const PORT = 8000;


/* ========================== */
/* ==== Request Handler ==== */
/* ======================== */
const requestHandler = async function (req, res) {
  /* ==== Set Headers === */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Content-Type", "application/json");
  
  if (req.url.startsWith('/users')) {
    userRouteMethods(req, res);
  } else if (req.url.startsWith('/books')) {
    bookRouteMethods(req, res);
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({
      message: '404 Not Found!'
    }));
  }
}

/* ========================= */
/* ==== Create server ==== */
/* ====================== */
const server = http.createServer(requestHandler)

server.listen(PORT, HOST_NAME, () => {
  console.log(`Server is listening on ${HOST_NAME}:${PORT}`)
})

module.exports = server;