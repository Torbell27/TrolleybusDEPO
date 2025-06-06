import Shift from "../models/Shift.js";
import Crew from "../models/Crew.js";
import Conductor from "../models/Conductor.js";
import Driver from "../models/Driver.js";
import Trolleybus from "../models/Trolleybus.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";

// Create a new shift
export const createShift = async (req, res) => {
  try {
    const { first_shift, crew_id, start_time, end_time } = req.body;

    if (!crew_id) {
      return res.status(400).json({ error: "Crew ID is required" });
    }

    // Проверка наличия временных меток
    if (!start_time || !end_time) {
      return res
        .status(400)
        .json({ error: "Both start_time and end_time are required" });
    }

    // Преобразование в Date объекты
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    // Проверка валидности дат
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Проверка что время начала раньше времени окончания
    if (startTime >= endTime) {
      return res.status(400).json({
        error: "Start time must be before end time",
      });
    }

    const crew = await Crew.findByPk(crew_id);
    if (!crew) {
      return res.status(404).json({ error: "Crew not found" });
    }

    // Проверка на пересечение с другими сменами экипажа
    const existingShift = await Shift.findOne({
      where: {
        crew_id,
        [Op.or]: [
          {
            start_time: { [Op.lt]: endTime },
            end_time: { [Op.gt]: startTime },
          },
          {
            completed: false,
            end_time: null,
          },
        ],
      },
    });

    if (existingShift) {
      return res.status(400).json({
        error: "Crew already has a shift during this time period",
      });
    }

    const shift = await Shift.create({
      shift_id: uuidv4(),
      first_shift: first_shift || false,
      start_time: startTime,
      end_time: endTime,
      crew_id,
      completed: false,
    });

    return res.status(201).json(shift);
  } catch (error) {
    console.error("Error creating shift:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// End a shift and setting end_time
export const endShift = async (req, res) => {
  try {
    const { shift_id } = req.params;
    const { end_time } = req.body;

    const shift = await Shift.findByPk(shift_id);
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }

    if (shift.completed) {
      return res.status(400).json({ error: "Shift already ended" });
    }

    let endTimeToSet;
    if (end_time) {
      endTimeToSet = new Date(end_time);
      if (isNaN(endTimeToSet.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }
      if (endTimeToSet <= shift.start_time) {
        return res.status(400).json({
          error: "End time must be after start time",
        });
      }
      shift.end_time = endTimeToSet;
    }
    shift.completed = true;
    await shift.save();

    return res.status(200).json(shift);
  } catch (error) {
    console.error("Error ending shift:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all shifts with proper date formatting
export const getAllShifts = async (req, res) => {
  try {
    const DEFAULT_LIMIT = 8;
    const { page = "0" } = req.query;

    const pageNumber = parseInt(page, 10);
    const offset = pageNumber * DEFAULT_LIMIT;

    const { rows: shifts, count: total } = await Shift.findAndCountAll({
      include: [
        {
          model: Crew,
          as: "Crew",
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
          required: true,
        },
      ],
      order: [["start_time", req.query.sort === "asc" ? "ASC" : "DESC"]],
      limit: DEFAULT_LIMIT,
      offset,
    });

    const formattedShifts = shifts.map((shift) => ({
      ...shift.get({ plain: true }),
      start_time: shift.start_time.toISOString(),
      end_time: shift.end_time ? shift.end_time.toISOString() : null,
    }));

    return res.status(200).json({ formattedShifts, total });
  } catch (error) {
    console.error("Error getting shifts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get active shifts (where end_time is null)
export const getActiveShifts = async (req, res) => {
  try {
    const shifts = await Shift.findAll({
      where: {
        end_time: null,
      },
      include: [
        {
          model: Crew,
          as: "Crew",
        },
      ],
    });
    return res.status(200).json(shifts);
  } catch (error) {
    console.error("Error getting active shifts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get shift by ID
export const getShiftById = async (req, res) => {
  try {
    const { shift_id } = req.params;
    const shift = await Shift.findByPk(shift_id, {
      include: [
        {
          model: Crew,
          as: "Crew",
        },
      ],
    });

    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }

    return res.status(200).json(shift);
  } catch (error) {
    console.error("Error getting shift:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update shift (only allowed fields)
export const updateShift = async (req, res) => {
  try {
    const { shift_id } = req.params;
    const { first_shift, crew_id } = req.body;

    // Find the shift
    const shift = await Shift.findByPk(shift_id);
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }

    // Validate updates
    if (crew_id) {
      const crew = await Crew.findByPk(crew_id);
      if (!crew) {
        return res.status(404).json({ error: "Crew not found" });
      }
      shift.crew_id = crew_id;
    }

    if (first_shift !== undefined) {
      shift.first_shift = first_shift;
    }

    await shift.save();
    return res.status(200).json(shift);
  } catch (error) {
    console.error("Error updating shift:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete shift
export const deleteShift = async (req, res) => {
  try {
    const { shift_id } = req.params;
    const shift = await Shift.findByPk(shift_id);

    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }

    await shift.destroy();
    return res.status(204).end();
  } catch (error) {
    console.error("Error deleting shift:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const getCrews = async (req, res, next) => {
  try {
    const DEFAULT_LIMIT = 4;
    const { page = "0", search = "" } = req.query;

    const pageNumber = parseInt(page, 10);
    const offset = pageNumber * DEFAULT_LIMIT;

    const { rows: crews, count: total } = await Crew.findAndCountAll({
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
    console.error("Ошибочка вышла:", error);
    next(error);
  }
};
