require("dotenv").config();
const request = require("supertest");
const baseUrl = process.env.API_BASE_URL;

describe("Pruebas para JSONPlaceholder API", () => {
  test("GET /posts/1 -> Debe obtener los datos del post con ID 1", async () => {
    const response = await request(baseUrl)
      .get("/posts/1") // Hacemos un GET al endpoint específico
      .expect("Content-TypeEl Ciclo de Vida de una Prueba", /json/) // Verificamos que la respuesta sea un JSON
      .expect(200); // Verificamos que el código de estado sea 200 (OK)

    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("userId");
    expect(response.body).toHaveProperty("id", 1); // Verificamos que la propiedad 'id' sea igual a 1
  });
});
