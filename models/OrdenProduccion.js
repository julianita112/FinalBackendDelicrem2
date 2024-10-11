'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class OrdenProduccion extends Model {
    static associate(models) {
      OrdenProduccion.hasMany(models.DetalleOrdenProduccion, { foreignKey: 'id_orden', as: 'detallesOrdenProduccion' });
      // Asociación con Estado
      OrdenProduccion.belongsTo(models.Estado, { foreignKey: 'id_estado', as: 'estado' });
    }
  }

  OrdenProduccion.init({
    id_orden: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero_orden: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    id_estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_orden: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    motivo_anulacion: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: 'OrdenProduccion',
    tableName: 'orden_produccion',
    timestamps: true,
  });

  return OrdenProduccion;
};
