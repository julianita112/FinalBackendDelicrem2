const express = require('express');
const router = express.Router();
const detallePedidoController = require('../controllers/detallePedidoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.verifyToken, detallePedidoController.agregarDetallePedido);
router.get('/', authMiddleware.verifyToken, detallePedidoController.listarDetallesPedido);
router.get('/:id', authMiddleware.verifyToken, detallePedidoController.obtenerDetallePedidoPorId);
router.put('/:id', authMiddleware.verifyToken, detallePedidoController.editarDetallePedido);
router.delete('/:id', authMiddleware.verifyToken, detallePedidoController.eliminarDetallePedido);

module.exports = router;
