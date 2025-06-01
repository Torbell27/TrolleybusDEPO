export const test = async (req, res, next) => {
  try {
    res.status(200).json({ success: "test" });
  } catch (error) {
    next(error);
  }
};
