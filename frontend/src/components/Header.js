import logo from '../images/logo.svg';
function Header(props) {
    const { link, text, loggedIn, onLogout, emailUser } = props;
    return (
        <header className="header">
            <img
                src={logo}
                alt="Место Россия"
                className="header__logo"
            />
            <div className='header__links'>
                {loggedIn && <div className="header__name">{emailUser}</div>}
                <a href={link} className="header__link" onClick={onLogout}>{text}</a>
            </div>
        </header>
    )
}

export default Header;