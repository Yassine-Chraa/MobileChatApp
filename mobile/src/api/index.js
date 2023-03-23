const API_URL = 'http://192.168.1.5:5000/api';
const endpoints = {
  Auth: '/auth',
  Messages: '/messages',
};

export const getUrl = endpoint => {
  return API_URL + endpoints[endpoint];
};
