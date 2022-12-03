import React from "react";
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card(props) {
    const { card, onCardClick, onCardLike, onCardDelete } = props;
    const currentUser = React.useContext(CurrentUserContext);

    function handleImageClick() {
        onCardClick(card);
    }

    function handleLikeClick() {
        onCardLike(card);
    }

    function handleDeleteClick() {
        onCardDelete(card);
    }


    const isOwn = card.owner._id === currentUser._id;
    const cardDeleteButtonClassName = (
        `element__trash-button ${isOwn ? 'element__trash-button_visible' : 'element__trash-button_hidden'}`
    );

    const isLiked = card.likes.some(i => i._id === currentUser._id);
    const cardLikeButtonClassName = (
        `element__like-button ${isLiked ? 'element__like-button_cheked' : 'element__like-button_uncheked'}`
    );


    return (
        <li className="element">
            <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
            <img
                src={card.link}
                alt={card.name}
                className="element__image"
                onClick={handleImageClick}
            />
            <div className="element__description">
                <h2 className="element__title">{card.name}</h2>
                <div className="element__like">
                    <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
                    <span className="element__like-count">{card.likes.length}</span>
                </div>
            </div>
        </li>
    )
};

export default Card;