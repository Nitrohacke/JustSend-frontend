const API_URL = 'https://justsend-backend-g551.onrender.com';

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(id);
  screen.classList.add('active');
  screen.style.display = 'flex';
  screen.style.flexDirection = 'column';
}

async function sendOTP(type) {
  const emailId = type === 'signup' ? 'signup-email' : 'login-email';
  const errorId = type === 'signup' ? 'signup-error' : 'login-error';
  const email = document.getElementById(emailId).value.trim();
  const errorEl = document.getElementById(errorId);

  if (!email) {
    errorEl.textContent = 'Please enter your email first';
    return;
  }

  errorEl.textContent = 'Sending OTP...';

  try {
    const res = await fetch(`${API_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok) {
      errorEl.style.color = 'green';
      errorEl.textContent = 'OTP sent! Check your email.';
    } else {
      errorEl.style.color = 'red';
      errorEl.textContent = data.message || 'Failed to send OTP';
    }
  } catch (err) {
    errorEl.style.color = 'red';
    errorEl.textContent = 'Network error, please try again';
  }
}

async function verifyAndSignup() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const otp = document.getElementById('signup-otp').value.trim();
  const errorEl = document.getElementById('signup-error');

  if (!name || !email || !otp) {
    errorEl.style.color = 'red';
    errorEl.textContent = 'Please fill in all fields';
    return;
  }

  errorEl.textContent = 'Verifying...';

  try {
    const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();

    if (res.ok) {
      showScreen('success');
    } else {
      errorEl.style.color = 'red';
      errorEl.textContent = data.message || 'Invalid OTP';
    }
  } catch (err) {
    errorEl.style.color = 'red';
    errorEl.textContent = 'Network error, please try again';
  }
}

async function verifyAndLogin() {
  const email = document.getElementById('login-email').value.trim();
  const otp = document.getElementById('login-otp').value.trim();
  const errorEl = document.getElementById('login-error');

  if (!email || !otp) {
    errorEl.style.color = 'red';
    errorEl.textContent = 'Please fill in all fields';
    return;
  }

  errorEl.textContent = 'Verifying...';

  try {
    const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();

    if (res.ok) {
      showScreen('success');
    } else {
      errorEl.style.color = 'red';
      errorEl.textContent = data.message || 'Invalid OTP';
    }
  } catch (err) {
    errorEl.style.color = 'red';
    errorEl.textContent = 'Network error, please try again';
  }
}

