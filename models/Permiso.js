'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Permiso extends Model {
    static associate(models) {
      Permiso.belongsToMany(models.Rol, { through: models.RolPermiso, foreignKey: 'id_permiso', as: 'rolesPermiso' });
    }
  }

  Permiso.init({
    id_permiso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_permiso: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
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
    modelName: 'Permiso',
    tableName: 'permisos',
    timestamps: true,
  });

  return Permiso;
};
