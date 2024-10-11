const express = require('express');
const router = express.Router();
const estadoController = require('../controllers/estadoController');

router.post('/', estadoController.crearEstado);
router.get('/', estadoController.obtenerEstados);
router.get('/:id', estadoController.obtenerEstadoPorId);

module.exports = router;