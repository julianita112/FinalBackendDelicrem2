const { Insumo, DetalleFichaTecnica, DetalleCompra, CategoriaInsumo } = require('../models');

exports.listarInsumos = async (req, res) => {
    try {
        const insumos = await Insumo.findAll({
            include: { model: CategoriaInsumo, as: 'categoriaInsumo' }
        });
        res.json(insumos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.agregarInsumo = async (req, res) => {
    const { nombre, stock_actual, unidad_medida, id_categoria, estado = true } = req.body;
    try {
        const insumo = await Insumo.create({ nombre, stock_actual, unidad_medida, id_categoria, estado });
        res.status(201).json(insumo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerInsumoPorId = async (req, res) => {
    try {
        const insumo = await Insumo.findByPk(req.params.id, {
            include: { model: CategoriaInsumo, as: 'categoriaInsumo' }
        });
        if (!insumo) {
            return res.status(404).json({ error: 'Insumo no encontrado' });
        }
        res.json(insumo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerInsumosActivos = async (req, res) => {
    try {
        const insumos = await Insumo.findAll({ where: { estado: true } });
        res.json(insumos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.cambiarEstadoInsumo = async (req, res) => {
    try {
        const insumo = await Insumo.findByPk(req.params.id);
        if (!insumo) {
            return res.status(404).json({ error: 'Insumo no encontrado' });
        }

        insumo.estado = !insumo.estado;
        await insumo.save();
        res.json(insumo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.editarInsumo = async (req, res) => {
    try {
        const insumo = await Insumo.update(req.body, { where: { id_insumo: req.params.id } });
        res.json(insumo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.eliminarInsumo = async (req, res) => {
    try {
        const insumo = await Insumo.findByPk(req.params.id);
        if (!insumo) {
            return res.status(404).json({ error: 'Insumo no encontrado' });
        }

        const detallesFichaTecnicaAsociados = await DetalleFichaTecnica.findAll({ where: { id_insumo: insumo.id_insumo } });
        const detallesCompraAsociados = await DetalleCompra.findAll({ where: { id_insumo: insumo.id_insumo } });

        if (detallesFichaTecnicaAsociados.length > 0) {
            return res.status(400).json({ 
                error: 'No se puede eliminar el insumo. Primero elimine los detalles de ficha técnica asociados.' 
            });
        }

        if (detallesCompraAsociados.length > 0) {
            return res.status(400).json({ 
                error: 'No se puede eliminar el insumo. Primero elimine los detalles de compra asociados.' 
            });
        }

        await insumo.destroy();
        res.json({ message: 'Insumo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
