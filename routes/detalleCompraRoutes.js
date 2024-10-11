const express = require('express');
const router = express.Router();
const detalleCompraController = require('../controllers/detalleCompraController');

router.get('/', detalleCompraController.listarDetalleCompras);
router.get('/:id', detalleCompraController.getDetalleCompraById);
router.post('/', detalleCompraController.agregarDetalleCompra);
router.put('/:id', detalleCompraController.updateDetalleCompra);
router.delete('/:id', detalleCompraController.eliminarDetalleCompra);

module.exports = router;
