/*eslint-disable*/
import { showAlert } from './alerts.js';
const stripe = Stripe(
  'pk_test_51NWZLIIQRsliAuuRjFHMEH4IMCkhtMlLU4SAIBJ7igoV49UVsWQV3SxVRPn8f8ePJklikdE7OWuj69abkZXB98BY00ECOZCo7K',
);
const bookBtn = document.querySelector('#book-tour');
const bookTour = async (tourId) => {
  try {
    const session = await axios({
      method: 'GET',
      url: `${window.location.origin}/api/v1/bookings/checkout-session/${tourId}`,
    });
    console.log(session);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

bookBtn.addEventListener('click', async (e) => {
  e.target.textContent = 'Processing...';
  const { tourId } = bookBtn.dataset;
  await bookTour(tourId);
  e.target.textContent = 'Book tour now!';
});
