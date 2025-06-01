import { Op } from "sequelize";
import User from "../models/User.js";
import Conductor from "../models/Conductor.js";
import Driver from "../models/Driver.js";

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