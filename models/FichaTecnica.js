'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class FichaTecnica extends Model {
    static associate(models) {
      FichaTecnica.belongsTo(models.Producto, { foreignKey: 'id_producto', as: 'productoFichaTecnica' });
      FichaTecnica.hasMany(models.DetalleFichaTecnica, { foreignKey: 'id_ficha', as: 'detallesFichaTecnica' });
    }
  }

  FichaTecnica.init({
    id_ficha: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    insumos: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    modelName: 'FichaTecnica',
    tableName: 'fichatecnicas',
    timestamps: true,
  });

  return FichaTecnica;
};
