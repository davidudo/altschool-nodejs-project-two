const supertest = require("supertest");
const server = require("../../index.js");
const {
  resetDb
} = require("../fixtures/test_utils.js");

beforeEach(() => {
  resetDb();
})

afterAll(() => {
  resetDb();
})

describe("Book Route", () => {
  it("GET /books works", async () => {
    const response = await supertest(server).get("/books");
    expect(response.headers["content-type"]).toBe("application/json");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(5);
  });
  
  it("POST /books works", async () => {
    const bodyData = {
      "user": {
        "email": "udodavidcontact@gmail.com",
        "password": "davidudo"
      },
      "data": {
        "title": "New test book",
        "author": "David Udo",
        "year": 2022
      }
    }
    const response = await supertest(server).post("/books").send(bodyData)
    expect(response.headers["content-type"]).toBe("application/json")
    expect(response.status).toBe(201)
    expect(response.body.title).toBe("New test book")
    expect(response.body.author).toBe("David Udo")
    expect(response.body.year).toBe(2022)
  })

  it("PUT /books works", async () => {
    const bodyData = {
      "user": {
        "email": "udodavidcontact@gmail.com",
        "password": "davidudo"
      },
      "data": {
        "title": "The Design of Everyday Things",
        "author": "David Udo",
        "year": 2022,
        "id": 5
      }
    }
    const response = await supertest(server).put("/books").send(bodyData);
    expect(response.headers["content-type"]).toBe("application/json");
    expect(response.status).toBe(201);
    expect(response.body.title).toBe("The Design of Everyday Things");
  })

  it("DELETE /books/id works", async () => {
    const bodyData = {
      "user": {
        "email": "udodavidcontact@gmail.com",
        "password": "davidudo"
      },
      "data": {}
    }
    const response = await supertest(server).delete("/books/5").send(bodyData);
    expect(response.headers["content-type"]).toBe("application/json");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Book successfully deleted!");
  });
  
  it("PUT /books/loanrequest/id works", async () => {
    const bodyData = {
      "user": {
        "email": "udodavidcontact@gmail.com",
        "password": "davidudo"
      },
      "data": {}
    }
    const response = await supertest(server).put("/books/loanrequest/4").send(bodyData);
    expect(response.headers["content-type"]).toBe("application/json");
    expect(response.status).toBe(201);
    expect(response.body.isBookOnLoan).toBe(true);
  });
  
  it("PUT /books/returnbooks/id works", async () => {
    const bodyData = {
      "user": {
        "email": "udodavidcontact@gmail.com",
        "password": "davidudo"
      },
      "data": {}
    }
    const response = await supertest(server).put("/books/returnbooks/4").send(bodyData);
    expect(response.headers["content-type"]).toBe("application/json");
    expect(response.status).toBe(201);
    expect(response.body.isBookOnLoan).toBe(false);
  });
});