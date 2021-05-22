window.addEventListener('load', async () => {
  let token = '';
  let mode = 'register';

  const registerForm = document.querySelector('.register-form');
  const loginForm = document.querySelector('.login-form');
  const profile = document.querySelector('.profile');

  const handleRegister = async (event) => {
    event.preventDefault();

    const email = document.getElementById('reg-email').value;
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    const payload = await res.json();
    console.log(payload);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const username = document.getElementById('log-username').value;
    const password = document.getElementById('log-password').value;

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const auth = res.headers.get('Authorization');
    token = auth.split(' ')[1] || token;
    const payload = await res.json();
    console.log(payload);
  };

  const getProfile = async () => {
    const securedContent = document.getElementById('content');
    const res = await fetch('/api/profile', {
      headers: { Authorization: 'Basic ' + token },
    });
    console.log('res', res);
    const payload = await res.json();

    securedContent.innerHTML =
      res.status == 200 ? JSON.stringify(payload.data) : '';
  };

  const linkProfile = document.getElementById('link-profile');
  linkProfile.addEventListener('click', (event) => {
    event.preventDefault();
    mode = 'profile';
    updateMode();
    getProfile();
  });
  const linkRegister = document.getElementById('link-register');
  linkRegister.addEventListener('click', (event) => {
    event.preventDefault();
    mode = 'register';
    updateMode();
  });
  const linkLogin = document.getElementById('link-login');
  linkLogin.addEventListener('click', (event) => {
    event.preventDefault();
    mode = 'login';
    updateMode();
  });

  const updateMode = () => {
    switch (mode) {
      case 'register':
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        profile.classList.add('hidden');
        break;
      case 'login':
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        profile.classList.add('hidden');
        break;
      default:
        registerForm.classList.add('hidden');
        loginForm.classList.add('hidden');
        profile.classList.remove('hidden');
    }
  };

  const submitRegister = document.getElementById('reg-submit');
  submitRegister.addEventListener('click', handleRegister);
  const submitLogin = document.getElementById('log-submit');
  submitLogin.addEventListener('click', handleLogin);

  updateMode();
  getProfile();
});
