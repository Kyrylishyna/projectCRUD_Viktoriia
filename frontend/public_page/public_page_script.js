const modal = document.getElementById('modal');
const signUpBtn = document.getElementById('sign_up_btn');
const logInBtn = document.getElementById('log_in_btn');
const closeModal = document.getElementById('closeModal');
const getStartedBtn = document.getElementById('get_started_btn');
const cancelBtnLogin = document.getElementById('cancelBtnLogin');
const cancelBtnSignup = document.getElementById('cancelBtnSignup');
const signupForm = document.getElementById('signup_form');
const loginForm = document.getElementById('login_form');
const switchToLogin = document.getElementById('switchToLogin');
const switchToSignup = document.getElementById('switchToSignUp');

signUpBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

logInBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
});

getStartedBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

switchToLogin.addEventListener('click', () => {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

switchToSignup.addEventListener('click', () => {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

cancelBtnLogin.addEventListener('click', () => {
    modal.style.display = 'none';
});

cancelBtnSignup.addEventListener('click', () => {
    modal.style.display = 'none';
})