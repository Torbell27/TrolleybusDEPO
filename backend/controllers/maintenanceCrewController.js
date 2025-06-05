import MaintenanceCrew from "../models/MaintenanceCrew.js";
import Technician from "../models/Technician.js";
import { Op } from "sequelize";

// Создание новой ремонтной бригады
export const createMaintenanceCrew = async (req, res) => {
  const transaction = await MaintenanceCrew.sequelize.transaction();
  try {
    const { name, status, technician_ids } = req.body;
    const maintenanceCrew = await MaintenanceCrew.create(
      { status, name },
      { transaction }
    );

    await transaction.commit();

    for (const technician_id of technician_ids)
      await Technician.update(
        { m_crew_id: maintenanceCrew.m_crew_id },
        { where: { user_id: technician_id } }
      );

    return res.status(201).json(maintenanceCrew);
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: error.message });
  }
};

// Получение всех ремонтных бригад
export const getAllMaintenanceCrews = async (req, res) => {
  try {
    const maintenanceCrews = await MaintenanceCrew.findAll({
      include: [{ model: Technician }],
    });
    return res.status(200).json(maintenanceCrews);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Получение конкретной ремонтной бригады по ID
export const getMaintenanceCrewById = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenanceCrew = await MaintenanceCrew.findByPk(id, {
      include: [{ model: Technician }],
    });
    if (!maintenanceCrew) {
      return res.status(404).json({ error: "Maintenance crew not found" });
    }
    return res.status(200).json(maintenanceCrew);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Обновление информации о ремонтной бригаде
export const updateMaintenanceCrew = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, technician_ids } = req.body;
    const [updated] = await MaintenanceCrew.update(
      { name, status },
      {
        where: { m_crew_id: id },
      }
    );
    if (updated) {
      const updatedMaintenanceCrew = await MaintenanceCrew.findByPk(id, {
        include: [{ model: Technician }],
      });

      const technicianIdsPrev = updatedMaintenanceCrew.Technicians.map(
        (e) => e.user_id
      );
      const difference = technicianIdsPrev.filter(
        (x) => !technician_ids.includes(x)
      );

      for (const technician_id of difference)
        await Technician.update(
          { m_crew_id: null },
          { where: { user_id: technician_id } }
        );

      for (const technician_id of technician_ids)
        await Technician.update(
          { m_crew_id: id },
          { where: { user_id: technician_id } }
        );
      return res.status(200).json(updatedMaintenanceCrew);
    }
    return res.status(404).json({ error: "Maintenance crew not found" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Удаление ремонтной бригады
export const deleteMaintenanceCrew = async (req, res) => {
  try {
    const { id } = req.params;

    const maintenanceCrew = await MaintenanceCrew.findByPk(id, {
      include: [{ model: Technician }],
    });
    if (!maintenanceCrew)
      return res.status(404).json({ error: "Maintenance crew not found" });

    const technicianIds = maintenanceCrew.Technicians.map((e) => e.user_id);
    for (const technicianId of technicianIds)
      await Technician.update(
        { m_crew_id: null },
        { where: { user_id: technicianId } }
      );

    const deleted = await MaintenanceCrew.destroy({
      where: { m_crew_id: id },
    });
    if (deleted) return res.status(204).send();
    return res.status(404).json({ error: "Maintenance crew not found" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Поиск ремонтных бригад по статусу (с пагинацией)
export const searchMaintenanceCrewsByStatus = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) {
      whereClause.status = {
        [Op.iLike]: `%${status}%`, // Case-insensitive поиск
      };
    }

    const { count, rows } = await MaintenanceCrew.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["name", "ASC"]], // Сортировка по имени
      include: [{ model: Technician }],
      distinct: true,
    });

    return res.status(200).json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      crews: rows,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
