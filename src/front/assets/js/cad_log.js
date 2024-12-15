import { setUsuarioDocumento } from './script.js';
let isLogin = true;

function initEventListeners() {
    document.getElementById('toggle-layout').addEventListener('click', function (e) {
        e.preventDefault();
        toggleLayout();
    });

    document.getElementById('toggle-password').addEventListener('click', function () {
        togglePasswordVisibility();
    });

    document.getElementById('auth-form').addEventListener('submit', function (e) {
        e.preventDefault();
        handleSubmit();
    });
}

// Muda os layouts
function toggleLayout() {
    isLogin = !isLogin;
    document.getElementById('form-title').textContent = isLogin ? 'Login' : 'Cadastro';
    document.getElementById('submit-btn').textContent = isLogin ? 'Entrar' : 'Cadastrar';
    document.getElementById('confirm-password-group').style.display = isLogin ? 'none' : 'block';
    document.getElementById('toggle-text').innerHTML = isLogin
        ? 'Ainda não possui uma conta? <a id="toggle-layout" class="link-cadastro">Cadastrar</a>'
        : 'Já possui uma conta? <a id="toggle-layout" class="link-cadastro">Login</a>';
};

// Muda visibilidade das senhas
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const isPasswordVisible = passwordInput.type === 'password';

    passwordInput.type = isPasswordVisible ? 'text' : 'password';
    confirmPasswordInput.type = isPasswordVisible ? 'text' : 'password';
}

// Faz a verificação se a senha e confirmação são iguais
function handleSubmit() {
    const email = document.getElementById('email').value;
    const cpfCnpj = document.getElementById('cpfCnpj').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!email || !password || (isLogin && !cpfCnpj)) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (!isLogin) {
        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }
        cadastro(email, cpfCnpj, password);
    } else {
        login(email, cpfCnpj, password);
    }
}

// Função de cadastro
function cadastro(email, documento, password) {
    const existingUsers = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verificar se o usuário já existe
    const userExists = existingUsers.find(user => user.email === email || user.documento === documento);
    if (userExists) {
        alert('Esse usuário já existe.');
        return;
    }

    // Criar o novo usuário e salvar no localStorage
    const newUser = {
        email: email,
        documento: documento,
        password: password
    };
    existingUsers.push(newUser);
    localStorage.setItem('usuarios', JSON.stringify(existingUsers));

    alert('Cadastro realizado com sucesso!');
    toggleLayout();
}

// Função de login
function login(email, documento, password) {
    const existingUsers = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Buscar o usuário no localStorage
    const user = existingUsers.find(user => user.email === email && user.documento === documento && user.password === password);
    if (!user) {
        alert('Login, CPF/CNPJ ou senha estão incorretos.');
        return;
    }

    let userType;
    if (documento.length === 11) {
        userType = 'cliente';
    } else if (documento.length === 14) {
        userType = 'agencia';
    }

    // Armazenar informações do login
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userType', userType);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userDocumento', documento);

    alert('Login realizado com sucesso!');
    window.location.href = 'home.html';
}

initEventListeners();
