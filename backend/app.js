const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const { errorCodes } = require('./utils/errorCodes');
const errorsList = require('./errors/index');
const regexList = require('./utils/regexList');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connected to MongoDB');
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexList.urlRegex),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

// app.use(auth);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new errorsList.NotFoundError('Страница не найдена.'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = errorCodes.internalServerError, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === errorCodes.internalServerError
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
