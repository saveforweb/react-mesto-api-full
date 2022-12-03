const jwt = require('jsonwebtoken');
const winston = require('winston');
const expressWinston = require('express-winston');
const errorsList = require('../errors/index');

const logger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request1.log' }),
  ],
  format: winston.format.json(),
});

const { tokenString = 'dev-secret' } = process.env;

module.exports = (req, res, next) => {
  logger(req.baseUrl);
  logger(req);

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
