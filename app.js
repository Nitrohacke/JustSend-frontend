const API_URL = 'https://justsend-backend-g551.onrender.com';
let selectedGift = { name: '', price: 0, img: '' };
let userName = '';

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

function setNav(id) {
  showScreen(id);
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
}

function selectGift(name, price, img) {
  selectedGift = { name, price, img };
  showScreen('recipient');
}

function updateReview() {
  const name = document.getElementById('rec-name')?.value || '—';
  const message = document.getElementById('rec-message')?.value || '—';
  const total = selectedGift.price + 5000;
  document.getElementById('review-gift-name').textContent = selectedGift.name;
  document.getElementById('review-gift-price').textContent = `₦${selectedGift.price.toLocaleString()}`;
  document.getElementById('review-img').src = selectedGift.img;
  document.getElementById('review-recipient').textContent = name;
  document.getElementById('review-message').textContent = message;
  document.getElementById('review-price').textContent = `₦${selectedGift.price.toLocaleString()}`;
  document.getElementById('review-total').textContent = `₦${total.toLocaleString()}`;
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

  errorEl.style.color = '#888';
  errorEl.textContent = 'Sending OTP...';

  try {
    const res = await fetch(`${API_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (res.ok) {
      errorEl.style.color = '#2eb872';
      errorEl.textContent = '✓ OTP sent! Check your email.';
    } else {
      errorEl.style.color = 'red';
      errorEl.textContent = data.message || 'Failed to send OTP';
    }
  } catch {
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

  errorEl.style.color = '#888';
  errorEl.textContent = 'Verifying...';

  try {
    const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (res.ok) {
      userName = name.split(' ')[0];
      document.getElementById('greeting-name').textContent = `Hi, ${userName} 👋`;
      document.getElementById('profile-name').textContent = name;
      document.getElementById('profile-email').textContent = email;
      showScreen('home');
    } else {
      errorEl.style.color = 'red';
      errorEl.textContent = data.message || 'Invalid OTP';
    }
  } catch {
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

  errorEl.style.color = '#888';
  errorEl.textContent = 'Verifying...';

  try {
    const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById('profile-email').textContent = email;
      showScreen('home');
    } else {
      errorEl.style.color = 'red';
      errorEl.textContent = data.message || 'Invalid OTP';
    }
  } catch {
    errorEl.style.color = 'red';
    errorEl.textContent = 'Network error, please try again';
  }
}
async function initiatePayment() {
  const email = document.getElementById('profile-email').textContent;
  const total = selectedGift.price + 5000;

  try {
    const res = await fetch(`${API_URL}/api/payment/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        amount: total,
        metadata: {
          gift: selectedGift.name,
          recipient: document.getElementById('rec-name')?.value || 'Unknown'
        }
      })
    });

    const data = await res.json();

    if (data.authorization_url) {
      window.location.href = data.authorization_url;
    } else {
      alert('Payment failed to initialize');
    }
  } catch (err) {
    alert('Network error, please try again');
  }
}

function copyReferral() {
  navigator.clipboard.writeText('https://justsend.app/ref/israel')
    .then(() => alert('Referral link copied!'));
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
  typing.innerHTML = `<p>...</p>`;
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: 'You are a friendly customer support assistant for JustSend, a gift delivery app in Nigeria where senders can send gifts to anyone without knowing their delivery address. The recipient gets an invite and privately shares their address. Keep responses short, warm and helpful. If you cannot resolve an issue, ask them to email support.justsend@gmail.com',
        messages: [{ role: 'user', content: message }]
      })
    });
    const data = await res.json();
    typing.innerHTML = `<p>${data.content[0].text}</p>`;
  } catch {
    typing.innerHTML = `<p>Sorry, I'm having trouble right now. Please email us at support.justsend@gmail.com</p>`;
  }

  container.scrollTop = container.scrollHeight;
}

// Update review when navigating to it
const origShowScreen = showScreen;
window.showScreen = function(id) {
  if (id === 'review') updateReview();
  origShowScreen(id);
};
