async function sendOTP() {
  const emailInput = document.getElementById('phone-input').value.trim();
  const errorEl = document.getElementById('phone-error');

  if (!emailInput) {
    errorEl.textContent = 'Please enter your email';
    return;
  }

  currentPhone = emailInput;
  errorEl.textContent = 'Sending OTP...';

  try {
    const res = await fetch(`${API_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput })
    });

    const data = await res.json();

    if (res.ok) {
      errorEl.textContent = '';
      showScreen('otp-screen');
    } else {
      errorEl.textContent = data.message || 'Failed to send OTP';
    }
  } catch (err) {
    errorEl.textContent = 'Network error, please try again';
  }
}
