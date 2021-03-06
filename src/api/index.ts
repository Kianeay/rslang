export enum EndPoints {
  BASE_URL = 'https://react-learnwords2022.herokuapp.com/',
  WORDS_URL = 'https://react-learnwords2022.herokuapp.com/words',
  USERS_URL = 'https://react-learnwords2022.herokuapp.com/users',
  SIGNIN_URL = 'https://react-learnwords2022.herokuapp.com/signin',
}

type Words = {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
};

type User = {
  name?: string;
  email: string;
  password: string;
};

type UserTokens = {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
};

type Headers = {
  Authorization?: string;
  Accept?: string;
  'Content-Type'?: string;
};

type OptionalObj = {
  [key: string]: string | boolean | number;
};

export interface WordStat {
  status?: string;
  new?: boolean;

  sprint?: {
    correctAnswers: number;
  };

  audio?: {
    correctAnswers: number;
  };
}

interface GameStat {
  learned: number;
  correctAnswers: number;
  count: number;
  row: number;
}

export interface OptionalObjStat {
  new: number;
  sprint?: GameStat;
  audio?: GameStat;
}

type MongoDB_ObjectAnd = {
  $and: OptionalObj[];
};
type MongoDB_ObjectOr = {
  $or: OptionalObj[];
};

type MongoDB_ObjectOrAnd = {
  $or: MongoDB_ObjectAnd[];
};

type MongoDB_Object =
  | OptionalObj
  | MongoDB_ObjectAnd
  | MongoDB_ObjectOr
  | MongoDB_ObjectOrAnd;

interface OptionsObj {
  method?: string;
  headers?: Headers;
  body?: string;
  filter?: MongoDB_Object;
}

export type UsersWordParameter = {
  difficulty?: string;
  optional?: WordStat;
};

type UserStatistic = {
  optional?: OptionalObjStat;
};

type UserSettings = {
  wordsPerDay: number;
  options?: OptionalObj;
};

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
    makeOpt.headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }
  try {
    const promise = await fetch(url, makeOpt);
    return promise;
  } catch (error) {
    console.error(error.message);
  }
  return null;
};

// ???????????????? ????????????
const getTokens = async (id: string) => {
  const response = await fetch(`${EndPoints.USERS_URL}/${id}/tokens`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
    },
  });
  if (!response.ok) {
    localStorage.removeItem('userID');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  } else {
    const content: UserTokens = await response.json();
    setLocalTokens(content.token, content.refreshToken);
  }
};

const errorHandler = async (
  promise: Response,
  data: string,
  callback?: () => void,
  callback404?: () => void,
) => {
  switch (promise.status) {
    case 404:
      if (callback404) callback404();
      // console.error(`${data} not found`);
      break;
    case 401:
      console.log('change token');
      await getTokens(localStorage.getItem('userID'));
      break;
    case 417:
      if (callback) callback();
      // console.error(`${data} has been create`);
      break;
    case 422:
      // console.error('Incorrect e-mail or password');
      break;
    case 400:
      // console.error('Bad request');
      break;
    case 403:
      if (callback) callback();
      // console.error('incorect email or password');
      break;
    default:
      console.error('uncaught error');
  }
};

const requestWrapper = async (
  url: string,
  options: OptionsObj,
  type: string,
) => {
  try {
    let response = await load(url, options);
    if (!response.ok && response.status === 401) {
      await errorHandler(response, type);
      response = await load(url, options);
    }
    if (!response.ok) {
      errorHandler(response, type);
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
  return null;
};

// ???????????????? ???????????? User
export const createUser = async (userData: User, callback: () => void) => {
  const response = await fetch(EndPoints.USERS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    errorHandler(response, 'user', callback);
  } else {
    const content: User = await response.json();
    return content;
  }
  return null;
};

// ?????????????????????? User
export const signIn = async (
  userData: User,
  callback: () => void,
  callback404: () => void,
) => {
  const response = await fetch(EndPoints.SIGNIN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    errorHandler(response, 'user', callback, callback404);
  } else {
    const content: UserTokens = await response.json();
    setLocalTokens(content.token, content.refreshToken);
    setLocalId(content.userId);
    return content;
  }
  return null;
};

// ???????????????? User
export const getUser = async (id: string) => {
  const response = await requestWrapper(
    `${EndPoints.USERS_URL}/${id}`,
    {},
    'user',
  );
  return response;
};

// ???????????????? ????????????????????????
export const changeUserParameters = async (id: string, userData: User) => {
  const response = await requestWrapper(
    `${EndPoints.USERS_URL}/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(userData),
    },
    'user',
  );
  return response;
};

// ?????????????? ????????????????????????
export const removeUser = async (id: string) => {
  const response = await requestWrapper(
    `${EndPoints.USERS_URL}/${id}`,
    { method: 'DELETE' },
    'user',
  );
  if (response) {
    console.log('The user has been deleted');
  }
};

// ???????????????? ?????? ?????????? ?? ???????? ????????????
export const getWords = async (group: string, page: string) => {
  const response = await fetch(
    `${EndPoints.WORDS_URL}?page=${page}&group=${group}`,
  );
  if (!response.ok) {
    errorHandler(response, 'words');
  } else {
    const result: Array<Words> = await response.json();
    return result;
  }
  return null;
};

// ???????????????? ???????? ?????????? ?? ???????? ???????????? ???? ?????? ID
export const getWord = async (id: string) => {
  const response = await fetch(`${EndPoints.WORDS_URL}/${id}`);
  if (!response.ok) {
    errorHandler(response, 'words');
  } else {
    const result: Words = await response.json();
    return result;
  }
  return null;
};

// ???????????????? ?????? ?????????? User
export const getUserWords = async (id: string) => {
  const response = await requestWrapper(
    `${EndPoints.USERS_URL}/${id}/words`,
    {},
    'user Words',
  );
  return response;
};

// ???????????????? ?????????? ?????????? ???? ID
export const getUserWordsId = async (id: string, wordId: string) => {
  const response = await requestWrapper(
    `${EndPoints.USERS_URL}/${id}/words/${wordId}`,
    {},
    'user Words',
  );
  return response;
};

// ???????????????? ?????????? ??????????
export const createUserWords = async (
  id: string,
  wordId: string,
  userWordParameter: UsersWordParameter,
) => {
  const response = await requestWrapper(
    `${EndPoints.USERS_URL}/${id}/words/${wordId}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userWordParameter),
    },
    'user words',
  );
  return response;
};

// ???????????????? ?????????? ????????????????????????
export const changeUserWord = async (
  id: string,
  wordId: string,
  userWordParameter: UsersWordParameter,
) => {
  const response = await requestWrapper(
    `${EndPoints.USERS_URL}/${id}/words/${wordId}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userWordParameter),
    },
    'user words',
  );
  return response;
};

// ?????????????? ?????????? ????????????????????????
export const removeUserWord = async (id: string, wordId: string) => {
  const response = await requestWrapper(
    `${EndPoints.USERS_URL}/${id}/words/${wordId}`,
    { method: 'DELETE' },
    'user words',
  );
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
};

// C???????????????????????? ??????????
export const getAggregatedWords = async (
  id: string,
  group = '',
  page = '',
  wordsPerPage = '',
  filterObj: MongoDB_Object = {},
) => {
  const filter = JSON.stringify(filterObj) || '';
  const url = makeUrl(`${EndPoints.USERS_URL}/${id}/aggregatedWords`, {
    page,
    filter,
    group,
    wordsPerPage,
  });
  const response = await requestWrapper(url, {}, 'user Words');
  return response;
};

// C???????????????????????? ??????????
export const getAggregatedWord = async (id: string, wordId: string) => {
  const response = await requestWrapper(
    `${EndPoints.USERS_URL}/${id}/aggregatedWords/${wordId}`,
    {},
    'user Words',
  );
  return response;
};

// ???????????????? ???????????????????? User
export const getUserStatistics = async (id: string) => {
  const response = await requestWrapper(
    `${EndPoints.USERS_URL}/${id}/statistics`,
    {},
    'user statistics',
  );
  return response;
};

// ?????????????????? ???????????????????? User
export const changeUserStatistics = async (
  id: string,
  statistic: UserStatistic,
) => {
  const response = await requestWrapper(
    `${EndPoints.USERS_URL}/${id}/statistics`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statistic),
    },
    'user statistics',
  );
  return response;
};

// ???????????????? ?????????????????? User
export const getUserSettings = async (id: string) => {
  const response = await requestWrapper(
    `${EndPoints.USERS_URL}/${id}/settings}`,
    {},
    'user settings',
  );
  return response;
};

// ?????????????????? ?????????????????? User
export const changeUserSettings = async (
  id: string,
  settings: UserSettings,
) => {
  const response = await requestWrapper(
    `${EndPoints.USERS_URL}/${id}/statistics}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    },
    'user statistics',
  );
  return response;
};
