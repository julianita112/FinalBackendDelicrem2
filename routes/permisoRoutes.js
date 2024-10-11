const express = require('express');
const router = express.Router();
const permisoController = require('../controllers/permisoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.verifyToken, permisoController.crearPermiso);
router.get('/', authMiddleware.verifyToken, permisoController.obtenerPermisos);
router.get('/:id', authMiddleware.verifyToken, permisoController.obtenerPermisoPorId);
router.put('/:id', authMiddleware.verifyToken, permisoController.actualizarPermiso);
router.delete('/:id', authMiddleware.verifyToken, permisoController.eliminarPermiso);

module.exports = router;
