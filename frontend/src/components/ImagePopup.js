function ImagePopup(props) {

  const { card, onClose } = props;

  return (
    <div className={`popup popup_type_fullscreen popup-fullscreen ${card.link ? 'popup_open' : ''}`} onClick={onClose}>
      <div className="popup__window-fullscreen">
        <button
          type="button"
          className="popup__button-close popup__button-close_type_fullscreen"
          onClick={onClose}
        ></button>
        <img src={card.link} alt={card.name} className="popup__image" />
        <p className="popup__subtitle">{card.name}</p>
      </div>
    </div>
  );
}

export default ImagePopup;
