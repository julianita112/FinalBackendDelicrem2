const { Cliente, Venta } = require('../models');
const nodemailer = require('nodemailer');
const transporter = require('../config/nodemailer');


exports.getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registrar un nuevo cliente
exports.registrarCliente = async (req, res) => {
  const { nombre, contacto, email, tipo_documento, numero_documento, estado = true } = req.body;
  try {
    // Crear el cliente en la base de datos
    const cliente = await Cliente.create({ nombre, contacto, email, tipo_documento, numero_documento, estado });

    // Configurar el correo de bienvenida
    const mailOptions = {
      from: 'caldas.delicremsupp0rt@yahoo.com', // Tu correo de Brevo
      to: email, // Correo del cliente
      subject: 'Bienvenido/a ¡Ya eres parte de Nosotros!',
      text: `Hola ${nombre},\n\nGracias por Preferir nuestros Productos. Estamos encantados de tenerte como cliente.\nSi tienes alguna duda o consulta, no dudes en contactarnos.\n\nSaludos cordiales,\nTu Empresa Delicrem+`
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error al enviar el correo: ${error}`);
      } else {
        console.log(`Correo de bienvenida enviado: ${info.response}`);
      }
    });

    // Enviar la respuesta HTTP
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClientesActivos = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({ where: { estado: true } });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cambiarEstadoCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    cliente.estado = !cliente.estado;
    await cliente.save();
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editarCliente = async (req, res) => {
  const { nombre, contacto, email, tipo_documento, numero_documento } = req.body;
  try {
    const [updated] = await Cliente.update({ nombre, contacto, email, tipo_documento, numero_documento }, {
      where: { id_cliente: req.params.id }
    });
    if (updated) {
      const updatedCliente = await Cliente.findByPk(req.params.id);
      res.json(updatedCliente);
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarCliente = async (req, res) => {
  try {
      const cliente = await Cliente.findByPk(req.params.id);
      if (!cliente) {
          return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      const ventasAsociadas = await Venta.findAll({ where: { id_cliente: cliente.id_cliente } });
      if (ventasAsociadas.length > 0) {
          return res.status(400).json({ 
              error: 'No se puede eliminar el cliente. Primero elimine las ventas asociadas.' 
          });
      }

      await cliente.destroy();
      res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
