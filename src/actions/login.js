export const LOGIN_DONE = 'LOGIN_DONE';

const login = (email) => ({
  type: LOGIN_DONE,
  payload: email,
});

export default login;
