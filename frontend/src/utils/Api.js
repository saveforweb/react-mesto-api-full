import { apiConfig } from "./utils";

class Api {
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

  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers
    })
  }

  addUserCard(name, link) {
    return this._request(`${this._baseUrl}/cards`, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        link: link
      }),
      headers: this._headers
    })
  }

  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers
    })
  }

  updateUserInfo(name, about) {
    return this._request(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: name,
        about: about
      }),
      headers: this._headers
    })
  }

  updateUserAvatar(link) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      body: JSON.stringify({
        avatar: link,
      }),
      headers: this._headers
    })
  }

  deleleCard(id) {
    return this._request(`${this._baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: this._headers
    })
  }

  changeLikeCardStatus(id, isLiked) {
    if (!isLiked) {
      return this._request(`${this._baseUrl}/cards/${id}/likes `, {
        method: 'PUT',
        headers: this._headers
      })
    } else {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        method: 'DELETE',
        headers: this._headers
      })
    }

  }

}

export default new Api(apiConfig);