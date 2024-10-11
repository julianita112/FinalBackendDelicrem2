'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Producto extends Model {
    static associate(models) {
      Producto.hasMany(models.DetalleVenta, { foreignKey: 'id_producto', as: 'detalleVentasProducto' });
      Producto.hasMany(models.FichaTecnica, { foreignKey: 'id_producto', as: 'fichasTecnicasProducto' });
    }
  }

  Producto.init({
    id_producto: {
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
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
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
    modelName: 'Producto',
    tableName: 'productos',
    timestamps: true,
  });

  return Producto;
};
