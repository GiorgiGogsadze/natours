/* eslint-disable */
import { showAlert } from './alerts.js';
const form = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/users/logout`,
    });
    if (res.data.status === 'success') {
      location.assign('/');
      // location.reload(true);
    }
  } catch (err) {
    showAlert('error', `Error logging out! Try again`);
  }
};

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}
