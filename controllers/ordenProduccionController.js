const { OrdenProduccion, DetalleOrdenProduccion, Producto, FichaTecnica, DetalleFichaTecnica, Insumo, OrdenVenta, Venta , Estado, Cliente } = require('../models');
const nodemailer = require('nodemailer');
const transporter = require('../config/nodemailer');

// Crear una nueva orden de producción
exports.agregarOrdenProduccion = async (req, res) => {
    const { numero_orden, fecha_orden, productos, numero_ventas } = req.body;

    try {
        // Crear la nueva orden de producción con id_estado = 2 (Recientemente creada)
        const nuevaOrden = await OrdenProduccion.create({
            numero_orden,
            fecha_orden,
            id_estado: 2,  // Estado "Recientemente creada"
            motivo_anulacion: null  // Inicializar el motivo de anulación como null
        });

        // Crear los detalles de la orden con los productos
        for (let producto of productos) {
            await DetalleOrdenProduccion.create({
                id_orden: nuevaOrden.id_orden,
                id_producto: producto.id_producto,
                cantidad: producto.cantidad
            });
        }

        // Crear las órdenes de venta asociadas y actualizar el id_estado de las ventas
        for (let numero_venta of numero_ventas) {
            await OrdenVenta.create({
                id_orden: nuevaOrden.id_orden,
                numero_venta
            });

            // Actualizar el id_estado de la venta asociada a 2 (Recientemente creada)
            const venta = await Venta.findOne({ where: { numero_venta } });
            if (venta) {
                await venta.update({ id_estado: 8 }); // Actualizar con el id_estado correspondiente
            }
        }

        // Devolver la nueva orden creada
        res.status(201).json(nuevaOrden);
    } catch (error) {
        console.log('Error al crear la orden de producción:', error);
        res.status(500).json({ error: error.message });
    }
};





// Obtener todas las órdenes de producción con id_estado = 2 (Recientemente creadas)
exports.obtenerOrdenesProduccion = async (req, res) => {
    try {
        const ordenesProduccion = await OrdenProduccion.findAll({
            where: {
                id_estado: 2 // Solo órdenes con estado "Recientemente creadas"
            },
            include: [{
                model: DetalleOrdenProduccion,
                as: 'ordenProduccionDetalles',
                include: [{
                    model: Producto,
                    as: 'productoDetalleOrdenProduccion'
                }]
            }]
        });
        res.json(ordenesProduccion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Obtener todas las órdenes de producción ya producidas (estado Completado o Listo para entrega)
exports.obtenerOrdenesProducidas = async (req, res) => {
    try {
        const ordenesProducidas = await OrdenProduccion.findAll({
            where: {
                id_estado: [1, 3]  // Estado 1 (Completado) o Estado 3 (Listo para entrega)
            },
            include: [{
                model: DetalleOrdenProduccion,
                as: 'ordenProduccionDetalles',
                include: [{
                    model: Producto,
                    as: 'productoDetalleOrdenProduccion'
                }]
            }]
        });

        res.json(ordenesProducidas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Controlador para obtener todos los registros de la tabla OrdenVenta
exports.obtenerTodasLasOrdenesVenta = async (req, res) => {
    try {
        const ventas = await OrdenVenta.findAll({
            include: [
                {
                    model: OrdenProduccion,
                    as: 'ordenProduccion'
                }
            ]
        });

        // Imprimir en la consola para depuración
        console.log('Ventas obtenidas:', ventas);

        res.json(ventas);
    } catch (error) {
        console.error('Error al obtener todas las órdenes de venta:', error);
        res.status(500).json({ error: error.message });
    }
};



// Obtener una orden de producción por ID
exports.obtenerOrdenProduccionPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const ordenProduccion = await OrdenProduccion.findByPk(id, {
            include: [{
                model: DetalleOrdenProduccion,
                as: 'ordenProduccionDetalles',
                include: [{
                    model: Producto,
                    as: 'productoDetalleOrdenProduccion'
                }]
            }]
        });

        const ventasAsociadas = await OrdenVenta.findAll({
            where: { id_orden: id },
            attributes: ['numero_venta']
        });

        const numero_ventas = ventasAsociadas.map(v => v.numero_venta);
        res.json({ ordenProduccion, numero_ventas });
    } catch (error) {
        console.error('Error al obtener la orden de producción:', error);
        res.status(500).json({ error: error.message });
    }
};


// Actualizar una orden de producción
// Ejemplo: Modificación en controlador para manejar numero_venta
// Actualizar una orden de producción
exports.editarOrdenProduccion = async (req, res) => {
    const { id } = req.params;
    const { fecha_orden, productos, numero_ventas } = req.body;

    try {
        const ordenProduccion = await OrdenProduccion.findByPk(id, {
            include: [
                { model: OrdenVenta, as: 'ventasAsociadas' },
                { model: DetalleOrdenProduccion, as: 'detallesOrdenProduccion' }
            ]
        });

        if (!ordenProduccion) {
            return res.status(404).json({ error: 'Orden de producción no encontrada' });
        }

        // Actualizar la fecha de la orden
        await ordenProduccion.update({ fecha_orden });

        // Obtener los números de ventas actualmente asociados
        const ventasAsociadas = ordenProduccion.ventasAsociadas.map(venta => venta.numero_venta);

        // Determinar qué números de venta eliminar
        const ventasAEliminar = ventasAsociadas.filter(venta => !numero_ventas.includes(venta));
        // Determinar qué números de venta agregar
        const ventasAAgregar = numero_ventas.filter(venta => !ventasAsociadas.includes(venta));

        // Eliminar números de venta que no están en la nueva lista
        await OrdenVenta.destroy({
            where: {
                id_orden: ordenProduccion.id_orden,
                numero_venta: ventasAEliminar
            }
        });

        // Agregar nuevos números de venta que no estaban previamente
        for (let numero_venta of ventasAAgregar) {
            await OrdenVenta.create({
                id_orden: ordenProduccion.id_orden,
                numero_venta
            });
        }

        // Actualizar o crear detalles de la orden de producción
        const productosExistentes = ordenProduccion.detallesOrdenProduccion.map(detalle => detalle.id_producto);
        const productosAEliminar = productosExistentes.filter(id_producto => !productos.some(p => p.id_producto === id_producto));

        // Eliminar productos que no están en la nueva lista
        await DetalleOrdenProduccion.destroy({
            where: {
                id_orden: ordenProduccion.id_orden,
                id_producto: productosAEliminar
            }
        });

        for (let producto of productos) {
            const detalleExistente = await DetalleOrdenProduccion.findOne({
                where: {
                    id_orden: ordenProduccion.id_orden,
                    id_producto: producto.id_producto
                }
            });

            if (detalleExistente) {
                await detalleExistente.update({
                    cantidad: producto.cantidad
                });
            } else {
                await DetalleOrdenProduccion.create({
                    id_orden: ordenProduccion.id_orden,
                    id_producto: producto.id_producto,
                    cantidad: producto.cantidad
                });
            }
        }

        // Devolver la orden actualizada junto con los detalles
        const ordenActualizada = await OrdenProduccion.findByPk(ordenProduccion.id_orden, {
            include: [
                { model: DetalleOrdenProduccion, as: 'detallesOrdenProduccion' },
                { model: OrdenVenta, as: 'ventasAsociadas' }
            ]
        });

        res.json(ordenActualizada);
    } catch (error) {
        console.error('Error al actualizar la orden de producción:', error);
        res.status(500).json({ error: error.message });
    }
};





// Producir una orden de producción
// Producir una orden de producción
// Producir una orden de producción
exports.producirOrdenProduccion = async (req, res) => {
    const { id } = req.params; // ID de la orden de producción a producir

    try {
        const ordenProduccion = await OrdenProduccion.findByPk(id, {
            include: {
                model: DetalleOrdenProduccion,
                as: 'detallesOrdenProduccion'
            }
        });

        if (!ordenProduccion) {
            return res.status(404).json({ error: 'Orden de producción no encontrada' });
        }

        // Verificar si la orden ya ha sido producida
        if (ordenProduccion.id_estado === 3) {
            return res.status(400).json({ error: 'Esta orden ya está en estado "Listo para entrega".' });
        }

        for (let detalle of ordenProduccion.detallesOrdenProduccion) {
            const { id_producto, cantidad } = detalle;
            const producto = await Producto.findByPk(id_producto);

            if (!producto) {
                return res.status(404).json({ error: `Producto no encontrado: ${id_producto}` });
            }

            const fichasTecnicas = await FichaTecnica.findAll({ where: { id_producto } });

            for (let ficha of fichasTecnicas) {
                const detallesFicha = await DetalleFichaTecnica.findAll({ where: { id_ficha: ficha.id_ficha } });
                for (let detalleFicha of detallesFicha) {
                    const insumo = await Insumo.findByPk(detalleFicha.id_insumo);
                    if (insumo) {
                        const cantidadNecesaria = detalleFicha.cantidad * cantidad;
                        if (insumo.stock_actual >= cantidadNecesaria) {
                            insumo.stock_actual -= cantidadNecesaria;
                            await insumo.save();
                        } else {
                            return res.status(400).json({ error: `Stock insuficiente de insumos para el Producto: \n${insumo.nombre}` });
                        }
                    } else {
                        return res.status(404).json({ error: `Insumo no encontrado: ${detalleFicha.id_insumo}` });
                    }
                }
            }

            producto.stock += Number(cantidad);
            await producto.save();
        }

        // Actualizar el estado de la orden a "Completado" (id_estado = 1)
        await ordenProduccion.update({ 
            produccion_completada: true, 
            id_estado: 1  // Cambiar a "Listo para entrega"
        });

        // Actualizar el estado de las ventas asociadas (si aplica)
        const ventasAsociadas = await OrdenVenta.findAll({ where: { id_orden: id } });
        for (let ventaAsociada of ventasAsociadas) {
            const venta = await Venta.findOne({ 
                where: { numero_venta: ventaAsociada.numero_venta },
                include: {
                    model: Cliente, // Incluimos al cliente para acceder a su email
                    as: 'cliente'
                }
            });
            if (venta) {
                await venta.update({ id_estado: 3 }); // Cambiar estado de la venta

                // Enviar correo si el estado de la venta es 3
                if (venta.id_estado === 3) {
                    const mailOptions = {
                        from: 'caldas.delicremsupp0rt@yahoo.com', // Tu correo de Brevo
                        to: venta.cliente.email, // Correo del cliente
                        subject: 'Pedido listo para recoger',
                        text: `Hola ${venta.cliente.nombre},\n\nTu pedido con número ${venta.numero_venta} está listo para ser recogido. Puedes pasar a recogerlo en la fecha acordada.\n\nGracias por tu preferencia.\n\nSaludos,\nTu Empresa Delicrem+.`
                    };

                    // Enviar el correo
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error(`Error al enviar el correo: ${error}`);
                        } else {
                            console.log(`Correo enviado: ${info.response}`);
                        }
                    });
                }
            }
        }

        res.status(200).json({ message: 'Producción realizada con éxito, estado actualizado a "Listo para entrega", y correo enviado al cliente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};




// Mover una orden de producción a la lista de órdenes ya producidas
exports.moverOrdenProduccion = async (req, res) => {
    const { id } = req.params;
    try {
        const ordenProduccion = await OrdenProduccion.findByPk(id);
        if (!ordenProduccion) {
            return res.status(404).json({ error: 'Orden de producción no encontrada' });
        }

        // Marcar como producida y desactivar la orden
        await ordenProduccion.update({ produccion_completada: true, activo: false });
        res.json({ message: 'Orden de producción movida a la lista de órdenes ya producidas' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Anular una orden de producción
exports.anularOrdenProduccion = async (req, res) => {
    const { id } = req.params;
    const { motivo_anulacion } = req.body; // Se espera un motivo de anulación

    try {
        const ordenProduccion = await OrdenProduccion.findByPk(id);
        if (!ordenProduccion) {
            return res.status(404).json({ error: 'Orden de producción no encontrada' });
        }

        // Verificar si la orden ya está anulada
        if (ordenProduccion.id_estado === 5) {
            return res.status(400).json({ error: 'La orden ya está anulada.' });
        }

        // Verificar que se proporcione un motivo de anulación
        if (!motivo_anulacion || motivo_anulacion.trim() === '') {
            return res.status(400).json({ error: 'Debe proporcionar un motivo de anulación.' });
        }

        // Actualizar el estado de la orden a 'Anulado' (id_estado = 5) y agregar el motivo de anulación
        await ordenProduccion.update({
            id_estado: 5,
            motivo_anulacion,
        });

        // Obtener todas las ventas asociadas a esta orden
        const ventasAsociadas = await OrdenVenta.findAll({ where: { id_orden: id } });

        

        // Actualizar el estado de todas las ventas asociadas a 'id_estado = 9' (Orden anulada, esperando reasignación)
        for (let ventaAsociada of ventasAsociadas) {
            const venta = await Venta.findOne({ where: { numero_venta: ventaAsociada.numero_venta } });
            if (venta) {
                await venta.update({ id_estado: 9 }); // Estado "Orden anulada, esperando reasignación"
            }
        }

        // Eliminar las asociaciones de las ventas con la orden de producción
        await OrdenVenta.destroy({ where: { id_orden: id } });

        res.json({ message: 'Orden de producción anulada correctamente y las ventas asociadas han sido actualizadas.' });
    } catch (error) {
        console.error('Error al anular la orden de producción:', error);
        res.status(500).json({ error: error.message });
    }
};



// obtnener ordenes activas
exports.obtenerOrdenesActivas = async (req, res) => {
    try {
        const ordenesActivas = await OrdenProduccion.findAll({
            where: { activo: true },  // Solo órdenes activas
            include: [{
                model: DetalleOrdenProduccion,
                as: 'ordenProduccionDetalles',
                include: [{
                    model: Producto,
                    as: 'productoDetalleOrdenProduccion'
                }]
            }]
        });
        res.json(ordenesActivas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// obtener ordenes inactivas
exports.obtenerOrdenesInactivas = async (req, res) => {
    try {
        const ordenesInactivas = await OrdenProduccion.findAll({
            where: { id_estado: 5 },  // Solo órdenes anuladas
            include: [{
                model: DetalleOrdenProduccion,
                as: 'ordenProduccionDetalles',
                include: [{
                    model: Producto,
                    as: 'productoDetalleOrdenProduccion'
                }]
            }]
        });
        res.json(ordenesInactivas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener los números de venta asociados a una orden específica
exports.obtenerVentasPorOrden = async (req, res) => {
    const { id } = req.params;

    try {
        const ventas = await OrdenVenta.findAll({
            where: { id_orden: id },
            include: [{ model: OrdenProduccion, as: 'ordenProducciont' }]
        });

        res.json(ventas);
    } catch (error) {
        console.error('Error al obtener las ventas por orden:', error);
        res.status(500).json({ error: error.message });
    }
};

// Actualizar el estado del proceso de una orden de producción
// Actualizar el estado del proceso de una orden de producción y ajustar stock
exports.cambiarEstadoProcesoOrdenProduccion = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const ordenProduccion = await OrdenProduccion.findByPk(id, {
            include: [{ model: DetalleOrdenProduccion, as: 'ordenProduccionDetalles' }]
        });

        if (!ordenProduccion) {
            return res.status(404).json({ error: 'Orden de producción no encontrada' });
        }

        if (estado === 'completado' && ordenProduccion.estado !== 'completado') {
            for (let detalle of ordenProduccion.ordenProduccionDetalles) {
                const producto = await Producto.findByPk(detalle.id_producto);
                if (producto) {
                    if (producto.stock >= detalle.cantidad) {
                        producto.stock -= detalle.cantidad;
                        await producto.save();
                    } else {
                        return res.status(400).json({ error: `Stock insuficiente para el producto: ${producto.nombre}` });
                    }
                }
            }

            // Actualizar el estado de las ventas asociadas a "completado"
            const ventasAsociadas = await OrdenVenta.findAll({ where: { id_orden: id } });
            for (let ventaAsociada of ventasAsociadas) {
                const venta = await Venta.findOne({ where: { numero_venta: ventaAsociada.numero_venta } });
                if (venta) {
                    await venta.update({ estado: 'completado' });
                }
            }
        }

        await ordenProduccion.update({ estado });
        res.json({ message: `Estado de la orden de producción actualizado a: ${estado}` });
    } catch (error) {
        console.error('Error al actualizar la orden de producción:', error);
        res.status(500).json({ error: error.message });
    }
};


