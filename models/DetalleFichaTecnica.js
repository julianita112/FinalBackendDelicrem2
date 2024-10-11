'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class DetalleFichaTecnica extends Model {
    static associate(models) {
      DetalleFichaTecnica.belongsTo(models.FichaTecnica, { foreignKey: 'id_ficha', as: 'fichaTecnicaDetalleFichaTecnica' });
      DetalleFichaTecnica.belongsTo(models.Insumo, { foreignKey: 'id_insumo', as: 'insumoDetalleFichaTecnica' });
    }
  }

  DetalleFichaTecnica.init({
    id_detalle_ficha: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_ficha: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_insumo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
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
    modelName: 'DetalleFichaTecnica',
    tableName: 'detallefichatecnicas',
    timestamps: true,
  });

  return DetalleFichaTecnica;
};
