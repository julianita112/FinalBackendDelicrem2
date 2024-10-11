'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Pedido extends Model {
    static associate(models) {
      Pedido.belongsTo(models.Cliente, { foreignKey: 'id_cliente', as: 'cliente' });
       // Asociación con Estado
       Pedido.belongsTo(models.Estado, { foreignKey: 'id_estado', as: 'estado' });
    }
  }

  Pedido.init({
    id_pedido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero_pedido: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fecha_entrega: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total: {
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
    motivo_anulacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Pedido',
    tableName: 'pedidos',
    timestamps: true,
  });

  return Pedido;
};
