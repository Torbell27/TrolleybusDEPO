import MaintenanceRecord from "../models/MaintenanceRecord.js";
import MaintenanceCrew from "../models/MaintenanceCrew.js";
import Trolleybus from "../models/Trolleybus.js";
import { Op } from "sequelize";

// Создание новой записи о ТО
export const createMaintenanceRecord = async (req, res) => {
  const transaction = await MaintenanceRecord.sequelize.transaction();
  try {
    const { planned, text, m_crew_id, trolleybus_id } = req.body;
    const maintenanceRecord = await MaintenanceRecord.create(
      {
        planned,
        text,
        m_crew_id,
        trolleybus_id: trolleybus_id || null,
      },
      { transaction }
    );
    await Trolleybus.update(
      { status: "Обслуживается" },
      {
        where: { trolleybus_id },
      }
    );
    await transaction.commit();
    return res.status(201).json(maintenanceRecord);
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: error.message });
  }
};

// Завершение ТО
export const completeMaintenanceRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { trolleybus_can_work, trolleybus_id } = req.body;
    await MaintenanceRecord.update(
      { completed: true },
      {
        where: { m_record_id: id },
      }
    );
    if (trolleybus_id)
      await Trolleybus.update(
        { status: !!trolleybus_can_work ? "Работает" : "В депо" },
        {
          where: { trolleybus_id },
        }
      );
    return res.status(200).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Получение всех записей о ТО с информацией о бригаде и троллейбусе
export const getAllMaintenanceRecords = async (req, res) => {
  try {
    const maintenanceRecords = await MaintenanceRecord.findAll({
      include: [{ model: MaintenanceCrew }, { model: Trolleybus }],
    });
    return res.status(200).json(maintenanceRecords);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Получение конкретной записи о ТО по ID
export const getMaintenanceRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenanceRecord = await MaintenanceRecord.findByPk(id, {
      include: [{ model: MaintenanceCrew }, { model: Trolleybus }],
    });
    if (!maintenanceRecord) {
      return res.status(404).json({ error: "Maintenance record not found" });
    }
    return res.status(200).json(maintenanceRecord);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Обновление записи о ТО
export const updateMaintenanceRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await MaintenanceRecord.update(req.body, {
      where: { m_record_id: id },
    });
    if (updated) {
      const updatedMaintenanceRecord = await MaintenanceRecord.findByPk(id, {
        include: [{ model: MaintenanceCrew }, { model: Trolleybus }],
      });
      return res.status(200).json(updatedMaintenanceRecord);
    }
    return res.status(404).json({ error: "Maintenance record not found" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Удаление записи о ТО
export const deleteMaintenanceRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MaintenanceRecord.destroy({
      where: { m_record_id: id },
    });
    if (deleted) {
      return res.status(204).send();
    }
    return res.status(404).json({ error: "Maintenance record not found" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Поиск записей ТО по тексту (с пагинацией)
export const searchMaintenanceRecords = async (req, res) => {
  try {
    const { text, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (text) {
      whereClause.text = {
        [Op.iLike]: `%${text}%`, // Case-insensitive поиск
      };
    }

    const { count, rows } = await MaintenanceRecord.findAndCountAll({
      where: whereClause,
      include: [{ model: MaintenanceCrew }, { model: Trolleybus }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["text", "DESC"]],
      distinct: true,
    });

    return res.status(200).json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      records: rows,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
