// models/OrdenVenta.js

'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class OrdenVenta extends Model {
    static associate(models) {
      // Definimos la asociación con OrdenProduccion
      OrdenVenta.belongsTo(models.OrdenProduccion, {
        foreignKey: 'id_orden',
        as: 'ordenProducciont'
      });
    }
  }

  OrdenVenta.init({
    id_orden_venta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'OrdenProduccion',
        key: 'id_orden'
      }
    },
    numero_venta: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'OrdenVenta',
    tableName: 'OrdenVenta',
    timestamps: false
  });

  return OrdenVenta;
};
