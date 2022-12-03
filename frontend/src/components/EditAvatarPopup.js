import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
    const { isOpen, onClose, onUpdateAvatar, isLoading } = props;
    const inputImageUrl = React.useRef('');

    React.useEffect(() => {
        inputImageUrl.current.value = '';
    }, [isOpen]);

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateAvatar({
            link: inputImageUrl.current.value
        });
    }

    return (
        <PopupWithForm
            title="Обновить аватар"
            name="avatar"
            isOpen={isOpen}
            onClose={onClose}
            buttonText={isLoading ? 'Сохранение...' : 'Сохранить'}
            onSubmit={handleSubmit}
        >
            <input
                type="url"
                id="avatarlink"
                name="avatarlink"
                defaultValue={''}
                placeholder="Ссылка на картинку"
                className="popup__input popup__input_type-avatarlink"
                required
                ref={inputImageUrl}
            />
            <span className="avatarlink-error popup__error"></span>
        </PopupWithForm>
    )

}

export default EditAvatarPopup;