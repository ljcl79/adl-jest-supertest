const request = require("supertest");

describe("API Tests", () => {
  test("GET /posts should return 200", async () => {
    const response = await request("https://jsonplaceholder.typicode.com")
      .get("/posts/1")
      .expect(200);
  });
});
