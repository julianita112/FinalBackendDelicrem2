'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class DetalleCompra extends Model {
    static associate(models) {
      DetalleCompra.belongsTo(models.Compra, { foreignKey: 'id_compra', as: 'compraDetalleCompra' });
      DetalleCompra.belongsTo(models.Insumo, { foreignKey: 'id_insumo', as: 'insumoDetalleCompra' });
    }
  }

  DetalleCompra.init({
    id_detalle_compra: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_compra: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_insumo: {
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
    modelName: 'DetalleCompra',
    tableName: 'detallecompras',
    timestamps: true,
  });

  return DetalleCompra;
};
