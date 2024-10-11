const { Venta, DetalleVenta, Producto, Insumo, Cliente, FichaTecnica, DetalleFichaTecnica, Estado } = require('../models');

const agregarVenta = async (req, res) => {
    const { numero_venta, id_cliente, fecha_venta, fecha_entrega, id_estado =2, detalleVentas, total } = req.body;

    // Generar un número de venta único si no se proporciona
    const numeroVenta = numero_venta || 'VENTA-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    try {
        const venta = await Venta.create({ numero_venta: numeroVenta, id_cliente, fecha_venta, fecha_entrega, id_estado, total, });

        for (let detalle of detalleVentas) {
            const producto = await Producto.findByPk(detalle.id_producto);
            if (producto) {
                await DetalleVenta.create({ ...detalle, id_venta: venta.id_venta });
            } else {
                return res.status(404).json({ error: `Producto no encontrado: ${detalle.id_producto}` });
            }
        }

        res.status(201).json(venta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const cambiarEstadoDeProduccionVenta = async (req, res) => {
    const id_venta = req.params.id;
    const { estado } = req.body;

    try {
        const venta = await Venta.findByPk(id_venta, {
            include: [{ model: DetalleVenta, as: 'detalles' }]
        });

        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }


        venta.estado = estado;
        await venta.save();
        res.status(200).json(venta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerVentasActivas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({ where: { activo: 1 } });
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const anularVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_estado, motivo_anulacion } = req.body;

        console.log("Datos recibidos:", { id_estado, motivo_anulacion });  // Log para depuración

        const venta = await Venta.findByPk(id);
        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        // Solo permitir anular si id_estado no es 1 ni 5
        if (venta.id_estado === 1 || venta.id_estado === 5) {
            return res.status(400).json({ error: 'No se puede anular una venta en este estado.' });
        }

        // Verificar que se proporcione el motivo de anulación
        if (!motivo_anulacion || motivo_anulacion.trim() === '') {
            return res.status(400).json({ error: 'Debe proporcionar un motivo de anulación.' });
        }

        // Verificar que el id_estado proporcionado sea 5 (Anulada)
        if (id_estado !== 5) {
            return res.status(400).json({ error: 'El id_estado proporcionado no es válido para anulación.' });
        }

        // Actualizar el estado y el motivo de anulación
        venta.id_estado = id_estado;
        venta.motivo_anulacion = motivo_anulacion;
        await venta.save();

        res.json(venta);
    } catch (error) {
        console.error("Error en el controlador:", error.message);
        res.status(500).json({ error: error.message });
    }
};



const listarVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            include: [
                {
                    model: DetalleVenta,
                    as: 'detalles',
                },
                {
                    model: Cliente,
                    as: 'cliente'
                }
            ]
        });
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const obtenerVentaPorId = async (req, res) => {
    try {
        const venta = await Venta.findByPk(req.params.id, {
            include: [
                {
                    model: DetalleVenta,
                    as: 'detalles',
                },
                {
                    model: Cliente,
                    as: 'cliente',
                }
            ]
        });
        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        res.json(venta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarVenta = async (req, res) => {
    const { id } = req.params;
    const { id_cliente, fecha_venta, estado, pagado, detalleVentas } = req.body;

    try {
        const venta = await Venta.findByPk(id);

        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        await venta.update({ id_cliente, fecha_venta, estado, pagado });

        if (Array.isArray(detalleVentas)) {
            const detalleIds = detalleVentas.map(detalle => detalle.id_detalle_venta);

            const detallesActuales = await DetalleVenta.findAll({ where: { id_venta: venta.id_venta } });

            for (let detalleActual of detallesActuales) {
                if (!detalleIds.includes(detalleActual.id_detalle_venta)) {
                    await detalleActual.destroy();
                }
            }

            for (let detalle of detalleVentas) {
                const detalleExistente = await DetalleVenta.findByPk(detalle.id_detalle_venta);

                if (detalleExistente) {
                    await detalleExistente.update({
                        id_producto: detalle.id_producto,
                        cantidad: detalle.cantidad,
                    });
                } else {
                    await DetalleVenta.create({
                        ...detalle,
                        id_venta: venta.id_venta,
                    });
                }
            }
        }

        res.status(200).json(venta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminarVenta = async (req, res) => {
    try {
        await Venta.destroy({ where: { id_venta: req.params.id } });
        res.json({ message: 'Venta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const entregarVenta = async (req, res) => {
    const { id } = req.params; // Cambia esto para que `id` contenga el numero_venta
    console.log("Número de venta recibido:", id);

    try {
        // Buscar la venta por numero_venta, incluyendo los detalles
        const venta = await Venta.findOne({
            where: { numero_venta: id }, // Asegúrate de que esto sea el campo correcto
            include: [{ model: DetalleVenta, as: 'detalles' }]
        });

        if (!venta) {
            console.log("Venta no encontrada para el número:", id); // Log adicional para depuración
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        // Verificar si el estado de la venta es "Listo Para Entrega" (id_estado = 3)
        if (venta.id_estado !== 3) {
            return res.status(400).json({ error: 'La venta no está en estado "Listo Para Entrega".' });
        }

        // Descontar productos del stock
        for (let detalle of venta.detalles) {
            const producto = await Producto.findByPk(detalle.id_producto);
            if (producto) {
                // Verificar si hay suficiente stock
                if (producto.stock < detalle.cantidad) {
                    return res.status(400).json({ error: `No hay suficiente stock para el producto: ${producto.nombre}` });
                }
                // Descontar del stock
                producto.stock -= detalle.cantidad;
                await producto.save();
            } else {
                return res.status(404).json({ error: `Producto no encontrado: ${detalle.id_producto}` });
            }
        }

        // Actualizar el estado de la venta a Completado (id_estado = 1)
        venta.id_estado = 1;
        await venta.save();

        res.status(200).json({ message: 'Venta completada y stock actualizado.', venta });
    } catch (error) {
        console.error("Error en el controlador de entrega:", error.message);
        res.status(500).json({ error: error.message });
    }
};




module.exports = {
    agregarVenta,
    cambiarEstadoDeProduccionVenta,
    listarVentas,
    obtenerVentaPorId,
    actualizarVenta,
    eliminarVenta,
    obtenerVentasActivas,
    anularVenta,
    entregarVenta,
};
