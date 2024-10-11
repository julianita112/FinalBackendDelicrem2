const { Producto, Insumo, FichaTecnica, DetalleFichaTecnica, DetalleVenta } = require('../models');

exports.agregarProducto = async (req, res) => {
    const { nombre, descripcion, precio, estado = 1 } = req.body;

    try {
        // Crear el producto con stock inicial 0
        const producto = await Producto.create({ nombre, descripcion, precio, estado, stock: 0 });

        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.producirProducto = async (req, res) => {
    const { productosProduccion } = req.body; // Array de objetos { id_producto, cantidad }

    try {
        for (let productoProduccion of productosProduccion) {
            const { id_producto, cantidad } = productoProduccion;
            const producto = await Producto.findByPk(id_producto);

            if (!producto) {
                return res.status(404).json({ error: `Producto no encontrado: ${id_producto}` });
            }

            // Consultar la ficha técnica del producto
            const fichasTecnicas = await FichaTecnica.findAll({ where: { id_producto } });

            // Descontar insumos necesarios para la creación del producto
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
                            return res.status(400).json({ error: `Stock insuficiente para el insumo: ${insumo.nombre}` });
                        }
                    } else {
                        return res.status(404).json({ error: `Insumo no encontrado: ${detalleFicha.id_insumo}` });
                    }
                }
            }

            // Incrementar el stock del producto
            producto.stock += Number(cantidad);
            await producto.save();
        }

        res.status(200).json({ message: 'Producción realizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Otros controladores CRUD para Producto...
exports.listarProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.editarProducto = async (req, res) => {
    try {
        const producto = await Producto.update(req.body, { where: { id_producto: req.params.id } });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerProductosActivos = async (req, res) => {
    try {
        const productos = await Producto.findAll({ where: { estado: true } });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const detallesVentaAsociados = await DetalleVenta.findAll({ where: { id_producto: producto.id_producto } });
        const fichasTecnicasAsociadas = await FichaTecnica.findAll({ where: { id_producto: producto.id_producto } });

        if (detallesVentaAsociados.length > 0) {
            return res.status(400).json({ 
                error: 'No se puede eliminar el producto. Primero elimine los detalles de venta asociados.' 
            });
        }

        if (fichasTecnicasAsociadas.length > 0) {
            return res.status(400).json({ 
                error: 'No se puede eliminar el producto. Primero elimine las fichas técnicas asociadas.' 
            });
        }

        await producto.destroy();
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.cambiarEstadoProducto = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        producto.estado = estado;
        await producto.save();

        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
