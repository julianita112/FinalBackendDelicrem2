const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware.verifyToken, compraController.listarCompras);
router.post('/', authMiddleware.verifyToken, compraController.registrarCompra);
router.get('/:id', authMiddleware.verifyToken, compraController.obtenerCompraPorId);
router.put('/:id', authMiddleware.verifyToken, compraController.actualizarCompra);
router.delete('/:id', authMiddleware.verifyToken, compraController.eliminarCompra);
router.patch('/:id/estado', authMiddleware.verifyToken, compraController.anularCompra);


module.exports = router;
