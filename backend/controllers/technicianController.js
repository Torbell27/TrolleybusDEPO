import Technician from "../models/Technician.js";

export const getAllTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.findAll();
    return res.status(200).json(technicians);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
