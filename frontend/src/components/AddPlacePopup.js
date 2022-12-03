import React from "react";
import PopupWithForm from "./PopupWithForm";
import useForm from "../hooks/useForm"

function AddPlacePopup(props) {
    const { isOpen, onClose, onAddPlace, isLoading } = props;

    const { values, handleChange, setValues } = useForm({ place: '', link: '' });
    const { place: name, link } = values;

    React.useEffect(() => {
        setValues({ place: '', link: '' })
    }, [isOpen]);

    function handleSubmit(e) {
        e.preventDefault();
        onAddPlace({ name, link });
    }

    return (
        <PopupWithForm
            title="Новое место"
            name="content"
            isOpen={isOpen}
            onClose={onClose}
            buttonText={isLoading ? 'Сохранение...' : 'Сохранить'}
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                id="place"
                name="place"
                placeholder="Название"
                className="popup__input popup__input_type-content-place"
                minLength={2}
                maxLength={30}
                required
                onChange={handleChange}
                value={name}
            />
            <span className="place-error popup__error"></span>
            <input
                type="url"
                id="link"
                name="link"
                placeholder="Ссылка на картинку"
                className="popup__input popup__input_type-content-link"
                required
                onChange={handleChange}
                value={link}
            />
            <span className="link-error popup__error"></span>
        </PopupWithForm>
    )

}

export default AddPlacePopup;