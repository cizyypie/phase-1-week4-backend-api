export const handleError = (res, error) => {
  if (error.name === "ZodError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.errors,
    });
  }
  return res.status(500).json({ message: error.message });
};