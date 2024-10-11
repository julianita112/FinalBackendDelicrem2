const { Rol, Usuario, RolPermiso, Permiso } = require('../models');

exports.agregarRol = async (req, res) => {
    const { nombre,estado = 1, permisos } = req.body; // permisos es un array de IDs de permisos
    try {
        const rol = await Rol.create({ nombre, estado });

        for (let id_permiso of permisos) {
            await RolPermiso.create({ id_rol: rol.id_rol, id_permiso });
        }

        res.status(201).json(rol);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listarRoles = async (req, res) => {
    try {
        const roles = await Rol.findAll({
            include: [
                {
                    model: Permiso,
                    as: 'permisosRol',
                    through: { attributes: [] } // Esto excluye la tabla intermedia de los resultados
                }
            ]
        });
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerRolPorId = async (req, res) => {
    try {
        const rol = await Rol.findByPk(req.params.id, {
            include: [
                {
                    model: Permiso,
                    as: 'permisosRol',
                    through: { attributes: [] } // Esto excluye la tabla intermedia de los resultados
                }
            ]
        });
        if (!rol) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }
        res.json(rol);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerRolesActivos = async (req, res) => {
    try {
        const roles = await Rol.findAll({ where: { estado: true } });
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.editarRol = async (req, res) => {
    const { id } = req.params;
    const { nombre, permisos } = req.body;

    try {
        const rol = await Rol.findByPk(id);
        if (!rol) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        await rol.update({ nombre });

        if (Array.isArray(permisos)) {
            const permisoIds = permisos;

            // Obtener los permisos actuales del rol
            const permisosActuales = await RolPermiso.findAll({ where: { id_rol: id } });
            const permisoActualIds = permisosActuales.map(permiso => permiso.id_permiso);

            // Eliminar los permisos que no están en los nuevos IDs
            for (let permisoActual of permisosActuales) {
                if (!permisoIds.includes(permisoActual.id_permiso)) {
                    await permisoActual.destroy();
                }
            }

            // Crear o mantener los nuevos permisos
            for (let id_permiso of permisoIds) {
                if (!permisoActualIds.includes(id_permiso)) {
                    await RolPermiso.create({
                        id_rol: id,
                        id_permiso: id_permiso
                    });
                }
            }
        }

        res.status(200).json({ message: 'Rol actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.cambiarEstadoRol = async (req, res) => {
    try {
        const rol = await Rol.findByPk(req.params.id);
        if (!rol) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        rol.estado = !rol.estado;
        await rol.save();
        res.json(rol);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.eliminarRol = async (req, res) => {
    try {
        const rol = await Rol.findByPk(req.params.id);
        if (!rol) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        const usuariosAsociados = await Usuario.findAll({ where: { id_rol: rol.id_rol } });
        const permisosAsociados = await RolPermiso.findAll({ where: { id_rol: rol.id_rol } });

        if (usuariosAsociados.length > 0) {
            return res.status(400).json({
                error: 'No se puede eliminar el rol. Primero elimine los usuarios asociados.'
            });
        }

        if (permisosAsociados.length > 0) {
            return res.status(400).json({
                error: 'No se puede eliminar el rol. Primero elimine los permisos asociados.'
            });
        }

        await rol.destroy();
        res.json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
