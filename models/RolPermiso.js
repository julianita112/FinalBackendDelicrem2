'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class RolPermiso extends Model {
    static associate(models) {}
  }

  RolPermiso.init({
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Rol',
        key: 'id_rol',
      },
    },
    id_permiso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Permiso',
        key: 'id_permiso',
      },
    },
  }, {
    sequelize,
    modelName: 'RolPermiso',
    tableName: 'rol_permiso',
    timestamps: false,
  });

  return RolPermiso;
};
