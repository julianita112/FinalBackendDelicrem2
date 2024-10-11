'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class DetallePedido extends Model {
    static associate(models) {
      DetallePedido.belongsTo(models.Pedido, { foreignKey: 'id_pedido', as: 'pedidoDetallep' });
    }
  }

  DetallePedido.init({
    id_detalle_pedido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    }
  }, {
    sequelize,
    modelName: 'DetallePedido',
    tableName: 'detalle_pedidos',
    timestamps: true,
  });

  return DetallePedido;
};
