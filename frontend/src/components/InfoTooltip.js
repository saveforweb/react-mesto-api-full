import elementSuccesIcon from '../images/element-succes-icon.svg';
import elementErrorIcon from '../images/element-error-icon.svg';

function InfoTooltip(props) {

    const { name, isOpen, onClose, content } = props;

    return (
        <div className={`popup popup-${name} ${isOpen ? 'popup_open' : ''}`} onClick={onClose}>
            <div className="popup__window">
                <button
                    type="button"
                    className="popup__button-close"
                    onClick={onClose}
                />
                <img src={` ${!content.icon ? elementErrorIcon : elementSuccesIcon}`} className="popup__icon" />
                <div className='popup__text'>{content.text}</div>
            </div>
        </div>
    )
}

export default InfoTooltip;