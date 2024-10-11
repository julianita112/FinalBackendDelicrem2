const jwt = require('jsonwebtoken');

// Función para generar un token con una expiración de 8 horas
exports.generateToken = (user) => {
    return jwt.sign({ id: user.id_usuario, id_rol: user.id_rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
};

// Función para verificar un token
exports.verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token expires at: ", new Date(decoded.exp * 1000)); // Para verificar la fecha de expiración
        return decoded;
    } catch (err) {
        console.error("Invalid or expired token");
        return null;
    }
};
