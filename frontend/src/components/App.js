import React from "react";
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import api from "../utils/Api";
import apiAuth from "../utils/ApiAuth";
import Login from "./Login";
import Register from "./Register";
import { ProtectedRoute } from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";

function App() {
  const navigate = useNavigate();
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({ name: '', link: '' });
  const [currentUser, setCurrentUser] = React.useState({ name: '', about: '' });
  const [currentUserEmail, setCurrentUserEmail] = React.useState('');
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
  const [contentTooltip, setContentTooltip] = React.useState({ text: '', icon: '' });

  React.useEffect(() => {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      apiAuth.checkToken(jwt)
        .then((result) => {
          setCurrentUserEmail(result.data.email);
          setLoggedIn(true);
          navigate("/");
        })
        .catch((result) => {
          console.log(result);
        })
    }
  }, []);

  React.useEffect(() => {
    if (loggedIn) {
      api.getInitialCards()
        .then((result) => {
          const { data } = result;
          const reverseData = data.reverse();
          setCards(reverseData);
        })
        .catch((result) => {
          console.log(result);
        })
      api.getUserInfo()
        .then((result) => {
          const { data } = result;
          setCurrentUser(data);
        })
        .catch((result) => {
          console.log(result);
        })
    }
  }, [loggedIn]
  );

  function handleCardLike(card) {
    console.log({'id лайкнутой карточки': card._id});
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, isLiked)
      .then((result) => {
        const { data } = result;
        setCards((state) => state.map((c) => c._id === card._id ? data : c));
      })
      .catch((result) => {
        console.log(result);
      })
  }

  function handleCardDelete(card) {
    console.log({'id карточки': card._id});
    api.deleleCard(card._id)
      .then((result) => {
        console.log({'ответ после удаления': result});
        setCards((state) => state.filter(c => c._id !== card._id));
      })
      .catch((result) => {
        console.log(result);
      })
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleOverlay(evt) {
    if (evt.target === evt.currentTarget) {
      closeAllPopups()
    }
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsTooltipOpen(false);
    setSelectedCard({ name: '', link: '' });
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser({ name, about }) {
    setIsLoading(true);
    api.updateUserInfo(name, about)
      .then((result) => {
        const { data } = result;
        setCurrentUser(data);
        closeAllPopups()
      })
      .catch((result) => {
        console.log(result);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  function handleAddPlaceSubmit({ name, link }) {
    setIsLoading(true);
    api.addUserCard(name, link)
      .then((result) => {
        console.log(result);
        const { data } = result;
        console.log(data);
        setCards([data, ...cards]);
        closeAllPopups()
      })
      .catch((result) => {
        console.log(result);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  function handleUpdateAvatar({ link }) {
    setIsLoading(true);
    api.updateUserAvatar(link)
      .then((result) => {
        const { data } = result;
        setCurrentUser(data);
        closeAllPopups()
      })
      .catch((result) => {
        console.log(result);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard.link || isTooltipOpen;

  React.useEffect(() => {
    function closeByEscape(e) {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen])

  function handleLogoutButton() {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    navigate("/sign-in");
  }

  function handleRegistrationSubmit({ email, password }) {
    apiAuth.registrationUser(email, password)
      .then((result) => {
        navigate("/sign-in");
        setContentTooltip({ text: 'Вы успешно зарегистрировались!', icon: true });
        setIsTooltipOpen(true);
      })
      .catch((result) => {
        setContentTooltip({ text: 'Что-то пошло не так! Попробуйте ещё раз.', icon: false });
        setIsTooltipOpen(true);
        console.log(result);
      })
  }

  function handleAuthorizationSubmit({ email, password }) {
    apiAuth.authorizationUser(email, password)
      .then((result) => {
        localStorage.setItem('jwt', result.token);
        setCurrentUserEmail(email);
        setLoggedIn(true);
        navigate("/");
      })
      .catch((result) => {
        setContentTooltip({ text: 'Что-то пошло не так! Попробуйте ещё раз.', icon: false });
        setIsTooltipOpen(true);
        console.log(result);
      })
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Header loggedIn={loggedIn} link='' text='Выйти' onLogout={handleLogoutButton} emailUser={currentUserEmail} />
              <Main
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
              <Footer />

              <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={handleOverlay} onUpdateUser={handleUpdateUser} isLoading={isLoading} />

              <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={handleOverlay} onAddPlace={handleAddPlaceSubmit} isLoading={isLoading} />

              <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={handleOverlay} onUpdateAvatar={handleUpdateAvatar} isLoading={isLoading} />

              <ImagePopup
                card={selectedCard}
                onClose={handleOverlay}
              />
            </ProtectedRoute>
          } />
          <Route path="/sign-in" element={
            <>
              <Login onAuthorizationUser={handleAuthorizationSubmit} />
              <InfoTooltip name='tooltip' isOpen={isTooltipOpen} onClose={handleOverlay} content={contentTooltip} />
            </>
          } />
          <Route path="/sign-up" element={
            <>
              <Register onRegistrationUser={handleRegistrationSubmit} />
              <InfoTooltip name='tooltip' isOpen={isTooltipOpen} onClose={handleOverlay} content={contentTooltip} />
            </>
          } />
          <Route
            path="*"
            element={<Navigate to="/sign-in" />}
          />
        </Routes>

      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
