/**
 * Express API error handler.
 */
function errorHandler(err, req, res, next) {
  const { status = 404, message = "cannot be found" } = err;
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
