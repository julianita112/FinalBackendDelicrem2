const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const transporter = require('../config/nodemailer');


exports.recuperarContrasena = async (req, res) => {
    const { email } = req.body;
    try {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Generar un token temporal
        const token = crypto.randomBytes(20).toString('hex');

        // Establecer la expiración del token (ej. 1 hora)
        const tokenExpiration = Date.now() + 3600000; // 1 hora en milisegundos

        // Almacenar el token y su expiración en el usuario
        usuario.resetPasswordToken = token;
        usuario.resetPasswordExpires = tokenExpiration;
        await usuario.save();

        const mailOptions = {
            to: usuario.email,
            from: 'caldas.delicremsupp0rt@yahoo.com',
            subject: 'Recuperación de Contraseña',
            text: `Estás recibiendo esto porque tú (o alguien más) ha solicitado el restablecimiento de la contraseña de tu cuenta.\n\n` +
                `Tu código de recuperación es: ${token}\n\n` +
                `Este código expirará en 1 hora.\n\n` +
                `Si no solicitaste esto, ignora este correo y tu contraseña no cambiará.\n`
        };

        // Enviar el correo utilizando el transporter desde la configuración
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al enviar el correo.' });
            }
            res.json({ message: 'Correo de recuperación enviado.' });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.resetPassword = async (req, res) => {
    const { email, token, nuevaContrasena } = req.body;
    try {
        console.log("Email recibido:", email);
        console.log("Token recibido:", token);

        const usuario = await Usuario.findOne({
            where: {
                email: email,
                resetPasswordToken: token,
                resetPasswordExpires: {
                    [Op.gt]: Date.now() // Asegurarse de que el token no haya expirado
                }
            }
        });

        if (!usuario) {
            console.log("Token inválido o expirado para el usuario:", email);
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }

        console.log("Usuario encontrado:", usuario);

        // Actualizar la contraseña
        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
        usuario.password = hashedPassword;
        usuario.resetPasswordToken = null;
        usuario.resetPasswordExpires = null;

        await usuario.save();

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.agregarUsuario = async (req, res) => {
    const { nombre, email, tipo_documento, numero_documento, genero, nacionalidad, telefono, direccion, password, id_rol, estado = true } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const usuario = await Usuario.create({ nombre, email, tipo_documento, numero_documento, genero, nacionalidad, telefono, direccion, password: hashedPassword, id_rol, estado });
        res.status(201).json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUsuario = async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario || !await bcrypt.compare(password, usuario.password)) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        const token = jwt.sign({ id: usuario.id_usuario, id_rol: usuario.id_rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Otros controladores CRUD para Usuario
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerUsuariosActivos = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({ where: { estado: true } });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.editarUsuario = async (req, res) => {
    const { password, ...otherFields } = req.body;
    try {
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            otherFields.password = hashedPassword;
        }
        const usuario = await Usuario.update(otherFields, { where: { id_usuario: req.params.id } });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.cambiarEstadoUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        usuario.estado = !usuario.estado;
        await usuario.save();
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        await Usuario.destroy({ where: { id_usuario: req.params.id } });
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
