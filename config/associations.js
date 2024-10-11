const { Cliente, Insumo, Producto, Proveedor, Rol, Permiso, Usuario, Compra, DetalleCompra, FichaTecnica, DetalleFichaTecnica, Venta, DetalleVenta, Estado, Pedido, DetallePedido, RolPermiso, CategoriaInsumo, OrdenProduccion, DetalleOrdenProduccion, OrdenVenta } = require('../models');

// Asociaciones existentes

Cliente.hasMany(Venta, { foreignKey: 'id_cliente', as: 'ventas' });
Venta.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });

Producto.hasMany(DetalleVenta, { foreignKey: 'id_producto', as: 'detallesVenta' });
DetalleVenta.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });

Proveedor.hasMany(Compra, { foreignKey: 'id_proveedor', as: 'compras' });
Compra.belongsTo(Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });

Venta.hasMany(DetalleVenta, { foreignKey: 'id_venta', as: 'detalles' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'id_venta', as: 'venta' });


Cliente.hasMany(Pedido, { foreignKey: 'id_cliente', as: 'pedidos' });
Pedido.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'clientesh' });

Compra.hasMany(DetalleCompra, { foreignKey: 'id_compra', as: 'detalles' });
DetalleCompra.belongsTo(Compra, { foreignKey: 'id_compra', as: 'compra' });

Rol.belongsToMany(Permiso, { through: RolPermiso, foreignKey: 'id_rol', as: 'permisos' });
Permiso.belongsToMany(Rol, { through: RolPermiso, foreignKey: 'id_permiso', as: 'roles' });

Usuario.belongsTo(Rol, { foreignKey: 'id_rol', as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'id_rol', as: 'usuarios' });

FichaTecnica.hasMany(DetalleFichaTecnica, { foreignKey: 'id_ficha', as: 'detallesFichaTecnicat' });
DetalleFichaTecnica.belongsTo(FichaTecnica, { foreignKey: 'id_ficha', as: 'fichaTecnica' });

DetalleFichaTecnica.belongsTo(Insumo, { foreignKey: 'id_insumo', as: 'insumo' });
Insumo.hasMany(DetalleFichaTecnica, { foreignKey: 'id_insumo', as: 'detallesFichaTecnica' });

Producto.hasMany(FichaTecnica, { foreignKey: 'id_producto', as: 'fichasTecnicas' });
FichaTecnica.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });

Insumo.hasMany(DetalleCompra, { foreignKey: 'id_insumo', as: 'detallesCompra' });
DetalleCompra.belongsTo(Insumo, { foreignKey: 'id_insumo', as: 'insumo' });

CategoriaInsumo.hasMany(Insumo, { foreignKey: 'id_categoria', as: 'categoriaInsumos' });
Insumo.belongsTo(CategoriaInsumo, { foreignKey: 'id_categoria', as: 'categoriaInsumo' });

// Nuevas asociaciones

Pedido.hasMany(DetallePedido, { foreignKey: 'id_pedido', as: 'detallesPedido' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'id_pedido', as: 'pedidoDetalle' });

Producto.hasMany(DetallePedido, { foreignKey: 'id_producto', as: 'detallesPedido' });
DetallePedido.belongsTo(Producto, { foreignKey: 'id_producto', as: 'productoDetalle' });

// Asociaciones para OrdenProduccion y DetalleOrdenProduccion

OrdenProduccion.hasMany(DetalleOrdenProduccion, { foreignKey: 'id_orden', as: 'ordenProduccionDetalles' });
DetalleOrdenProduccion.belongsTo(OrdenProduccion, { foreignKey: 'id_orden', as: 'ordenProduccion' });

Producto.hasMany(DetalleOrdenProduccion, { foreignKey: 'id_producto', as: 'detalleOrdenProduccionProductos' });
DetalleOrdenProduccion.belongsTo(Producto, { foreignKey: 'id_producto', as: 'productoDetalleOrdenProduccion' });


// Asociaciones para OrdenVenta
OrdenProduccion.hasMany(OrdenVenta, { foreignKey: 'id_orden', as: 'ventasAsociadas' });
OrdenVenta.belongsTo(OrdenProduccion, { foreignKey: 'id_orden', as: 'ordenProduccion' });

// **Nuevas asociaciones con Estado**
// Compra
Compra.belongsTo(Estado, { foreignKey: 'id_estado', as: 'estadouno' });
Estado.hasMany(Compra, { foreignKey: 'id_estado', as: 'comprasuno' });

// OrdenProduccion
OrdenProduccion.belongsTo(Estado, { foreignKey: 'id_estado', as: 'estadodos' });
Estado.hasMany(OrdenProduccion, { foreignKey: 'id_estado', as: 'ordenesProduccionuno' });

// Pedido
Pedido.belongsTo(Estado, { foreignKey: 'id_estado', as: 'estadotres' });
Estado.hasMany(Pedido, { foreignKey: 'id_estado', as: 'pedidosuno' });

// Venta
Venta.belongsTo(Estado, { foreignKey: 'id_estado', as: 'estadocuatro' });
Estado.hasMany(Venta, { foreignKey: 'id_estado', as: 'ventasuno' });
