const { Estado } = require('../models');

exports.crearEstado = async (req, res) => {
    const { nombre_estado } = req.body;
    try {
        const estado = await Estado.create({ nombre_estado });
        res.status(201).json(estado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerEstados = async (req, res) => {
    try {
        const estados = await Estado.findAll();
        res.json(estados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerEstadoPorId = async (req, res) => {
    try {
        const estado = await Estado.findByPk(req.params.id);
        if (!estado) {
            return res.status(404).json({ error: 'Estado no encontrado' });
        }
        res.json(estado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};