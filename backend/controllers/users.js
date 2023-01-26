const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const errorsList = require('../errors/index');

const tokenString = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const findUserById = (req, res, next, userId) => {
  User.findById(userId)
    .then((user) => {
      if (user === null) {
        next(new errorsList.NotFoundError('Пользователь не найден.'));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errorsList.BadRequestError('Переданы некорректные данные при запросе пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports.getUser = (req, res, next) => {
  findUserById(req, res, next, req.params.userId);
};

module.exports.getCurrentUser = (req, res, next) => {
  findUserById(req, res, next, req.user._id);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((document) => {
      const user = document.toObject();
      delete user.password;
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new errorsList.BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new errorsList.ConflictError('Пользователь с таким email зарегистрован.'));
      } else {
        next(err);
      }
    });
};

module.exports.updateInfoUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user === null) {
        next(new errorsList.NotFoundError('Пользователь не найден.'));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errorsList.BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.name === 'ValidationError') {
        next(new errorsList.BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user === null) {
        next(new errorsList.NotFoundError('Пользователь не найден.'));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errorsList.BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.name === 'ValidationError') {
        next(new errorsList.BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let userId;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new errorsList.UnauthorizedError('Неправильные почта или пароль.'));
      }

      userId = user._id;

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return next(new errorsList.UnauthorizedError('Неправильные почта или пароль.'));
      }

      const token = jwt.sign({ _id: userId }, tokenString, { expiresIn: '7d' });

      return res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
