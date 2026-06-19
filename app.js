const API_URL = 'https://justsend-backend-g551.onrender.com';

let selectedGift = { name: '', price: 0, emoji: '' };

// Auto splash to onboarding
window.onload = () => {
  setTimeout(() => showScreen('onboarding-1'), 2500);
};

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const screen = document.getElementById(id);
  if (screen) {
    screen.style.display = 'flex';
    screen.classList.add('active');
    screen.scrollTop = 0;
  }
}

function selectGift(name, price) {
  const emojis = {
    'Chocolate Cake': '🎂',
    'Red Roses Bouquet': '🌹',
    'Birthday Gift Hamper': '🧺',
    'Mixed Flowers': '🌸'
  };
  selectedGift = { name, price, emoji: emojis[name] || '🎁' };
  showScreen('recipient');
}

async function sendOTP(type) {
  const emailId = type === 'signup' ? 'signup-email' : 'login-email';
  const errorId = type === 'signup' ? 'signup-error' : 'login-error';
  const email = document.getElementById(emailId).value.trim();
  const errorEl = document.getElementById(errorId);

  if (!email) {
    errorEl.style.color = 'red';
    errorEl.textContent = 'Please enter your email first';
    return;
  }

  errorEl.style.color = '#666';
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

  errorEl.style.color = '#666';
  errorEl.textContent = 'Verifying...';

  try {
    const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (res.ok) {
      document.querySelector('.greeting').textContent = `Hi, ${name} 👋`;
      showScreen('home');
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

  errorEl.style.color = '#666';
  errorEl.textContent = 'Verifying...';

  try {
    const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (res.ok) {
      showScreen('home');
    } else {
      errorEl.style.color = 'red';
      errorEl.textContent = data.message || 'Invalid OTP';
    }
  } catch (err) {
    errorEl.style.color = 'red';
    errorEl.textContent = 'Network error, please try again';
  }
}

function copyReferral() {
  navigator.clipboard.writeText('https://justsend.app/ref/israel');
  alert('Referral link copied!');
}

async function sendSupportMessage() {
  const input = document.getElementById('support-input');
  const message = input.value.trim();
  if (!message) return;

  const container = document.getElementById('chat-messages');

  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.innerHTML = `<p>${message}</p>`;
  container.appendChild(userMsg);
  input.value = '';
  container.scrollTop = container.scrollHeight;

  const typing = document.createElement('div');
  typing.className = 'chat-msg bot';
  typing.innerHTML = `<p>Typing...</p>`;
  container.appendChild(typing);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: 'You are a friendly customer support assistant for JustSend, a gift delivery app in Nigeria where senders can send gifts without knowing the recipient address. Keep responses short, helpful and friendly.',
        messages: [{ role: 'user', content: message }]
      })
    });
    const data = await res.json();
    typing.innerHTML = `<p>${data.content[0].text}</p>`;
  } catch {
    typing.innerHTML = `<p>Sorry, I'm having trouble connecting right now. Please try again or email us at support@justsend.ng</p>`;
  }

  container.scrollTop = container.scrollHeight;
}
