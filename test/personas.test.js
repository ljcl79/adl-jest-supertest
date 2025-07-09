const request = require("supertest");
const { app, server } = require("../app"); // Importamos la app de Express y el servidor
const fs = require("fs/promises");
const path = require("path");

// Construimos la ruta a nuestra "base de datos"
const dbPath = path.join(__dirname, "../data", "database.json");

// Variable para guardar el estado inicial de la base de datos
let initialData;

// =============================================================================
// == CICLO DE VIDA DE LAS PRUEBAS (SETUP Y TEARDOWN)
// =============================================================================
beforeAll(async () => {
  // 1. Antes de todas las pruebas, leemos el estado original de la BBDD.
  console.log("--- [beforeAll] Leyendo estado inicial de la BBDD ---");
  const data = await fs.readFile(dbPath, "utf8");
  initialData = JSON.parse(data);
});

afterEach(async () => {
  // 2. Después de CADA prueba, restauramos la BBDD a su estado original.
  // Esto garantiza que las pruebas sean independientes (aislamiento).
  console.log("--- [afterEach] Restaurando la BBDD ---");
  await fs.writeFile(dbPath, JSON.stringify(initialData, null, 2));
});

afterAll((done) => {
  // 3. Al final de todo, cerramos el servidor para que Jest no se quede colgado.
  console.log("--- [afterAll] Cerrando servidor ---");
  server.close(done);
});

// =============================================================================
// == SUITE DE PRUEBAS PARA EL CRUD DE PERSONAS
// =============================================================================
describe("API de Personas", () => {
  // PRUEBAS PARA GET
  describe("GET /personas", () => {
    it("debe devolver todas las personas y un estado 200", async () => {
      const response = await request(app).get("/personas").expect(200);

      // Verificamos que la respuesta es un array y tiene la longitud correcta
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(initialData.length);
    });

    it("debe devolver una persona por ID y un estado 200", async () => {
      const response = await request(app).get("/personas/1").expect(200);

      expect(response.body.id).toBe("1");
      expect(response.body.nombre).toBe("Ana");
    });

    it("debe devolver un estado 404 si la persona no existe", async () => {
      await request(app).get("/personas/999").expect(404);
    });
  });

  // PRUEBAS PARA POST
  describe("POST /personas", () => {
    it("debe crear una nueva persona y devolver un estado 201", async () => {
      const nuevaPersona = {
        nombre: "Carlos",
        apellido: "Solis",
        edad: 40,
      };

      const response = await request(app)
        .post("/personas")
        .send(nuevaPersona)
        .expect(201);

      // Verificamos que la respuesta tenga los datos enviados y un ID
      expect(response.body.id).toBeDefined();
      expect(response.body.nombre).toBe(nuevaPersona.nombre);
    });

    it("debe devolver un estado 400 si faltan datos", async () => {
      const personaIncompleta = { nombre: "Incompleto" };
      await request(app).post("/personas").send(personaIncompleta).expect(400);
    });
  });

  // PRUEBAS PARA PUT
  describe("PUT /personas/:id", () => {
    it("debe actualizar una persona existente y devolver un estado 200", async () => {
      const datosActualizados = { edad: 35 };

      const response = await request(app)
        .put("/personas/2")
        .send(datosActualizados)
        .expect(200);

      expect(response.body.id).toBe("2");
      expect(response.body.edad).toBe(35);
      expect(response.body.nombre).toBe("Luis"); // El nombre no debería cambiar
    });
  });

  // PRUEBAS PARA DELETE
  describe("DELETE /personas/:id", () => {
    it("debe eliminar una persona y devolver un estado 204", async () => {
      await request(app).delete("/personas/1").expect(204);

      // Verificamos que la persona ya no existe
      await request(app).get("/personas/1").expect(404);
    });
  });
});
