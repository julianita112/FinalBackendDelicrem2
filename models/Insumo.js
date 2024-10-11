// models/Insumo.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Insumo extends Model {
    static associate(models) {
      Insumo.belongsTo(models.CategoriaInsumo, { foreignKey: 'id_categoria', as: 'categoria' });
      Insumo.hasMany(models.DetalleFichaTecnica, { foreignKey: 'id_insumo', as: 'detalleFichasTecnicas' });
      Insumo.hasMany(models.DetalleCompra, { foreignKey: 'id_insumo', as: 'detalleCompras' });
    }
  }

  Insumo.init({
    id_insumo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock_actual: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unidad_medida: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
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
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'CategoriaInsumo',
        key: 'id_categoria',
      },
    },
  }, {
    sequelize,
    modelName: 'Insumo',
    tableName: 'insumos',
    timestamps: true,
  });

  return Insumo;
};
