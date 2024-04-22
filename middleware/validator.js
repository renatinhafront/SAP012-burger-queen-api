const { validationResult } = require('express-validator');

module.exports = () => (req, resp, next) => {
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    return resp.status(400).json({ errors });
  }
  next();
};
