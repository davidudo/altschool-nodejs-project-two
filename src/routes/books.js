/** ================================================== *
* =================================================== *
* This is the file contains all the book route method
* functions
* =================================================== *
* =================================================== */

const fs = require('fs');

/* ==== Import users and books database ==== */
const {
  booksDbPath
} = require("../../db/index.js");

/* ==== Initialise empty array for database ==== */
//let booksDB = [];

/* ===== Add books DB content to booksDB variable ===== */
let booksDB = JSON.parse(fs.readFileSync(booksDbPath, 'utf8'));


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
    
    res.writeHead(200);
    res.end(books);
  })
}

/* ======================= */
/* ===== Add A Book ===== */
/* ===================== */
const addBook = function (req, res, newBook) {
  /* === Add the new book to the end of the existing books array === */
  fs.readFile(booksDbPath,
    "utf8",
    (err, books) => {
      if (err) {
        console.log(err)
        res.writeHead(400)
        res.end("An error occured")
      }
      
      /* === Make loan status of newbook false === */
      newBook.isBookOnLoan = false;
      
      /* === Get ID of last book in the database === */
      const lastBook = booksDB[booksDB.length - 1];
      const lastBookId = lastBook.id;
      newBook.id = lastBookId + 1;

      const oldBooks = JSON.parse(books);
      const allBooks = [...oldBooks,
        newBook];

      fs.writeFile(booksDbPath, JSON.stringify(allBooks), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(JSON.stringify({
            message: 'Internal Server Error. Could not save book to database.'
          }));
        }
        
        res.writeHead(201);
        res.end(JSON.stringify(newBook));
      });
    })
}

/* ========================== */
/* ===== Update A Book ===== */
/* ======================== */
const updateBook = function (req, res, updateBook
) {
  const detailsToUpdate = updateBook
  const bookId = detailsToUpdate.id

  /* === Update book === */
  fs.readFile(booksDbPath, "utf8", (err,
    books) => {
    if (err) {
      console.log(err);
      res.writeHead(400);
      res.end("An error occured");
    }

    const booksObj = JSON.parse(books);

    /* === Check if book is in database === */
    const bookIndex = booksObj.findIndex(book => book.id === bookId);

    /* === If the book is not in database === */
    if (bookIndex === -1) {
      res.writeHead(404)
      res.end(JSON.stringify({
        message: "Book with the specified id not found!"
      }))
      return
    }

    /* === Update the book in database === */
    const updatedBook = {
      ...booksObj[bookIndex],
      ...detailsToUpdate
    }
    booksObj[bookIndex] = updatedBook;

    fs.writeFile(booksDbPath, JSON.stringify(booksObj), (err) => {
      if (err) {
        console.log(err);
        res.writeHead(500);
        res.end(JSON.stringify({
          message: 'Internal Server Error. Could not save book to database.'
        }));
      }
      
      res.writeHead(201);
      res.end(JSON.stringify(updatedBook));
    });
  })
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
    
    res.writeHead(200);
    res.end(JSON.stringify({
      message: 'Book successfully deleted!'
    }));
  });

}

/* ========================= */
/* ===== Loan Request ===== */
/* ======================= */
const loanRequest = function (req, res) {
  /* ==== Get ID from URL ==== */
  const bookId = req.url.split('/')[3];

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

  let bookToLoan = booksDB[bookIndex];

  /* === Get the book's loan status === */
  let {
    isBookOnLoan
  } = bookToLoan;

  /* ==== Check if book has been loaned already ==== */
  if (isBookOnLoan === true) {
    res.writeHead(404);
    res.end(JSON.stringify({
      message: 'This book has already been loaned out!'
    }));

    return;
  }

  /* === Update the book loan status === */
  bookToLoan.isBookOnLoan = true;

  /* === Save to DB === */
  fs.writeFile(booksDbPath, JSON.stringify(booksDB), (err) => {
    if (err) {
      console.log(err);
      res.writeHead(500);
      res.end(JSON.stringify({
        message: 'Internal Server Error. Could not update book in database.'
      }));
    }
    res.writeHead(201);
    res.end(JSON.stringify(bookToLoan));
  });
}

/* ========================= */
/* ===== Return Books ===== */
/* ======================= */
const returnBook = function (req, res) {
  /* ==== Get ID from URL ==== */
  const bookId = req.url.split('/')[3];

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

  let bookToReturn = booksDB[bookIndex];

  /* === Get the book's loan status === */
  let {
    isBookOnLoan
  } = bookToReturn;

  /* ==== Check if book has been loaned already ==== */
  if (isBookOnLoan === false) {
    res.writeHead(404);
    res.end(JSON.stringify({
      message: 'This book has already been returned!'
    }));

    return;
  }

  /* === Update the book loan status === */
  bookToReturn.isBookOnLoan = false;

  /* === Save to DB === */
  fs.writeFile(booksDbPath, JSON.stringify(booksDB), (err) => {
    if (err) {
      console.log(err);
      res.writeHead(500);
      res.end(JSON.stringify({
        message: 'Internal Server Error. Could not update book in database.'
      }));
    }
    
    res.writeHead(201);
    res.end(JSON.stringify(bookToReturn));
  });
}

module.exports = {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  loanRequest,
  returnBook
}