// models/CategoriaInsumo.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class CategoriaInsumo extends Model {
    static associate(models) {
      CategoriaInsumo.hasMany(models.Insumo, { foreignKey: 'id_categoria', as: 'insumos' });
    }
  }

  CategoriaInsumo.init({
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'CategoriaInsumo',
    tableName: 'categoria_insumos',
    timestamps: true,
  });

  return CategoriaInsumo;
};
