const Card = require('../models/card');
const errorsList = require('../errors/index');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => {
      Card.findById(card._id)
        .populate(['owner', 'likes'])
        .then(() => {
          res.send({ data: card });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new errorsList.BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        next(new errorsList.NotFoundError('Карточка не найдена.'));
      } else if (card.owner.toString() === req.user._id) {
        Card.deleteOne()
          .then(() => {
            res.send({ data: card });
          });
      } else {
        next(new errorsList.ForbiddenError('Это не ваша карточка!'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errorsList.BadRequestError('Переданы некорректные данные при удалении карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        next(new errorsList.NotFoundError('Карточка не найдена.'));
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errorsList.BadRequestError('Переданы некорректные данные при удалении карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        next(new errorsList.NotFoundError('Карточка не найдена.'));
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errorsList.BadRequestError('Переданы некорректные данные для постановки лайка.'));
      } else {
        next(err);
      }
    });
};
