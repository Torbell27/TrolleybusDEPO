import Trolleybus from "../models/Trolleybus.js";

export const getAllTrolleybuses = async (req, res) => {
  try {
    const trolleybuses = await Trolleybus.findAll();
    return res.status(200).json(trolleybuses);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
