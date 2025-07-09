// Cargar variables de entorno del archivo .env
require("dotenv").config();

const request = require("supertest");

// Objeto para compartir estado entre las pruebas (el ID del post creado)
const testData = {};

describe("Pruebas de Flujo Completo para Posts en JSONPlaceholder", () => {
  //=================================
  // HOOKS DE SETUP Y TEARDOWN
  //=================================

  beforeAll(() => {
    // Se ejecuta UNA VEZ antes de todas las pruebas de esta suite.
    // Ideal para la configuración inicial y pesada.
    console.log("🚀 [beforeAll] Iniciando la suite de pruebas de Posts...");

    // Verificamos que la URL base esté disponible
    if (!process.env.API_BASE_URL) {
      throw new Error("No se encontró API_BASE_URL en el archivo .env");
    }

    // Instanciamos el cliente de Supertest una sola vez
    testData.api = request(process.env.API_BASE_URL);
  });

  afterAll(() => {
    // Se ejecuta UNA VEZ después de que todas las pruebas de esta suite hayan terminado.
    // Ideal para la limpieza final.
    console.log(
      "✅ [afterAll] Suite de pruebas de Posts finalizada. Limpiando..."
    );
  });

  beforeEach(() => {
    // Se ejecuta ANTES DE CADA prueba ('it' block).
    // Ideal para resetear datos o mocks.
    const testName = expect.getState().currentTestName;
    console.log(
      `\n▶️  [beforeEach] Preparando para ejecutar la prueba: "${testName}"`
    );
  });

  afterEach(() => {
    // Se ejecuta DESPUÉS DE CADA prueba.
    // Ideal para limpieza específica de cada test.
    console.log("✔️  [afterEach] Prueba completada.");
  });

  //=================================
  // CASOS DE PRUEBA
  //=================================

  test("Paso 1: Debe CREAR un nuevo post (POST /posts)", async () => {
    const newPost = {
      title: "Mi Post de Prueba",
      body: "Este es el cuerpo de mi post. ",
      userId: 1,
    };

    const response = await testData.api
      .post("/posts")
      .send(newPost)
      .expect("Content-Type", /json/)
      .expect(201); // 201 Created

    // Verificamos que la respuesta contenga los datos que enviamos
    expect(response.body).toBeDefined();
    expect(response.body.title).toBe(newPost.title);

    // Guardamos el ID del post "creado" para usarlo en las siguientes pruebas
    // JSONPlaceholder siempre devuelve 101 para nuevos posts
    testData.newPostId = response.body.id;
    console.log(`   -> Post creado con ID: ${testData.newPostId}`);
    //La API pierde los datos por eso cambiamos a un id que siempre existe
    testData.newPostId = 1;
  });

  test("Paso 2: Debe LEER el post recién creado (GET /posts/:id)", async () => {
    if (!testData.newPostId) {
      // Si el paso anterior falló, saltamos esta prueba
      return pending("Se necesita un ID de post del paso anterior.");
    }

    const response = await testData.api
      .get(`/posts/${testData.newPostId}`)
      .expect(200);

    expect(response.body.id).toBe(testData.newPostId);
    console.log(`   -> Post con ID ${testData.newPostId} leído correctamente.`);
  });

  test("Paso 3: Debe ACTUALIZAR el post (PUT /posts/:id)", async () => {
    if (!testData.newPostId) {
      return pending("Se necesita un ID de post del paso anterior.");
    }

    const updatedData = {
      title: "Mi Post de Prueba (Actualizado)",
      body: "El cuerpo ha sido actualizado.",
    };

    const response = await testData.api
      .put(`/posts/${testData.newPostId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.title).toBe(updatedData.title);
    console.log(`   -> Post con ID ${testData.newPostId} actualizado.`);
  });

  test("Paso 4: Debe BORRAR el post (DELETE /posts/:id)", async () => {
    if (!testData.newPostId) {
      return pending("Se necesita un ID de post del paso anterior.");
    }

    await testData.api.delete(`/posts/${testData.newPostId}`).expect(200);

    console.log(`   -> Post con ID ${testData.newPostId} "borrado".`);
  });
});
