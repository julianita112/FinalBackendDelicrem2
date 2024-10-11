const { FichaTecnica, DetalleFichaTecnica, Insumo } = require('../models');


exports.agregarFichaTecnica = async (req, res) => {
  const { id_producto, descripcion, insumos, detallesFichaTecnica, estado = true } = req.body;
  try {
    const fichaTecnica = await FichaTecnica.create({ id_producto, descripcion, insumos, estado });
    if (detallesFichaTecnica && detallesFichaTecnica.length > 0) {
      for (let detalle of detallesFichaTecnica) {
        await DetalleFichaTecnica.create({ ...detalle, id_ficha: fichaTecnica.id_ficha });
      }
    }
    const fichaTecnicaCompleta = await FichaTecnica.findByPk(fichaTecnica.id_ficha, {
      include: [{ model: DetalleFichaTecnica, as: 'detallesFichaTecnicat' }]
    });
    res.status(201).json(fichaTecnicaCompleta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listarFichasTecnicas = async (req, res) => {
  try {
    const fichasTecnicas = await FichaTecnica.findAll({
      include: [{ model: DetalleFichaTecnica, as: 'detallesFichaTecnicat' }]
    });
    res.json(fichasTecnicas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerFichasTecnicasActivas = async (req, res) => {
  try {
    const fichasTecnicas = await FichaTecnica.findAll({
      where: { estado: true },
      include: [{ model: DetalleFichaTecnica, as: 'detallesFichaTecnicat' }]
    });
    res.json(fichasTecnicas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerFichaTecnicaPorId = async (req, res) => {
  try {
    const fichaTecnica = await FichaTecnica.findByPk(req.params.id, {
      include: { model: DetalleFichaTecnica, as: 'detallesFichaTecnicat' }
    });
    if (!fichaTecnica) {
      return res.status(404).json({ error: 'Ficha técnica no encontrada' });
    }
    res.json(fichaTecnica);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.editarFichaTecnica = async (req, res) => {
  const { id } = req.params;
  const { id_producto, descripcion, insumos, detallesFichaTecnica } = req.body;

  try {
    const fichaTecnica = await FichaTecnica.findByPk(id);

    if (!fichaTecnica) {
      return res.status(404).json({ error: 'Ficha técnica no encontrada' });
    }

    await fichaTecnica.update({ id_producto, descripcion, insumos });

    if (Array.isArray(detallesFichaTecnica)) {
      const detalleIds = detallesFichaTecnica.map(detalle => detalle.id_detalle_ficha);
      
      // Obtener los detalles actuales de la ficha técnica
      const detallesActuales = await DetalleFichaTecnica.findAll({ where: { id_ficha: fichaTecnica.id_ficha } });

      // Eliminar los detalles que no están en los nuevos IDs
      for (let detalleActual of detallesActuales) {
        if (!detalleIds.includes(detalleActual.id_detalle_ficha)) {
          await detalleActual.destroy();
        }
      }

      // Crear o actualizar los detalles
      for (let detalle of detallesFichaTecnica) {
        const detalleExistente = await DetalleFichaTecnica.findByPk(detalle.id_detalle_ficha);

        if (detalleExistente) {
          await detalleExistente.update({
            id_insumo: detalle.id_insumo,
            cantidad: detalle.cantidad,
          });
        } else {
          await DetalleFichaTecnica.create({
            ...detalle,
            id_ficha: fichaTecnica.id_ficha,
          });
        }
      }
    }

    res.status(200).json(fichaTecnica);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cambiarEstadoFichaTecnica = async (req, res) => {
  const { estado } = req.body;

  try {
    const fichaTecnica = await FichaTecnica.findByPk(req.params.id);

    if (!fichaTecnica) {
      return res.status(404).json({ error: 'Ficha técnica no encontrada' });
    }

    fichaTecnica.estado = estado;
    await fichaTecnica.save();

    res.json(fichaTecnica);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.eliminarFichaTecnica = async (req, res) => {
  const { id } = req.params;

  try {
    const fichaTecnica = await FichaTecnica.findByPk(id);

    if (!fichaTecnica) {
      return res.status(404).json({ error: 'Ficha técnica no encontrada' });
    }

    await DetalleFichaTecnica.destroy({ where: { id_ficha: id } });
    await fichaTecnica.destroy();

    res.status(200).json({ message: 'Ficha técnica eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

