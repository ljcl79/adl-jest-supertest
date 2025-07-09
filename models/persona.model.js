const fs = require("fs/promises");
const path = require("path");

const dbPath = path.join(__dirname, "../data", "database.json");

// Función auxiliar para leer la base de datos
const readDB = async () => {
  try {
    const data = await fs.readFile(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe o hay otro error, devolver un array vacío
    return [];
  }
};

// Función auxiliar para escribir en la base de datos
const writeDB = async (data) => {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
};

const Persona = {
  findAll: async () => {
    return await readDB();
  },

  findById: async (id) => {
    const personas = await readDB();
    return personas.find((p) => p.id === id);
  },

  create: async (newPersona) => {
    const personas = await readDB();
    personas.push(newPersona);
    await writeDB(personas);
    return newPersona;
  },

  update: async (id, updatedData) => {
    let personas = await readDB();
    const index = personas.findIndex((p) => p.id === id);
    if (index === -1) {
      return null; // No encontrado
    }
    personas[index] = { ...personas[index], ...updatedData };
    await writeDB(personas);
    return personas[index];
  },

  remove: async (id) => {
    let personas = await readDB();
    const initialLength = personas.length;
    personas = personas.filter((p) => p.id !== id);
    if (personas.length === initialLength) {
      return null; // No encontrado, nada que borrar
    }
    await writeDB(personas);
    return { id }; // Devuelve el id del objeto borrado
  },
};

module.exports = Persona;
