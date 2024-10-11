const express = require('express');
const router = express.Router();
const insumoController = require('../controllers/insumoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.verifyToken, insumoController.agregarInsumo);
router.get('/activos', authMiddleware.verifyToken, insumoController.obtenerInsumosActivos);
router.get('/', authMiddleware.verifyToken, insumoController.listarInsumos);
router.get('/:id', authMiddleware.verifyToken, insumoController.obtenerInsumoPorId);
router.put('/:id', authMiddleware.verifyToken, insumoController.editarInsumo);
router.delete('/:id', authMiddleware.verifyToken, insumoController.eliminarInsumo);
router.patch('/:id/estado', authMiddleware.verifyToken, insumoController.cambiarEstadoInsumo);

module.exports = router;
