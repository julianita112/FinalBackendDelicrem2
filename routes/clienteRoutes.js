const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/', clienteController.getClientes);
router.get('/activos', clienteController.getClientesActivos);
router.get('/:id', clienteController.getClienteById);
router.post('/', clienteController.registrarCliente);
router.put('/:id', clienteController.editarCliente);
router.delete('/:id', clienteController.eliminarCliente);
router.patch('/:id/estado', clienteController.cambiarEstadoCliente);

module.exports = router;
