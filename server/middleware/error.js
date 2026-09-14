export const notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
export const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  res.status(res.statusCode >= 400 ? res.statusCode : 500).json({ message: err.message || 'Server error' });
};
