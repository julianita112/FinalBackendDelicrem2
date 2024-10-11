// routes/rolPermisoRoutes.js
const express = require('express');
const router = express.Router();
const rolPermisoController = require('../controllers/rolPermisoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.verifyToken, rolPermisoController.asignarPermiso);
router.put('/:id_rol/:id_permiso', authMiddleware.verifyToken, rolPermisoController.actualizarPermisoDeRol);
router.get('/:id', authMiddleware.verifyToken, rolPermisoController.obtenerPermisosPorRol);
router.delete('/:id_rol/:id_permiso', authMiddleware.verifyToken, rolPermisoController.eliminarPermisoDeRol);


module.exports = router;
