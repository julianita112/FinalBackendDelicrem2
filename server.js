const express = require('express');
const app = express();
const sequelize = require('./config/database');
const dotenv = require('dotenv');
const cors = require('cors');


const errorMiddleware = require('./middlewares/errorMiddleware');
const usuarioRoutes = require('./routes/usuarioRoutes');
const rolRoutes = require('./routes/rolRoutes');
const permisoRoutes = require('./routes/permisoRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const productoRoutes = require('./routes/productoRoutes');
const compraRoutes = require('./routes/compraRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const fichaTecnicaRoutes = require('./routes/fichaTecnicaRoutes');
const insumoRoutes = require('./routes/insumoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const detalleCompraRoutes = require('./routes/detalleCompraRoutes');
const rolPermisoRoutes = require('./routes/rolPermisoRoutes');
const detallePedidoRoutes = require('./routes/detallePedidoRoutes');
const categoriaInsumoRoutes = require('./routes/categoriaInsumoRoutes');
const ordenProduccionRoutes = require('./routes/ordenProduccionRoutes');
const estadoRoutes = require('./routes/estadoRoutes');

// Importar y definir las asociaciones
require('./config/associations');

dotenv.config();


// Configuración de CORS para permitir todos los orígenes
app.use(cors({
  origin: 'https://delicrem-fm7p.onrender.com', // Permitir todos los orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos HTTP permitidos
  credentials: true, // Permitir el envío de cookies y encabezados de autenticación
}));


app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/permisos', permisoRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/fichastecnicas', fichaTecnicaRoutes);
app.use('/api/insumos', insumoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/detallecompras', detalleCompraRoutes);
app.use('/api/rol_permisos', rolPermisoRoutes);
app.use('/api/detallepedidos', detallePedidoRoutes);
app.use('/api/categorias_insumo', categoriaInsumoRoutes);
app.use('/api/ordenesproduccion', ordenProduccionRoutes);
app.use('/api/estados', estadoRoutes);


app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

// Sincronización de Sequelize
sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });