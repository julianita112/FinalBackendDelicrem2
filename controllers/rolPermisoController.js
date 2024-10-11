// controllers/rolPermisoController.js
const { RolPermiso } = require('../models');

exports.asignarPermiso = async (req, res) => {
    const { id_rol, id_permiso } = req.body;
    try {
        const rolPermiso = await RolPermiso.create({ id_rol, id_permiso });
        res.status(201).json(rolPermiso);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarPermisoDeRol = async (req, res) => {
    try {
        const rolPermiso = await RolPermiso.findOne({ 
            where: { id_rol: req.params.id_rol, id_permiso: req.params.id_permiso }
        });
        if (!rolPermiso) {
            return res.status(404).json({ error: 'Permiso no encontrado en el rol' });
        }
        await rolPermiso.update(req.body);
        res.json(rolPermiso);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerPermisosPorRol = async (req, res) => {
    try {
        const permisos = await RolPermiso.findAll({ where: { id_rol: req.params.id } });
        res.json(permisos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.eliminarPermisoDeRol = async (req, res) => {
    try {
        const rolPermiso = await RolPermiso.findOne({ 
            where: { id_rol: req.params.id_rol, id_permiso: req.params.id_permiso }
        });
        if (!rolPermiso) {
            return res.status(404).json({ error: 'Permiso no encontrado en el rol' });
        }
        await rolPermiso.destroy();
        res.json({ message: 'Permiso eliminado del rol correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


