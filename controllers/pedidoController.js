const { Pedido, Cliente, DetallePedido, Venta, Estado, DetalleVenta } = require('../models');
const { Op } = require('sequelize');


//const moment = require('moment-timezone');

exports.agregarPedido = async (req, res) => {
    const { numero_pedido, id_cliente, fecha_pago, fecha_entrega, id_estado=7, detallesPedido, total, } = req.body;

    try {
        
        
        // Establece la fecha actual en la zona horaria de Colombia
       // const fecha_registro = moment().tz('America/Bogota').toDate(); 

        const pedido = await Pedido.create({ 
            numero_pedido, 
            id_cliente, 
            fecha_pago, 
            fecha_entrega, 
           // fecha_registro, // Utiliza la fecha actual con zona horaria de Colombia
            id_estado,  
            total,
            
        });

        for (let detalle of detallesPedido) {
            await DetallePedido.create({ ...detalle, id_pedido: pedido.id_pedido });
        }

        res.status(201).json(pedido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.listarPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            attributes: { exclude: ['id_venta'] },
            include: [
                { model: Cliente, as: 'clientesh' },
                { model: DetallePedido, as: 'detallesPedido' }
            ],
            where: {
                id_estado: { [Op.ne]: 6 } // Excluir pedidos con estado pagado (id_estado = 6)
            }
        });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.obtenerPedidoPorId = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id, {
            attributes: { exclude: ['id_venta'] },
            include: [
                { model: Cliente, as: 'clientesh' },
                { model: DetallePedido, as: 'detallesPedido' }
            ]
        });
        
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.anularPedido = async (req, res) => {
    const { numero_pedido: id_pedido } = req.params; // Cambia numero_pedido a id_pedido
    const { id_estado, motivo_anulacion } = req.body;
  
    try {
      // Agregar logs para verificar lo que se está recibiendo
      console.log('ID de pedido recibido:', id_pedido);
      console.log('Request body:', req.body);  // Verificar los datos recibidos
  
      // Buscar el pedido por id_pedido
      const pedido = await Pedido.findOne({
        attributes: { exclude: ['id_venta'] },
        where: { id_pedido } // Cambia numero_pedido a id_pedido
      });
  
      console.log('Resultado de la búsqueda del pedido:', pedido);
  
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
  
      // Solo permitir anular si id_estado no es 1 ni 5
      if (pedido.id_estado === 1 || pedido.id_estado === 5) {
        return res.status(400).json({ error: 'No se puede anular un pedido en este estado.' });
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
      pedido.id_estado = id_estado;
      pedido.motivo_anulacion = motivo_anulacion;
      await pedido.save();
  
      res.json(pedido);
    } catch (error) {
      console.error("Error en el controlador:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  

  exports.editarPedido = async (req, res) => {
    const { id } = req.params;
    const { numero_pedido, id_cliente, fecha_pago, fecha_entrega, id_estado, total, detallesPedido } = req.body;

    try {
        // Verificar qué datos están llegando del frontend
        console.log('Datos recibidos del frontend:', req.body);

        // Buscar el pedido por ID
        const pedido = await Pedido.findByPk(id, {
            attributes: { exclude: ['id_venta'] },
        });

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        if (pedido.id_estado !== 7) {
            return res.status(400).json({ error: 'El pedido ya está completado y no se puede actualizar.' });
        }

        // Actualizar el pedido
        await pedido.update({ numero_pedido, id_cliente, fecha_pago, fecha_entrega, id_estado, total });

        // Log para verificar los datos después de la actualización
        console.log('Pedido actualizado:', pedido);

        // Manejar los detalles del pedido
        if (Array.isArray(detallesPedido)) {
            const detalleIds = detallesPedido.map(detalle => detalle.id_detalle_pedido);

            const detallesActuales = await DetallePedido.findAll({ where: { id_pedido: pedido.id_pedido } });

            // Eliminar detalles que ya no están en el pedido
            for (let detalleActual of detallesActuales) {
                if (!detalleIds.includes(detalleActual.id_detalle_pedido)) {
                    await detalleActual.destroy();
                }
            }

            // Actualizar o crear nuevos detalles
            for (let detalle of detallesPedido) {
                if (detalle.id_detalle_pedido) {
                    const detalleExistente = await DetallePedido.findByPk(detalle.id_detalle_pedido);

                    if (detalleExistente) {
                        await detalleExistente.update({
                            id_producto: detalle.id_producto,
                            cantidad: detalle.cantidad,
                        });
                    }
                } else {
                    await DetallePedido.create({
                        ...detalle,
                        id_pedido: pedido.id_pedido,
                    });
                }
            }
        }

        // Verificar si el estado ha cambiado a pagado (id_estado = 6)
            if (id_estado === 6) {
                try {
                    // Ahora tomamos numero_pedido e id_cliente directamente del pedido actualizado
                    const numero_venta = pedido.numero_pedido;
                    const id_cliente = pedido.id_cliente;

                    console.log('Valores para crear la venta:');
                    console.log('numero_venta:', numero_venta);
                    console.log('id_cliente:', id_cliente);

                    if (!id_cliente || !numero_venta) {
                        console.error('Error: id_cliente o numero_venta son nulos o indefinidos');
                        return res.status(400).json({ error: 'El cliente o el número de venta no están definidos correctamente.' });
                    }

                    console.log('Creando venta para el pedido:', pedido.id_pedido);

                    // Crear el registro en la tabla de ventas
                    const nuevaVenta = await Venta.create({
                        numero_venta, // Usamos el numero_pedido del pedido como numero_venta
                        id_cliente,   // Usamos el id_cliente del pedido
                        fecha_venta: fecha_pago,
                        fecha_entrega,
                        total,
                        id_estado: 2 // Estado 'completado' para la venta
                    });

                    console.log('Venta creada con éxito:', nuevaVenta.id_venta);

                    // Copiar los detalles del pedido a los detalles de la venta
                    for (let detalle of detallesPedido) {
                        console.log('Creando detalle de venta para producto:', detalle.id_producto);
                        await DetalleVenta.create({
                            id_venta: nuevaVenta.id_venta,
                            id_producto: detalle.id_producto,
                            cantidad: detalle.cantidad,
                            precio_unitario: detalle.precio_unitario
                        });
                    }

                    console.log('Detalles de venta creados con éxito');
                } catch (error) {
                    console.error('Error creando la venta:', error);
                    throw error;
                }
            }


        const pedidoActualizado = await Pedido.findByPk(id, {
            attributes: { exclude: ['id_venta'] },
            include: [
                { model: Cliente, as: 'cliente' },
                { model: DetallePedido, as: 'detallesPedido' }
            ]
        });

        res.status(200).json(pedidoActualizado);
    } catch (error) {
        console.error('Error al actualizar el pedido:', error); // Agregar más detalles en el log
        res.status(500).json({ error: error.message });
    }
};



exports.eliminarPedido = async (req, res) => {
    const { id } = req.params;

    try {
        const pedido = await Pedido.findByPk(id, {
            attributes: { exclude: ['id_venta'] },
        });

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        const ventaAsociada = await Venta.findOne({ where: { numero_pedido: pedido.numero_pedido } });

        if (ventaAsociada) {
            return res.status(400).json({ error: 'No se puede eliminar el pedido, porque está asociado a una venta.' });
        }

        await Pedido.destroy({ where: { id_pedido: id } });
        res.json({ message: 'Pedido eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarEstadoActivoPedido = async (req, res) => {
    const { id } = req.params;
    const { activo, anulacion } = req.body;

    try {
        // Buscar el pedido excluyendo el atributo id_venta
        const pedido = await Pedido.findByPk(id, {
            attributes: { exclude: ['id_venta'] },
        });

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        if (pedido.anulacion && !activo) {
            return res.status(400).json({ error: 'Un pedido anulado no se puede volver a activar.' });
        }

        if (!activo && !anulacion) {
            return res.status(400).json({ error: 'Debe proporcionar un motivo de anulación cuando se desactiva el pedido.' });
        }

        pedido.activo = activo;
        pedido.anulacion = anulacion || pedido.anulacion; // Guardar el motivo de anulación solo si se proporciona
        await pedido.save();

        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.obtenerPedidosActivos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            where: { activo: true },
            attributes: { exclude: ['id_venta'] }
        });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
