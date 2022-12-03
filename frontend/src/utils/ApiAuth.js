import { apiAuthConfig } from "./utils";

class ApiAuth {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse)
  }


  registrationUser(email, password) {
    return this._request(`${this._baseUrl}/signup`, {
      method: 'POST',
      body: JSON.stringify({
        password: password,
        email: email
      }),
      headers: this._headers
    })
  }

  authorizationUser(email, password) {
    return this._request(`${this._baseUrl}/signin`, {
      method: 'POST',
      body: JSON.stringify({
        password: password,
        email: email
      }),
      headers: this._headers
    })
  }

  checkToken(jwt) {
    return this._request(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${jwt}`
      }
    })
  }

}

export default new ApiAuth(apiAuthConfig);