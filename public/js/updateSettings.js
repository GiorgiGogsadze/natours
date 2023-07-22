/*eslint-disable */
import { showAlert } from './alerts.js';
const dataForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-password');

const updateData = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/updateMe`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'data updated successfully');
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

dataForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData();
  form.append('name', dataForm.querySelector('#name').value);
  form.append('email', dataForm.querySelector('#email').value);
  form.append('photo', dataForm.querySelector('#photo').files[0]);
  await updateData(form);
});

const updatePassword = async (currentP, newP, confirmP) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/updateMyPassword`,
      data: {
        passwordCurrent: currentP,
        password: newP,
        passwordConfirm: confirmP,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'password updated successfully');
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

passwordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = passwordForm.querySelector('.btn--save-password');

  submitBtn.textContent = 'Updating...';

  const currentP = passwordForm.querySelector('#password-current').value;
  const newP = passwordForm.querySelector('#password').value;
  const confirmP = passwordForm.querySelector('#password-confirm').value;

  await updatePassword(currentP, newP, confirmP);

  // passwordForm.querySelector('#password-current').value = '';
  // passwordForm.querySelector('#password').value = '';
  // passwordForm.querySelector('#password-confirm').value = '';

  submitBtn.textContent = 'Save password';
});
