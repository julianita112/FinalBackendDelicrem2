const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // true para el puerto 465, false para otros puertos
    auth: {
        user: '7a32e9001@smtp-brevo.com', // Tu identificador de Brevo
        pass: 'g50qAH7IRt3DLSzd', // Tu contraseña de Brevo
    },
    tls: {
        rejectUnauthorized: false 
    }
});

module.exports = transporter;
