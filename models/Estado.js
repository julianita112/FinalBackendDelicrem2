// models/Estado.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Estado extends Model {
    static associate(models) {
      // Asociaciones definidas en el archivo de asociaciones
      // Asociaciones con las tablas relacionadas
      Estado.hasMany(models.Compra, { foreignKey: 'id_estado', as: 'compras' });
      Estado.hasMany(models.OrdenProduccion, { foreignKey: 'id_estado', as: 'ordenesProduccion' });
      Estado.hasMany(models.Pedido, { foreignKey: 'id_estado', as: 'pedidos' });
      Estado.hasMany(models.Venta, { foreignKey: 'id_estado', as: 'ventas' });
    }
  }

  Estado.init({
    id_estado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_estado: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Estado',
    tableName: 'estados',
    timestamps: false, // Asumiendo que utilizas timestamps
  });

  return Estado;
};
