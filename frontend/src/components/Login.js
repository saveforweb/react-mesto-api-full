import Header from "./Header";
import React from "react";
import useForm from "../hooks/useForm"

function Login(props) {
    const { onAuthorizationUser } = props;
    const { values, handleChange, setValues } = useForm({ email: '', password: '' });
    const { email, password } = values;

    React.useEffect(() => {
        setValues({ email: '', password: '' })
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        onAuthorizationUser(values);
    }

    return (
        <>
            <Header link='/sign-up' text='Регистрация' />
            <div className="page-form">
                <h2 className="page-form__title">Вход</h2>
                <form
                    className="page-form__form"
                    name="login"
                    onSubmit={handleSubmit}
                    autoComplete="off"
                >
                    <fieldset className="page-form__form-items">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            className="page-form__input"
                            minLength={2}
                            maxLength={40}
                            required
                            onChange={handleChange}
                            value={email}
                        />
                        <span className="name-error page-form__error"></span>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Пароль"
                            className="page-form__input"
                            minLength={2}
                            maxLength={200}
                            required
                            onChange={handleChange}
                            value={password}
                        />
                        <span className="name-error page-form__error"></span>

                        <button type="submit" className="page-form__submit-button">Войти</button>
                    </fieldset>
                </form>
            </div>
        </>
    )
}

export default Login;