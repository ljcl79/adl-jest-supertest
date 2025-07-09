const express = require("express");
const personaRoutes = require("./routes/persona.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para que Express entienda JSON en el cuerpo de las peticiones
app.use(express.json());

// Ruta base para las personas
app.use("/personas", personaRoutes);

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API de Personas!");
});

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Exportamos app y server para las pruebas
module.exports = { app, server };
