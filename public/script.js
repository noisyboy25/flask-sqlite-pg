window.addEventListener('load', async () => {
  let mode = 'register';
  let auth = '';

  const formRegister = document.querySelector('.register-form');
  const formLogin = document.querySelector('.login-form');
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
    console.log(res.status);
    if (res.ok) {
      setMode('login');
    }
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
    const payload = await res.json();
    if (!res.ok) return console.log(payload.message);

    auth = res.headers.get('Authorization');
    if (!auth) return;
    console.log(payload);
    setMode('profile');
  };

  const getProfile = async () => {
    const securedContent = document.getElementById('content');
    const res = await fetch(`/api/profile`, {
      headers: { Authorization: auth },
    });
    const payload = await res.json();

    securedContent.innerHTML =
      res.status == 200 ? JSON.stringify(payload.data) : '';
  };

  const linkProfile = document.getElementById('link-profile');
  linkProfile.addEventListener('click', (event) => {
    event.preventDefault();
    setMode('profile');
    getProfile();
  });

  const linkRegister = document.getElementById('link-register');
  linkRegister.addEventListener('click', (event) => {
    event.preventDefault();
    setMode('register');
  });

  const linkLogin = document.getElementById('link-login');
  linkLogin.addEventListener('click', (event) => {
    event.preventDefault();
    setMode('login');
  });

  const setMode = (newMode) => {
    mode = newMode;
    console.log(mode);
    switch (mode) {
      case 'profile':
        formRegister.classList.add('hidden');
        formLogin.classList.add('hidden');
        profile.classList.remove('hidden');

        linkRegister.classList.remove('selected');
        linkLogin.classList.remove('selected');
        linkProfile.classList.add('selected');
        getProfile();
        break;
      case 'login':
        formRegister.classList.add('hidden');
        formLogin.classList.remove('hidden');
        profile.classList.add('hidden');

        linkRegister.classList.remove('selected');
        linkLogin.classList.add('selected');
        linkProfile.classList.remove('selected');
        break;
      default:
        mode = 'register';
        formRegister.classList.remove('hidden');
        formLogin.classList.add('hidden');
        profile.classList.add('hidden');

        linkRegister.classList.add('selected');
        linkLogin.classList.remove('selected');
        linkProfile.classList.remove('selected');
    }
  };

  const submitRegister = document.getElementById('reg-submit');
  submitRegister.addEventListener('click', handleRegister);
  const submitLogin = document.getElementById('log-submit');
  submitLogin.addEventListener('click', handleLogin);

  setMode('register');
});
