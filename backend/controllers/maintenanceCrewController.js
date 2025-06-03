import MaintenanceCrew from "../models/MaintenanceCrew.js";
import { Op } from "sequelize";

// Создание новой ремонтной бригады
export const createMaintenanceCrew = async (req, res) => {
  try {
    const { status } = req.body;
    const maintenanceCrew = await MaintenanceCrew.create({
      status,
    });
    return res.status(201).json(maintenanceCrew);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Получение всех ремонтных бригад
export const getAllMaintenanceCrews = async (req, res) => {
  try {
    const maintenanceCrews = await MaintenanceCrew.findAll();
    return res.status(200).json(maintenanceCrews);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Получение конкретной ремонтной бригады по ID
export const getMaintenanceCrewById = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenanceCrew = await MaintenanceCrew.findByPk(id);
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
    const [updated] = await MaintenanceCrew.update(req.body, {
      where: { m_crew_id: id },
    });
    if (updated) {
      const updatedMaintenanceCrew = await MaintenanceCrew.findByPk(id);
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
    const deleted = await MaintenanceCrew.destroy({
      where: { m_crew_id: id },
    });
    if (deleted) {
      return res.status(204).send();
    }
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
      order: [["status", "ASC"]], // Сортировка по статусу
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
