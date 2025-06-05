import { Op } from "sequelize";
import User from "../models/User.js";
import Conductor from "../models/Conductor.js";
import Driver from "../models/Driver.js";
import Trolleybus from "../models/Trolleybus.js";
import Crew from "../models/Crew.js";

export const getAvailableConductors = async (req, res, next) => {
  try {
    const DEFAULT_LIMIT = 4;
    const { page = "0", search = "" } = req.query;

    const pageNumber = parseInt(page, 10);
    const offset = pageNumber * DEFAULT_LIMIT;

    const whereClause = search
      ? { name: { [Op.iLike]: `%${search}%` } }
      : {};

    const conductorWhereClause = {
      crew_id: null,
    };

    const { rows: conductors, count: total } = await Conductor.findAndCountAll({
      where: conductorWhereClause,
      attributes: ["user_id"],
      include: [
        {
          model: User,
          as: "User",
          attributes: ["name"],
          where: whereClause,
          required: true,
        },
      ],
      limit: DEFAULT_LIMIT,
      offset,
    });

    res.status(200).json({ conductors, total });
  } catch (error) {
    next(error);
  }
};

export const getAvailableDrivers = async (req, res, next) => {
  try {
    const DEFAULT_LIMIT = 4;
    const { page = "0", search = "" } = req.query;

    const pageNumber = parseInt(page, 10);
    const offset = pageNumber * DEFAULT_LIMIT;

    const whereClause = search
      ? { name: { [Op.iLike]: `%${search}%` } }
      : {};

    const driverWhereClause = {
      crew_id: null,
    };

    const { rows: drivers, count: total } = await Driver.findAndCountAll({
      where: driverWhereClause,
      attributes: ["user_id"],
      include: [
        {
          model: User,
          as: "User",
          attributes: ["name"],
          where: whereClause,
          required: true,
        },
      ],
      limit: DEFAULT_LIMIT,
      offset,
    });

    res.status(200).json({ drivers, total });
  } catch (error) {
    next(error);
  }
};

export const getAvailableTrolleybuses = async (req, res, next) => {
  try {
    const DEFAULT_LIMIT = 4;
    const { page = "0", search = "" } = req.query;

    const pageNumber = parseInt(page, 10);
    const offset = pageNumber * DEFAULT_LIMIT;

    const whereClause = {
      crew_id: null,
      ...(search && { number: { [Op.iLike]: `%${search}%` } }),
    };

    const { rows: trolleybuses, count: total } = await Trolleybus.findAndCountAll({
      where: whereClause,
      attributes: ["trolleybus_id", "number", "status"],
      limit: DEFAULT_LIMIT,
      offset,
    });

    res.status(200).json({ trolleybuses, total });
  } catch (error) {
    console.error("Ошибка при получении троллейбусов:", error);
    next(error);
  }
};

export const createCrew = async (req, res, next) => {
  const { driverId, conductorId, trolleybusId } = req.body;

  if (!driverId || !conductorId || !trolleybusId) {
    return res.status(400).json({
      error: "Все ID обязательны: driverId, conductorId, trolleybusId",
    });
  }

  const transaction = await Crew.sequelize.transaction();

  try {
    const crew = await Crew.create({}, { transaction });

    await Driver.update(
      { crew_id: crew.crew_id },
      { where: { user_id: driverId }, transaction }
    );

    await Conductor.update(
      { crew_id: crew.crew_id },
      { where: { user_id: conductorId }, transaction }
    );

    await Trolleybus.update(
      { crew_id: crew.crew_id },
      { where: { trolleybus_id: trolleybusId }, transaction }
    );

    await transaction.commit();

    res.status(201).json({
      message: "Экипаж успешно создан",
      crewId: crew.id,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

export const getCrews = async (req, res, next) => {
  try {
    const DEFAULT_LIMIT = 4;
    const { page = "0", search = "" } = req.query;

    const pageNumber = parseInt(page, 10);
    const offset = pageNumber * DEFAULT_LIMIT;

    const searchCondition = search
      ? {
          [Op.or]: [
            { "$Driver.User.name$": { [Op.iLike]: `%${search}%` } },
            { "$Conductor.User.name$": { [Op.iLike]: `%${search}%` } },
            { "$Trolleybus.number$": { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { rows: crews, count: total } = await Crew.findAndCountAll({
      where: searchCondition,
      include: [
        {
          model: Driver,
          include: [
            {
              model: User,
              as: "User",
              attributes: ["name"],
              required: true,
            },
          ],
          required: true,
        },
        {
          model: Conductor,
          include: [
            {
              model: User,
              as: "User",
              attributes: ["name"],
              required: true,
            },
          ],
          required: true,
        },
        {
          model: Trolleybus,
          attributes: ["trolleybus_id", "number", "status"],
          required: true,
        },
      ],
      limit: DEFAULT_LIMIT,
      offset,
      distinct: true,
    });

    res.status(200).json({ crews, total });
  } catch (error) {
    console.error("Ошибка при получении экипажей:", error);
    next(error);
  }
};

export const deleteCrew = async (req, res, next) => {
  try {
    const { crewId } = req.params;

    const crew = await Crew.findByPk(crewId);
    if (!crew) {
      return res.status(404).json({ message: "Экипаж не найден" });
    }

    await Promise.all([
      Driver.update({ crew_id: null }, { where: { crew_id: crewId } }),
      Conductor.update({ crew_id: null }, { where: { crew_id: crewId } }),
      Trolleybus.update({ crew_id: null }, { where: { crew_id: crewId } }),
    ]);

    await Crew.destroy({ where: { crew_id: crewId } });

    res.status(200).json({ message: "Экипаж успешно удалён" });
  } catch (error) {
    console.error("Ошибка при удалении экипажа:", error);
    next(error);
  }
};

export const updateDriver = async (req, res, next) => {
  try {
    const { crewId } = req.params;
    const { newDriverId } = req.body;

    const crew = await Crew.findByPk(crewId);
    if (!crew) {
      return res.status(404).json({ message: "Экипаж не найден" });
    }

    const oldDriver = await Driver.findOne({ where: { crew_id: crewId } });

    if (oldDriver) {
      await Driver.update(
        { crew_id: null },
        { where: { user_id: oldDriver.user_id } }
      );
    }

    await Driver.update(
      { crew_id: crewId },
      { where: { user_id: newDriverId } }
    );

    res.status(200).json({ message: "Водитель успешно обновлён" });
  } catch (error) {
    console.error("Ошибка при обновлении:", error);
    next(error);
  }
};

export const updateConductor = async (req, res, next) => {
  try {
    const { crewId } = req.params;
    const { newConductorId } = req.body;

    const crew = await Crew.findByPk(crewId);
    if (!crew) {
      return res.status(404).json({ message: "Экипаж не найден" });
    }

    const oldConductor = await Conductor.findOne({ where: { crew_id: crewId } });

    if (oldConductor) {
      await Conductor.update(
        { crew_id: null },
        { where: { user_id: oldConductor.user_id } }
      );
    }

    await Conductor.update(
      { crew_id: crewId },
      { where: { user_id: newConductorId } }
    );

    res.status(200).json({ message: "Кондуктор успешно обновлён" });
  } catch (error) {
    console.error("Ошибка при обновлении:", error);
    next(error);
  }
};

export const updateTrolleybus = async (req, res, next) => {
  try {
    const { crewId } = req.params;
    const { newTrolleybusId } = req.body;

    const crew = await Crew.findByPk(crewId);
    if (!crew) {
      return res.status(404).json({ message: "Экипаж не найден" });
    }

    const oldTrolleybus = await Trolleybus.findOne({ where: { crew_id: crewId } });

    if (oldTrolleybus) {
      await Trolleybus.update(
        { crew_id: null },
        { where: { trolleybus_id: oldTrolleybus.trolleybus_id } }
      );
    }

    await Trolleybus.update(
      { crew_id: crewId },
      { where: { trolleybus_id: newTrolleybusId } }
    );

    res.status(200).json({ message: "Троллейбус успешно обновлён" });
  } catch (error) {
    console.error("Ошибка при обновлении:", error);
    next(error);
  }
};