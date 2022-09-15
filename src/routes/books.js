const fs = require('fs');

/* === Import utility functions ==== */
const {
  sortDatabase
} = require("../utils/sort_database.js");

/* ==== Import users and books database ==== */
const {
  booksDbPath,
  loanedBooksDbPath
} = require("../db/index.js");

/* ==== Initialise empty array for databases ==== */
let booksDB = [];
let loanedBooksDB = [];

/* ===== Add books DB content to empty array ===== */
booksDB = JSON.parse(fs.readFileSync(booksDbPath, 'utf8'));

/* ===== Add loanedBooks DB content to empty array ===== */
loanedBooksDB = JSON.parse(fs.readFileSync(loanedBooksDbPath, 'utf8'));


/* ========================== */
/* ===== Get All Books ===== */
/* ======================== */
const getAllBooks = function (req, res) {
  fs.readFile(booksDbPath, "utf8", (err, books)=> {
    if (err) {
      console.log(err)
      res.writeHead(400)
      res.end("An error occured")
    }

    res.end(books);
  })
}

/* ======================= */
/* ===== Add A Book ===== */
/* ===================== */
const addBook = function (req, res) {
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
      const newBook = JSON.parse(parsedBody); // parse the buffer string into a JSON object

      /* === Get ID of last book in the database === */
      const lastBook = booksDB[booksDB.length - 1];
      // console.log(booksDB);
      const lastBookId = lastBook.id;
      newBook.id = lastBookId + 1;

      /* === Save to DB === */
      booksDB.push(newBook);
      fs.writeFile(booksDbPath, JSON.stringify(booksDB), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(JSON.stringify({
            message: 'Internal Server Error. Could not save book to database.'
          }));
        }

        res.end(JSON.stringify(newBook));
      });
    });
}

/* ========================== */
/* ===== Update A Book ===== */
/* ======================== */
const updateBook = function (req, res) {
  const body = [];

  /* === Data event is fired when the server receives data from the client === */
  req.on('data', (chunk) => {
    /* === Push each data received to the body array === */
    body.push(chunk);
  });

  req.on('end', () => {
    /* === Concatenate raw data into a single buffer string === */
    const parsedBody = Buffer.concat(body).toString();

    /* == Parse the buffer string into a JSON object == */
    const bookToUpdate = JSON.parse(parsedBody);

    /* === Find the book in the database === */
    const bookIndex = booksDB.findIndex((book) => {
      return book.id === bookToUpdate.id;
    });

    /* === Return 404 if book not found === */
    if (bookIndex === -1) {
      res.writeHead(404);
      res.end(JSON.stringify({
        message: 'Book not found!'
      }));
      return;
    }

    /* === Update the book in the database === */
    booksDB[bookIndex] = {
      ...booksDB[bookIndex],
      ...bookToUpdate
    };

    /* === Save to DB === */
    fs.writeFile(booksDbPath, JSON.stringify(booksDB), (err) => {
      if (err) {
        console.log(err);
        res.writeHead(500);
        res.end(JSON.stringify({
          message: 'Internal Server Error. Could not update book in database.'
        }));
      }

      res.end(JSON.stringify(bookToUpdate));
    });
  });
}

/* ========================== */
/* ===== Delete A Book ===== */
/* ======================== */
const deleteBook = function (req, res) {
  /* ==== Get ID from URL ==== */
  const bookId = req.url.split('/')[2];

  /* ==== Get location of bookId in DB ==== */
  const bookIndex = booksDB.findIndex((book) => {
    return book.id === parseInt(bookId);
  })

  /* ==== Check if book ID is not found ==== */
  if (bookIndex === -1) {
    res.writeHead(404);
    res.end(JSON.stringify({
      message: 'Book not found!'
    }));

    return;
  }

  /* == Remove the book from the DB using the index == */
  booksDB.splice(bookIndex, 1);

  /* ==== Update the Database ==== */
  fs.writeFile(booksDbPath, JSON.stringify(booksDB), (err) => {
    if (err) {
      console.log(err);
      res.writeHead(500);
      res.end(JSON.stringify({
        message: 'Internal Server Error. Could not delete book from database.'
      }));
    }

    res.end(JSON.stringify({
      message: 'Book successfully deleted!'
    }));
  });

}

/* =========================== */
/* ===== Loan Out Books ===== */
/* ======================== */
const loanOutBooks = function (req, res) {
  const body = [];

  req.on('data',
    (chunk) => {
      /* === Push each data received to the body array === */
      body.push(chunk);
    });

  req.on('end',
    () => {
      /* === Concatenate raw data into a single buffer string === */
      const parsedBody = Buffer.concat(body).toString();

      /* == Parse the buffer string into a JSON object == */
      const booksToLoan = JSON.parse(parsedBody);

      /* === Get books to be loaned IDs === */
      const booksToLoanIDs = booksToLoan["id"];

      /* === Initiate newly loaned books array === */
      let newlyLoanedBooks = [];

      /* ==== Get location of bookId in DB ==== */
      const bookIndex = booksDB.findIndex((book) => {
        for (let i = 0; i < booksToLoanIDs.length; i++) {
          return book.id === booksToLoanIDs[i];
        }
      })

      let errorMessage;

      /* ==== Check if book ID is not found ==== */
      if (bookIndex === -1) {
        errorMessage = "One or all of the book(s) you requested for has an unknown ID or the book is on loan already!";
        
        res.end(JSON.stringify({
            message: errorMessage,
          }));
      }

      /* === Find and get books to be loaned in DB === */
      for (let i = 0; i < booksDB.length; i++) {
        const bookID = booksDB[i].id;

        if (booksToLoanIDs.includes(bookID)) {
          /* === Add loaned books to loanedBooksDB === */
          loanedBooksDB.push(booksDB[i]);
          newlyLoanedBooks.push(booksDB[i]);
        }
      }

      sortDatabase(loanedBooksDB, "id");

      /* === Filter loaned books out of booksDB === */
      const booksInStock = booksDB.filter((bookInDB) => {
        return !(booksToLoan.id.includes(bookInDB.id));
      })

      /* === Save booksInStock to booksDB === */
      fs.writeFile(booksDbPath, JSON.stringify(booksInStock), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(JSON.stringify({
            message: 'Internal Server Error. Could not save book to database.'
          }));
        }
      });

      /* === Save loaned books to loanedBooksDB === */
      fs.writeFile(loanedBooksDbPath,
        JSON.stringify(loanedBooksDB),
        (err) => {
          if (err) {
            console.log(err);
            res.writeHead(500);
            res.end(JSON.stringify({
              message: 'Internal Server Error. Could not save book to database.'
            }));
          }

         res.end(JSON.stringify(newlyLoanedBooks));
        });
    }
  )
}

/* ========================= */
/* ===== Return Books ===== */
/* ======================= */
const returnBooks = function (req, res) {
  const body = [];

  req.on('data',
    (chunk) => {
      /* === Push each data received to the body array === */
      body.push(chunk);
    });

  req.on('end', () => {
    /* === Concatenate raw data into a single buffer string === */
    const parsedBody = Buffer.concat(body).toString();

    /* == Parse the buffer string into a JSON object == */
    const booksToReturn = JSON.parse(parsedBody);

    /* === Get books to be return books IDs === */
    const booksToReturnIDs = booksToReturn["id"];

    /* === Initiate newly returned books array === */
    let newlyReturnedBooks = [];

    /* ==== Get location of books to return in loanedBooksDB ==== */
    const bookIndex = loanedBooksDB.findIndex((book) => {
      for (let i = 0; i < booksToReturnIDs.length; i++) {
        return book.id === booksToReturnIDs[i];
      }
    })

    /* ==== Check if book ID is not found ==== */
    if (bookIndex === -1) {
      res.writeHead(404);
      res.end(JSON.stringify({
        message: "One of the books or book you requested for has an unknown ID or the book wasn't loaned!"
      }));
    }

    /* === Find and get books to be return to booksDB === */
    for (let i = 0; i < loanedBooksDB.length; i++) {
      const bookID = loanedBooksDB[i].id;

      if (booksToReturnIDs.includes(bookID)) {
        /* === Add books to booksDB === */
        booksDB.push(loanedBooksDB[i]);
        newlyReturnedBooks.push(loanedBooksDB[i]);
      }
    }

    /* === Filter returned books out of loanedBooksDB === */
    const booksStillOnLoan = loanedBooksDB.filter((bookInDB) => {
      return !(booksToReturn.id.includes(bookInDB.id));
    })

    sortDatabase(booksDB, "id");
    sortDatabase(booksStillOnLoan, "id");

    /* === Save returned books to booksDB === */
    fs.writeFile(booksDbPath, JSON.stringify(booksDB), (err) => {
      if (err) {
        console.log(err);
        res.writeHead(500);
        res.end(JSON.stringify({
          message: 'Internal Server Error. Could not save book to database.'
        }));
      }
    });

    /* === Save booksStillOnLoan to loanedBooksDB === */
    fs.writeFile(loanedBooksDbPath,
      JSON.stringify(booksStillOnLoan),
      (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(JSON.stringify({
            message: 'Internal Server Error. Could not save book to database.'
          }));
        }

        res.end(JSON.stringify(newlyReturnedBooks));
      });
  });
}

module.exports = {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  loanOutBooks,
  returnBooks
}
