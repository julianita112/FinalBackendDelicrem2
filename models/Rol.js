'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Rol extends Model {
    static associate(models) {
      Rol.belongsToMany(models.Permiso, { through: models.RolPermiso, foreignKey: 'id_rol', as: 'permisosRol' });
      Rol.hasMany(models.Usuario, { foreignKey: 'id_rol', as: 'usuariosRol' });
    }
  }

  Rol.init({
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
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
    modelName: 'Rol',
    tableName: 'roles',
    timestamps: true,
  });

  return Rol;
};
