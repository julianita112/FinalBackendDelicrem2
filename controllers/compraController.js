const { Compra, DetalleCompra, Proveedor, Insumo } = require('../models'); // Importa los modelos necesarios

exports.listarCompras = async (req, res) => {
    try {
        const compras = await Compra.findAll({
            include: [
                {
                    model: Proveedor,
                    as: 'proveedorCompra',
                },
                {
                    model: DetalleCompra,
                    as: 'detalleComprasCompra',
                }
            ]
        });
        res.json(compras);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Otros métodos CRUD para Compra
exports.registrarCompra = async (req, res) => {
    const { id_proveedor, fecha_compra, numero_recibo, fecha_registro, id_estado = 1, total, detalleCompras } = req.body;
    
    try {
        const compra = await Compra.create({ id_proveedor, fecha_compra, numero_recibo, fecha_registro, id_estado, total, });

        for (let detalle of detalleCompras) {
            const detalleCompra = await DetalleCompra.create({ ...detalle, id_compra: compra.id_compra });

            // Obtener el insumo y verificar la unidad de medida
            const insumo = await Insumo.findByPk(detalle.id_insumo);
            if (insumo) {
                let cantidadActualizada = detalle.cantidad;

                // Realizar la conversión según la unidad de medida del insumo
                if (insumo.unidad_medida === 'Mililitros') {
                    // Convertir litros a mililitros
                    cantidadActualizada = detalle.cantidad * 1000; // 1 litro = 1000 mililitros
                } else if (insumo.unidad_medida === 'Gramos') {
                    // Convertir kilogramos a gramos
                    cantidadActualizada = detalle.cantidad * 1000; // 1 kilogramo = 1000 gramos
                }
                // Si la unidad es 'unidad', no se necesita conversión

                // Actualizar el stock del insumo con la cantidad convertida
                insumo.stock_actual += cantidadActualizada;
                await insumo.save();
            } else {
                return res.status(404).json({ error: `Insumo no encontrado: ${detalle.id_insumo}` });
            }
        }

        res.status(201).json(compra);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.obtenerCompraPorId = async (req, res) => {
    try {
        const compra = await Compra.findByPk(req.params.id, {
            include: [
                {
                    model: Proveedor,
                    as: 'proveedorCompra',
                },
                {
                    model: DetalleCompra,
                    as: 'detalleComprasCompra',
                }
            ]
        });
        if (!compra) {
            return res.status(404).json({ error: 'Compra no encontrada' });
        }
        res.json(compra);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarCompra = async (req, res) => {
    try {
        const compra = await Compra.update(req.body, { where: { id_compra: req.params.id } });
        res.json(compra);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Otros métodos CRUD para Compra
// Actualizar el estado de una compra (Activar/Anular)
exports.anularCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_estado, motivo_anulacion } = req.body;

        console.log("Datos recibidos:", { id_estado, motivo_anulacion });  // Log para depuración

        const compra = await Compra.findByPk(id);
        if (!compra) {
            return res.status(404).json({ error: 'Compra no encontrada' });
        }

        // Verificar si la compra ya está anulada
        if (compra.id_estado === 5) {
            return res.status(400).json({ error: 'La compra ya está anulada y no se puede volver a anular.' });
        }

        // Verificar si se proporciona el id_estado correcto
        if (id_estado !== 5) {
            return res.status(400).json({ error: 'El id_estado proporcionado no es válido para anulación.' });
        }

        // Verificar que se proporcione el motivo de anulación
        if (!motivo_anulacion || motivo_anulacion.trim() === '') {
            return res.status(400).json({ error: 'Debe proporcionar un motivo de anulación.' });
        }

        // Actualizar el estado y el motivo de anulación
        compra.id_estado = id_estado;
        compra.motivo_anulacion = motivo_anulacion;
        await compra.save();

        res.json(compra);
    } catch (error) {
        console.error("Error en el controlador:", error.message);
        res.status(500).json({ error: error.message });
    }
};





exports.eliminarCompra = async (req, res) => {
    try {
        await Compra.destroy({ where: { id_compra: req.params.id } });
        res.json({ message: 'Compra eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
