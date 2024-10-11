const { Permiso } = require('../models');
const { RolPermiso } = require('../models');

exports.crearPermiso = async (req, res) => {
    const { nombre_permiso, descripcion } = req.body;
    try {
        const permiso = await Permiso.create({ nombre_permiso, descripcion });
        res.status(201).json(permiso);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerPermisos = async (req, res) => {
    try {
        const permisos = await Permiso.findAll();
        res.json(permisos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerPermisoPorId = async (req, res) => {
    try {
        const permiso = await Permiso.findByPk(req.params.id);
        if (!permiso) {
            return res.status(404).json({ error: 'Permiso no encontrado' });
        }
        res.json(permiso);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarPermiso = async (req, res) => {
    try {
        const permiso = await Permiso.update(req.body, { where: { id_permiso: req.params.id } });
        res.json(permiso);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.eliminarPermiso = async (req, res) => {
    try {
        const permiso = await Permiso.findByPk(req.params.id);
        if (!permiso) {
            return res.status(404).json({ error: 'Permiso no encontrado' });
        }

        const rolesAsociados = await RolPermiso.findAll({ where: { id_permiso: permiso.id_permiso } });

        if (rolesAsociados.length > 0) {
            return res.status(400).json({ 
                error: 'No se puede eliminar el permiso. Primero elimine los roles asociados.' 
            });
        }

        await permiso.destroy();
        res.json({ message: 'Permiso eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
