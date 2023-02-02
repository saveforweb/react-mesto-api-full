const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://anton.nomoredomains.club/api';

export const apiConfig = {
  baseUrl: baseUrl,
  headers: {
    "Content-Type": "application/json",
  }
}