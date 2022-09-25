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

/* === Books route buttons === */
const get_all_books = document.getElementById("get-all-books");
const add_book = document.getElementById("add-book");
const update_book = document.getElementById("update-book");
const delete_book = document.getElementById("delete-book");
const loan_book = document.getElementById("loan-books");
const return_book = document.getElementById("return-books");


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
    "user": {
      "email": "udodavidcontact@gmail.com",
      "password": "davidudo"
    },
    "data": {
      "title": "The Design of Everyday Things",
      "author": "Don Norman",
      "year": 2014
    }
  }

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
    "user": {
      "email": "udodavidcontact@gmail.com",
      "password": "davidudo"
    },
    "data": {
      "title": "The Design of Everyday Things",
      "author": "Don Norman",
      "year": 1999,
      "id": 3
    }
  }

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
  const data = {
    "user": {
      "email": "udodavidcontact@gmail.com",
      "password": "davidudo"
    },
    "data": {}
  }

  fetch('http://localhost:8000/books/6', {
    method: 'DELETE',
    body: JSON.stringify(data),
  })
  .then((response) => response.json()).then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

/* === Loan Books === */
loan_book.addEventListener("click", () => {
  // Data to be sent to the database
  const data = {
    "user": {
      "email": "udodavidcontact@gmail.com",
      "password": "davidudo"
    },
    "data": {}
  }

  fetch('http://localhost:8000/books/loanrequest/1', {
    method: 'PUT',
    headers: {
      accept: 'application/json',
    },
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
return_book.addEventListener("click", () => {
  // Data to be sent to the database
  const data = {
    "user": {
      "email": "udodavidcontact@gmail.com",
      "password": "davidudo"
    },
    "data": {}
  }

  fetch('http://localhost:8000/books/returnbook/4', {
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


/* ===================================== */
/* === Users Route Method Functions === */
/* =================================== */

/* === Get All Users === */
get_all_users.addEventListener("click", () => {
  // Data to be sent to the database
  const data = {
    "user": {
      "email": "udodavidcontact@gmail.com",
      "password": "davidudo"
    },
    "data": {}
  }

  fetch("http://localhost:8000/users", {
    method: 'GET',
    body: JSON.stringify(data),
  })
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
    "user": {
      "email": "udodavidcontact@gmail.com",
      "password": "davidudo"
    },
    "data": {
      "name": "David Udo",
      "email": "udodavid46.ud@gmail.com",
      "gender": "Male",
      "password": "udini_one"
    }
  }

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