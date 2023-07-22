/* eslint-disable */
import { showAlert } from './alerts.js';
const loginForm = document.querySelector('.form--login');

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${window.location.origin}/api/v1/users/login`,
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginForm.querySelector('#email').value;
  const password = loginForm.querySelector('#password').value;
  await login(email, password);
});
