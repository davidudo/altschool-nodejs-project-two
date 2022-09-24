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

describe("Use Route", () => {
  it("GET /users works", async () => {
    const bodyData = {
      "user": {
        "email": "udodavidcontact@gmail.com",
        "password": "davidudo"
      },
      "data": {}
    }
    
    const response = await supertest(server).get("/users").send(bodyData);
    expect(response.headers["content-type"]).toBe("application/json");
    console.log(response.body)
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(5);
  });
  
  /*it("POST /books works", async () => {
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
  })*/
});