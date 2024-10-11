const { DetallePedido, Producto, Pedido } = require('../models');

exports.agregarDetallePedido = async (req, res) => {
  const { id_pedido, id_producto, cantidad } = req.body;
  try {
    const detallePedido = await DetallePedido.create({ id_pedido, id_producto, cantidad });
    res.status(201).json(detallePedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listarDetallesPedido = async (req, res) => {
  try {
    const detallesPedido = await DetallePedido.findAll({
      include: [
        {
          model: Producto,
          as: 'productoDetalle'
        },
        {
          model: Pedido,
          as: 'pedidoDetalle'
        }
      ]
    });
    res.json(detallesPedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerDetallePedidoPorId = async (req, res) => {
  try {
    const detallePedido = await DetallePedido.findByPk(req.params.id, {
      include: [
        {
          model: Producto,
          as: 'productoDetalle'
        },
        {
          model: Pedido,
          as: 'pedidoDetalle'
        }
      ]
    });
    if (!detallePedido) {
      return res.status(404).json({ error: 'Detalle de pedido no encontrado' });
    }
    res.json(detallePedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editarDetallePedido = async (req, res) => {
  try {
    const detallePedido = await DetallePedido.update(req.body, { where: { id_detalle_pedido: req.params.id } });
    res.json(detallePedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarDetallePedido = async (req, res) => {
  try {
    await DetallePedido.destroy({ where: { id_detalle_pedido: req.params.id } });
    res.json({ message: 'Detalle de pedido eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
