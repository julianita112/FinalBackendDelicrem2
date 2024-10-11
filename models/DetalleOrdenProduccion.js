'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class DetalleOrdenProduccion extends Model {
    static associate(models) {
      DetalleOrdenProduccion.belongsTo(models.OrdenProduccion, { foreignKey: 'id_orden', as: 'ordenProduccionDetalle' });
      DetalleOrdenProduccion.belongsTo(models.Producto, { foreignKey: 'id_producto', as: 'productoDetalleOrden' });
    }
  }

  DetalleOrdenProduccion.init({
    id_detalle_orden: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_orden: {
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
    modelName: 'DetalleOrdenProduccion',
    tableName: 'detalle_orden_produccion',
    timestamps: true,
  });

  return DetalleOrdenProduccion;
};
