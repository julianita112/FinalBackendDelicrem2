'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Proveedor extends Model {
    static associate(models) {
      Proveedor.hasMany(models.Compra, { foreignKey: 'id_proveedor', as: 'comprasProveedor' });
    }
  }

  Proveedor.init({
    id_proveedor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo_documento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_documento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contacto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    asesor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
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
    modelName: 'Proveedor',
    tableName: 'proveedores',
    timestamps: true,
  });

  return Proveedor;
};
