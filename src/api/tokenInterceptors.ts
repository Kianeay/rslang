import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const axios = require('axios').default;

let retry: boolean;

const instance = axios.create({
  baseURL: 'https://react-learnwords2022.herokuapp.com/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    const conf = config;
    if (token) {
      conf.headers.Authorization = `Bearer ${token}`;
    }
    return conf;
  },
  (error: AxiosError) => Promise.reject(error),
);

instance.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err: AxiosError) => {
    const originalConfig = err.config;
    if (originalConfig.url !== '/auth/signin' && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !retry) {
        retry = true;
        try {
          const rs = await axios.get(`https://react-learnwords2022.herokuapp.com/users/${localStorage.getItem('userID')}/tokens`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
            },
          });
          const { token } = await rs.data;
          const { refreshToken } = await rs.data;

          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
          return instance(originalConfig);
        } catch (_error) {
          console.error(_error);
          localStorage.removeItem('userID');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  },
);
export default instance;
