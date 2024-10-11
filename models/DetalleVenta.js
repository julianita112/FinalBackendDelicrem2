'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class DetalleVenta extends Model {
    static associate(models) {
      DetalleVenta.belongsTo(models.Venta, { foreignKey: 'id_venta', as: 'ventaDetalleVenta' });
      DetalleVenta.belongsTo(models.Producto, { foreignKey: 'id_producto', as: 'productoDetalleVenta' });
    }
  }

  DetalleVenta.init({
    id_detalle_venta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_venta: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'DetalleVenta',
    tableName: 'detalleventa',
    timestamps: true,
  });

  return DetalleVenta;
};
