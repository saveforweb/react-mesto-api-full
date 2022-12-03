function PopupWithForm(props) {

    const { title, name, isOpen, onClose, children, buttonText, onSubmit } = props;

    return (
        <div className={`popup popup-${name} ${isOpen ? 'popup_open' : ''}`} onClick={onClose}>
            <div className="popup__window">
                <button
                    type="button"
                    className="popup__button-close"
                    onClick={onClose}
                />
                <h2 className="popup__title">{title}</h2>
                <form
                    className={`popup__form popup__form_type_${name}`}
                    name={`edit-${name}`}
                    onSubmit={onSubmit}
                >
                    <fieldset className="popup__form-items">
                        {children}
                        <button type="submit" className="popup__button-save">{buttonText}</button>
                    </fieldset>
                </form>
            </div>
        </div>
    )
}

export default PopupWithForm;