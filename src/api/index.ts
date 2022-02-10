import { AxiosDefaults, AxiosError } from 'axios';
import instance from './tokenInterceptors';

enum EndPoints {
  BASE_URL = 'https://react-learnwords2022.herokuapp.com/',
  WORDS_URL = 'https://react-learnwords2022.herokuapp.com/words',
  USERS_URL = 'https://react-learnwords2022.herokuapp.com/users',
  SIGNIN_URL = 'https://react-learnwords2022.herokuapp.com/signin',
}

const axios = require('axios').default;

const instanceUser = axios.create({
  baseURL: 'https://react-learnwords2022.herokuapp.com/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

type Words = {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  wordTranslate: string,
  textMeaningTranslate: string,
  textExampleTranslate: string
}

type Count = {
  count: number;
}

export type AggregatedWords = {
  paginatedResults: Words[];
  totalCount: Count[];
}

type User = {
  name?: string;
  email: string;
  password: string;
}

type OptionalObj = {
  [key: string]: string;
}

type MongoDB_ObjectAnd = {
  '$and': OptionalObj[];
}
export type MongoDB_ObjectOr = {
  '$or': OptionalObj[];
}

export type MongoDB_ObjectOrAnd = {
  '$or': MongoDB_ObjectAnd[];
}

type MongoDB_Object = OptionalObj | MongoDB_ObjectAnd | MongoDB_ObjectOr | MongoDB_ObjectOrAnd;

export type UsersWordParameter = {
  difficulty: string;
  optional?: OptionalObj;
}

export type UserStatistic = {
  learnedWords: number;
  options?: OptionalObj;
}

export type UserSettings = {
  wordsPerDay: number;
  options?: OptionalObj;
}

interface OptionsObj {
  method?: string;
  headers?: Headers;
  body?: string;
  filter?: MongoDB_Object;
}

type Headers = {
  Authorization?: string;
  Accept?: string;
  'Content-Type'?: string;
}

type MultiOptionalObj = OptionalObj | UsersWordParameter | UserStatistic | UserSettings;

const getId = () => localStorage.getItem('userID');

const setLocalTokens = (token: string, refreshToken: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
};
const setLocalId = (id: string) => localStorage.setItem('userID', id);

const load = async (url: string, options: OptionsObj) => {
  const token = localStorage.getItem('token');
  const makeOpt = { ...options };
  if (makeOpt.headers) {
    makeOpt.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  } else {
    makeOpt.headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  }
  try {
    const promise = await fetch(url, makeOpt);
    return promise;
  } catch (error) {
    console.error(error.message);
  }
  return null;
};

const handleAxiosError = async (error: AxiosError, data: string) => {
  switch (error.response.status) {
    case 404:
      console.error(`${data} not found`);
      break;
    case 403:
      // logout => modal window signIn
      console.error('incorect email or password');
      break;
    case 417:
      console.error(`${data} has been create`);
      break;
    case 422:
      console.error('Incorrect e-mail or password');
      break;
    case 400:
      console.error('Bad request');
      break;
    default:
      console.error('uncaught error');
  }
};

const requestWrapper = async (url: string, options: OptionalObj, type: string) => {
  try {
    let response = await load(url, options);
    if (!response.ok && response.status === 401) {
      response = await load(url, options);
    }
    if (!response.ok) {
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
  return null;
};

const axiosRequestWrapper = async (
  method: string,
  url: string,
  data: MultiOptionalObj,
  type: string,
  params?: OptionalObj,
) => {
  try {
    const response: AxiosDefaults = await instance({ method, url, data, params });

    return response.data;
  } catch (e) {
    handleAxiosError(e, type);
  }

  return null;
};

export const createUser = async (userData: User) => {
  try {
    const response = await instanceUser.post('users', userData);

    return response.data;
  } catch (e) {
    handleAxiosError(e, 'user');
  }

  return null;
};

// Регистрация User
export const signIn = async (userData: User) => {
  try {
    const response = await instanceUser.post('signin', userData);
    setLocalTokens(response.data.token, response.data.refreshToken);
    setLocalId(response.data.userId);

    return response.data;
  } catch (e) {
    handleAxiosError(e, 'user');
  }

  return null;
};

// Получить User
export const getUser = async () => {
  const response = await axiosRequestWrapper('Get', `/users/${getId()}`, {}, 'user');

  return response;
};

// Изменить пользователя
export const changeUserParameters = async (userData: User) => {
  const response = await axiosRequestWrapper('PUT', `/users/${getId()}`, userData, 'user');

  return response;
};

// Удалить пользователя
export const removeUser = async () => {
  const response = await axiosRequestWrapper('DELETE', `/users/${getId()}`, {}, 'user');
  localStorage.removeItem('userID');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  console.log('The user has been deleted');
};

// Получить все слова с базы данных
export const getWords = async (group: string, page: string) => {
  //const response = await fetch(`${EndPoints.WORDS_URL}?` + new URLSearchParams({ group: group, page: page, }));
  const response = await fetch(`${EndPoints.WORDS_URL}?page=${page}&group=${group}`);
  if (!response.ok) {
    return null;
  } else {
    const result: Array<Words> = await response.json();
    return result;
  }
};

// Получить одно слово с базы данных по его ID
export const getWord = async (id: string) => {
  try {
    const response = await axios.get(`https://react-learnwords2022.herokuapp.com/words/${id}`);

    return response.data as Words;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error, 'words');
    } else {
      console.error('uncaught error');
    }
  }

  return null;
};

// Получить все слова User
export const getUserWords = async () => {
  const response = await axiosRequestWrapper('Get', `/users/${getId()}/words`, {}, 'user Words');

  return response;
};

// Получить слово Юзера по ID
export const getUserWordsId = async (wordId: string) => {
  const response = await axiosRequestWrapper('Get', `/users/${getId()}/words/${wordId}`, {}, 'user Words');

  return response;
};

// Записать слово Юзеру
export const createUserWords = async (wordId: string, userWordParameter: UsersWordParameter) => {
  const response = await axiosRequestWrapper('POST', `/users/${getId()}/words/${wordId}`, userWordParameter, 'user words');

  return response;
};

// Изменить слово пользователя
export const changeUserWord = async (wordId: string, userWordParameter: UsersWordParameter) => {
  const response = await axiosRequestWrapper('PUT', `/users/${getId()}/words/${wordId}`, userWordParameter, 'user words');

  return response;
};

// Удалить слово пользователя
export const removeUserWord = async (id: string, wordId: string) => {
  const response = await requestWrapper(`${EndPoints.USERS_URL}/${id}/words/${wordId}`, { method: 'DELETE' }, 'user words');
  if (response) {
    console.log('The words has been deleted');
  }
};

const makeUrl = (baseUrl: string, options: OptionalObj) => {
  const urlOptions = { ...options };
  let url: string = `${baseUrl}?`;

  Object.keys(urlOptions).forEach((key) => {
    url += `${key}=${urlOptions[key]}&`;
  });
  return url;
}

// Cгруппировать слова
export const getAggregatedWords = async (filterObj?: MongoDB_Object, group = '', page = '', wordsPerPage = '') => {
  let filter = '';
  if (Object.keys(filterObj).length !== 0) {
    filter = JSON.stringify(filterObj);
  }
  const response: AggregatedWords = await axiosRequestWrapper('Get', `/users/${getId()}/aggregatedWords`, {
  }, 'user Words', { group, page, wordsPerPage, filter });

  return response;
};

// Cгруппировать слово
export const getAggregatedWord = async (wordId: string) => {
  const response: Words[] = await axiosRequestWrapper('Get', `/users/${getId()}/aggregatedWords/${wordId}`, {}, 'user Words');

  return response;
};

// Получить статистику User
export const getUserStatistics = async () => {
  const response: UserStatistic = await axiosRequestWrapper('Get', `/users/${getId()}/statistics`, {}, 'user statistics');

  return response;
};

// Исправить статистику User
export const changeUserStatistics = async (statistic: UserStatistic) => {
  const response: UserStatistic = await axiosRequestWrapper('PUT', `/users/${getId()}/statistics`, statistic, 'user statistics');

  return response;
};

// Получить настройки User
export const getUserSettings = async () => {
  const response: UserSettings = await axiosRequestWrapper('Get', `/users/${getId()}/settings`, {}, 'user settings');

  return response;
};

// Исправить настройки User
export const changeUserSettings = async (settings: UserSettings) => {
  const response: UserSettings = await axiosRequestWrapper('PUT', `/users/${getId()}/settings`, settings, 'user settings');

  return response;
};
