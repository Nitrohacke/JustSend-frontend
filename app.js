const API_URL = 'https://justsend-backend-g551.onrender.com';

let currentPhone = '';

// Show specific screen
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Auto move to phone screen after splash
window.onload = () => {
  setTimeout(() => showScreen('phone-screen'), 2000);

  // OTP box auto focus
  const boxes = document.querySelectorAll('.otp-box');
  boxes.forEach((box, i) => {
    box.addEventListener('input', () => {
      if (box.value && i < boxes.length - 1) {
        boxes[i + 1].focus();
      }
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && i > 0) {
        boxes[i - 1].focus();
      }
    });
  });
};

// Send OTP
async function sendOTP() {
  const phoneInput = document.getElementById('phone-input').value.trim();
  const errorEl = document.getElementById('phone-error');

  if (!phoneInput) {
    errorEl.textContent = 'Please enter your phone number';
    return;
  }

  // Format to international
  let phone = phoneInput;
  if (phone.startsWith('0')) {
    phone = '+234' + phone.slice(1);
  }

  currentPhone = phone;
  errorEl.textContent = 'Sending OTP...';

  try {
    const res = await fetch(`${API_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
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

// Verify OTP
async function verifyOTP() {
  const boxes = document.querySelectorAll('.otp-box');
  const otp = Array.from(boxes).map(b => b.value).join('');
  const errorEl = document.getElementById('otp-error');

  if (otp.length < 6) {
    errorEl.textContent = 'Please enter the full 6-digit code';
    return;
  }

  errorEl.textContent = 'Verifying...';

  try {
    const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: currentPhone, otp })
    });

    const data = await res.json();

    if (res.ok) {
      errorEl.textContent = '';
      showScreen('success-screen');
    } else {
      errorEl.textContent = data.message || 'Invalid OTP';
    }
  } catch (err) {
    errorEl.textContent = 'Network error, please try again';
  }
}
