const loginBox = document.getElementById('login-box');
const registerBox = document.getElementById('register-box');

const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const container = document.querySelector('.container');

const API_URL = 'http://localhost:3000';

// Alternar telas
showRegisterLink.addEventListener('click', e => {
  e.preventDefault();
  loginBox.classList.add('hidden');
  registerBox.classList.remove('hidden');
});

showLoginLink.addEventListener('click', e => {
  e.preventDefault();
  registerBox.classList.add('hidden');
  loginBox.classList.remove('hidden');
});

// Verifica se usuário está logado
function isLoggedIn() {
  return localStorage.getItem('user') !== null;
}

// Exibe a tela de criar história
function showStoryForm(user) {
  container.innerHTML = `
    <h1>Olá, ${user.username}!</h1>
    <button id="logout-btn">Sair</button>
    <h2>Publicar nova história</h2>
    <form id="story-form">
      <label for="story-title">Título da história</label>
      <input type="text" id="story-title" name="title" required />
      <button type="submit">Publicar</button>
    </form>
    <div id="message"></div>
  `;

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('user');
    location.reload();
  });

  document.getElementById('story-form').addEventListener('submit', async e => {
    e.preventDefault();
    const title = e.target.title.value.trim();
    if (!title) return alert('Digite um título');

    const response = await fetch(`${API_URL}/stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, title }),
    });

    const data = await response.json();

    const messageDiv = document.getElementById('message');

    if (response.ok) {
      messageDiv.textContent = `História criada com sucesso! ID: ${data.story_id}`;
      e.target.reset();
    } else {
      messageDiv.textContent = `Erro: ${data.error || 'Erro desconhecido'}`;
    }
  });
}

// Login
loginForm.addEventListener('submit', async e => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const password = e.target.password.value.trim();

  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('user', JSON.stringify(data));
    showStoryForm(data);
  } else {
    alert(data.error || 'Erro no login');
  }
});

// Cadastro
registerForm.addEventListener('submit', async e => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const password = e.target.password.value.trim();

  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (response.ok) {
    alert('Cadastro realizado com sucesso! Faça login agora.');
    registerBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
    registerForm.reset();
  } else {
    alert(data.error || 'Erro no cadastro');
  }
});

// Ao carregar a página
window.addEventListener('load', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    showStoryForm(user);
  }
});
