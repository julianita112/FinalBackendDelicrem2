const { DetalleCompra } = require('../models');

exports.listarDetalleCompras = async (req, res) => {
  try {
    const detalleCompras = await DetalleCompra.findAll();
    res.json(detalleCompras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDetalleCompraById = async (req, res) => {
  try {
    const detalleCompra = await DetalleCompra.findByPk(req.params.id);
    if (detalleCompra) {
      res.json(detalleCompra);
    } else {
      res.status(404).json({ error: 'Detalle de compra no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.agregarDetalleCompra = async (req, res) => {
  const { id_compra, id_insumo, cantidad, precio_unitario } = req.body;
  try {
    const detalleCompra = await DetalleCompra.create({ id_compra, id_insumo, cantidad, precio_unitario });
    res.status(201).json(detalleCompra);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDetalleCompra = async (req, res) => {
  const { id_compra, id_insumo, cantidad, precio_unitario } = req.body;
  try {
    const [updated] = await DetalleCompra.update({ id_compra, id_insumo, cantidad, precio_unitario }, {
      where: { id_detalle_compra: req.params.id }
    });
    if (updated) {
      const updatedDetalleCompra = await DetalleCompra.findByPk(req.params.id);
      res.json(updatedDetalleCompra);
    } else {
      res.status(404).json({ error: 'Detalle de compra no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarDetalleCompra = async (req, res) => {
  try {
    const deleted = await DetalleCompra.destroy({
      where: { id_detalle_compra: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Detalle de compra eliminado' });
    } else {
      res.status(404).json({ error: 'Detalle de compra no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
