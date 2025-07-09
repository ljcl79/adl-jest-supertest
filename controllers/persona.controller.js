const Persona = require("../models/persona.model");
const { v4: uuidv4 } = require("uuid");

const getAllPersonas = async (req, res) => {
  try {
    const personas = await Persona.findAll();
    res.json(personas);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const getPersonaById = async (req, res) => {
  try {
    const persona = await Persona.findById(req.params.id);
    if (!persona) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }
    res.json(persona);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const createPersona = async (req, res) => {
  try {
    const { nombre, apellido, edad } = req.body;
    if (!nombre || !apellido || edad === undefined) {
      return res
        .status(400)
        .json({ message: "Faltan datos requeridos (nombre, apellido, edad)" });
    }
    const newPersona = { id: uuidv4(), nombre, apellido, edad };
    const createdPersona = await Persona.create(newPersona);
    res.status(201).json(createdPersona);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const updatePersona = async (req, res) => {
  try {
    const updatedPersona = await Persona.update(req.params.id, req.body);
    if (!updatedPersona) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }
    res.json(updatedPersona);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const deletePersona = async (req, res) => {
  try {
    const deleted = await Persona.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  getAllPersonas,
  getPersonaById,
  createPersona,
  updatePersona,
  deletePersona,
};
