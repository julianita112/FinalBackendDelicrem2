const express = require('express');
const router = express.Router();
const fichaTecnicaController = require('../controllers/fichaTecnicaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.verifyToken, fichaTecnicaController.agregarFichaTecnica);
router.get('/activos', authMiddleware.verifyToken, fichaTecnicaController.obtenerFichasTecnicasActivas);
router.get('/', authMiddleware.verifyToken, fichaTecnicaController.listarFichasTecnicas);
router.get('/:id', authMiddleware.verifyToken, fichaTecnicaController.obtenerFichaTecnicaPorId);
router.put('/:id', authMiddleware.verifyToken, fichaTecnicaController.editarFichaTecnica);
router.delete('/:id', authMiddleware.verifyToken, fichaTecnicaController.eliminarFichaTecnica);
router.patch('/:id/estado', authMiddleware.verifyToken, fichaTecnicaController.cambiarEstadoFichaTecnica);

module.exports = router;
