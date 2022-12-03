import React from "react";
import PopupWithForm from "./PopupWithForm";
import useForm from "../hooks/useForm"
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup(props) {
    const { isOpen, onClose, onUpdateUser, isLoading } = props;

    const { values, handleChange, setValues } = useForm({ name: '', subtitle: '' });
    const { name , subtitle } = values;

    const currentUser = React.useContext(CurrentUserContext);

    React.useEffect(() => {
        setValues({ name: currentUser.name, subtitle: currentUser.about })
    }, [currentUser, isOpen]);

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateUser({ name, about: subtitle });
    }

    return (
        <PopupWithForm
            title="Редактировать профиль"
            name="profile"
            isOpen={isOpen}
            onClose={onClose}
            buttonText={isLoading ? 'Сохранение...' : 'Сохранить'}
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                id="name"
                name="name"
                placeholder="Имя"
                className="popup__input popup__input_type_profile-name"
                minLength={2}
                maxLength={40}
                required
                onChange={handleChange}
                value={name}
            />
            <span className="name-error popup__error"></span>
            <input
                type="text"
                id="subtitle"
                name="subtitle"
                placeholder="Роль"
                className="popup__input popup__input_type_profile-subtitle"
                minLength={2}
                maxLength={200}
                required
                onChange={handleChange}
                value={subtitle}
            />
            <span className="subtitle-error popup__error"></span>
        </PopupWithForm>
    )

}

export default EditProfilePopup;