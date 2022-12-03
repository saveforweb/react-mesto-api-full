const jwt = require('jsonwebtoken');
const errorsList = require('../errors/index');

const { tokenString = 'dev-secret' } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new errorsList.UnauthorizedError(`Необходима авторизация.${req.baseUrl}`);
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
