const jwt = require('jsonwebtoken');
const winston = require('winston');
const errorsList = require('../errors/index');

const logger = winston.createLogger();

const { tokenString = 'dev-secret' } = process.env;

module.exports = (req, res, next) => {
  logger.info(req.baseUrl);
  logger.info(req);

  const token = req.cookies.jwt;

  if (!token) {
    throw new errorsList.UnauthorizedError('Необходима авторизация.');
  }

  let payload;

  try {
    payload = jwt.verify(token, tokenString);
  } catch (err) {
    throw new errorsList.UnauthorizedError('Необходима авторизация.');
  }

  req.user = payload;

  return next();
};
