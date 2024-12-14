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
        cadastro();
        sessionStorage.setItem('userId', userId);
    } else {
        login();
        sessionStorage.setItem('documento', cpfCnpj);
        sessionStorage.setItem('userId', userId);
    }
}

// Função de cadastro
async function cadastro() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let documento = document.getElementById('cpfCnpj').value;
    const emailUser = localStorage.setItem('userEmail', email);

    try {
        const response = await fetch("https://planway-production.up.railway.app/api/usuarios/cadastrar", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                documento: documento,
            })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Cadastro realizado com sucesso!');
            setUsuarioDocumento(data.documento);
            toggleLayout();
        } else {
            alert('Esse usuario já existe');
        }
    } catch (error) {
        console.error('Erro detalhado:', error);
        alert(`Erro ao conectar ao servidor: ${error.message}`);
    }
}

// Função de login
async function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let documento = document.getElementById('cpfCnpj').value;

    try {
        const response = await fetch("https://planway-production.up.railway.app/api/usuarios/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                documento: documento,
                password: password,
            })
        });

        if (response.ok) {
            let userType;
            if (documento.length === 11) {
                userType = 'cliente';
            } else if (documento.length === 14) {
                userType = 'agencia';
            } else {
                alert('Login, CPF/CNPJ ou senha estão incorretos');
                return;
            }

            // Armazenar informações do login
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userType', userType);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userDocumento', documento);

            alert('Login realizado com sucesso!');
            window.location.href = 'home.html';
        } else {
            const errorMessage = await response.text();
            alert(`Erro ao logar: ${errorMessage}`);
        }

    } catch (error) {
        console.error('Erro detalhado:', error);
        alert(`Erro ao conectar ao servidor: ${error.message}`);
    }
}

initEventListeners();