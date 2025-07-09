const express = require("express");
const router = express.Router();
const controller = require("../controllers/persona.controller");

// Obtener todas las personas
router.get("/", controller.getAllPersonas);

// Obtener una persona por ID
router.get("/:id", controller.getPersonaById);

// Crear una nueva persona
router.post("/", controller.createPersona);

// Actualizar una persona por ID
router.put("/:id", controller.updatePersona);

// Borrar una persona por ID
router.delete("/:id", controller.deletePersona);

module.exports = router;
