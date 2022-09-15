/**
* This JavaScript file contains functions that interacts
* with the books and users API, here I demonstrated how
* each route should be interacted with. Remember you have
* to start the server using (npm run start:dev) in your
* terminal before you can be able to interact with the
* API.
* 
* NOTE: Some functions are not working because I haven't
* been able to find a way to set the CORS for headers, 
* and methods like PUT and DELETE.
* */

/* =============================== */
/* === Get all action buttons === */
/* ============================= */

/* === Users route buttons === */
const get_all_users = document.getElementById("get-all-users");
const create_user = document.getElementById("create-user");
const authenticate_user = document.getElementById("authenticate-user");

/* === Books route buttons === */
const get_all_books = document.getElementById("get-all-books");
const add_book = document.getElementById("add-book");
const update_book = document.getElementById("update-book");
const delete_book = document.getElementById("delete-book");
const loan_books = document.getElementById("loan-books");
const return_books = document.getElementById("return-books");


/* ===================================== */
/* === Books Route Method Functions === */
/* =================================== */

/* === Get All Books === */
get_all_books.addEventListener("click", () => {
  fetch("http://localhost:8000/books")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  })
});

/* === Add Book === */
add_book.addEventListener("click", () => {
  // Data to be sent to the database
  const data = {
    title: "Things fall apart",
    author: "Chinua Achebe",
    year: 2000,
  };

  fetch('http://localhost:8000/books', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  .then((response) => response.json()).then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

/* === Update Book (*Not functioning) === */
update_book.addEventListener("click", () => {
  // Data to be sent to the database
  const data = {
    title: "Things fall apart",
    author: "David Udo",
    year: 2000,
    id: 6
  };

  fetch('http://localhost:8000/books', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  .then((response) => response.json()).then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

/* === Delete Book (*Not Functioning) === */
delete_book.addEventListener("click", () => {
  const id = 6;

  fetch('http://localhost:8000/books/6', {
    method: 'DELETE'
  })
  .then((response) => response.json()).then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

/* === Loan Books === */
loan_books.addEventListener("click", () => {
  // Data to be sent to the database
  const data = {
    id: [1, 2, 3]
  };

  fetch('http://localhost:8000/books/loanout', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  .then((response) => response.json()).then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

/* === Return Books === */
return_books.addEventListener("click", () => {
  // Data to be sent to the database
  const data = {
    id: [1, 2, 3]
  };

  fetch('http://localhost:8000/books/returnbooks', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  .then((response) => response.json()).then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});


/* ===================================== */
/* === Users Route Method Functions === */
/* =================================== */

/* === Get All Users === */
get_all_users.addEventListener("click", () => {
  fetch("http://localhost:8000/users")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  })
});

/* === Create User === */
create_user.addEventListener("click", () => {
  // Data to be sent to the database
  const data = {
    name: "David Udo",
    email: "udodavidcontact@gmail.com",
    gender: "Male",
    password: "davidudo"
  };

  fetch('http://localhost:8000/users', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  .then((response) => response.json()).then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

/* === Authenticate User === */
authenticate_user.addEventListener("click", () => {
  // Data to be sent to the database
  const data = {
    email: "udodavidcontact@gmail.com",
    password: "davidudo"
  };

  fetch('http://localhost:8000/authenticateUser', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  .then((response) => response.json()).then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});
