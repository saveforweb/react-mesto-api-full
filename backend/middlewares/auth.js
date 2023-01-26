const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const errorsList = require('../errors/index');

const tokenString = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new errorsList.UnauthorizedError('Необходима авторизация.');
  }

  const token = extractBearerToken(authorization);

  let payload;

  try {
    payload = jwt.verify(token, tokenString);
  } catch (err) {
    throw new errorsList.UnauthorizedError('Необходима авторизация.');
  }

  req.user = payload;

  return next();
};
