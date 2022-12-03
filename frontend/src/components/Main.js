import React from "react";
import Card from "./Card";
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main(props) {
  const { onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards, onCardLike, onCardDelete } = props;

  const currentUser = React.useContext(CurrentUserContext);

  const cardList = cards.map((card) => {
    return (
      <Card
        key={card._id}
        card={card}
        onCardLike={onCardLike}
        onCardDelete={onCardDelete}
        onCardClick={onCardClick}
      />
    );
  });

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__main">
          <div
            onClick={onEditAvatar}
            className="profile__avatar-container"
          >
            <img
              src={currentUser.avatar}
              alt="Аватар пользователя"
              className="profile__avatar"
            />
          </div>
          <div className="profile__info">
            <div className="profile__name-block">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button
                onClick={onEditProfile}
                type="button"
                className="profile__edit-button"
              />
            </div>
            <p className="profile__subtitle">{currentUser.about}</p>
          </div>
        </div>
        <button
          onClick={onAddPlace}
          type="button"
          className="profile__add-button"
        />
      </section>
      <section className="elements">
        <ul className="elements__list">
          {cardList}
        </ul>
      </section>
    </main>
  );
}

export default Main;
