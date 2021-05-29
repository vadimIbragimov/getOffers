export const MIN_PASSWORD_LENGTH = 6;
export const MIN_PASSWORD_LENGTH_ERROR = `Пароль должен содержать не менее ${MIN_PASSWORD_LENGTH} символов`;
export const MAX_PASSWORD_LENGTH = 34;
export const MAX_PASSWORD_LENGTH_ERROR = `Пароль должен содержать не более ${MAX_PASSWORD_LENGTH} символов`;
export const PASSWORD_REGEX =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export const PASSWORD_REGEX_ERROR =
  'Пароль может содержать следующие символы: A-Z, a-z, 0-9 и спецсимволы';
export const EMAIL_ERROR = 'Введите корректный email-адрес';
export const TELEGRAM_USERNAME_REGEX =
  /.*\B@(?=\w{5,64}\b)[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*.*/;
export const TELEGRAMUSERNAME_REGEX_ERROR =
  'Введите корректное имя пользователя telegram';
export const mainURI = 'http://get-offers.ru/';
export const authTokenExpiration = 30; // days
