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



//backend


signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const full_name = signupForm.querySelector('input[name="full_name"]').value;
    const email = signupForm.querySelector('input[name="login"]').value;
    const password = signupForm.querySelector('input[name="password"]').value;
    const passwordRepeat = signupForm.querySelector('input[name="passwordRepeat"]').value;

    if(password !== passwordRepeat){
        alert("Passwords do not match!");
        return;
    }


    const API_LOCAL_USER_SIGNUP_URL = 'http://localhost:3000/api/users/register'; 
    const API_USER_SIGNUP_URL = 'https://projectcrud-viktoriia2.onrender.com/api/users/register'; 
    try{
        const response =await fetch (`${API_USER_SIGNUP_URL}`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            
            },
            body: JSON.stringify({full_name, email, password})
        });

        const data = await response.json(); 

        if(!response.ok){
            throw new Error(data.message || "Registration failed");
        }

        alert("Registration successful! You can now log in.");
        signupForm.reset();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    } catch (err){
        console.error(err);
        alert("Error: " + err.message);
    }
});

//login

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginForm.querySelector('input[name="login"]').value;
    const password = loginForm.querySelector('input[name="password"]').value;


const API_LOCAL_LOGIN_URL = 'http://localhost:3000/api/users/login';
const API_LOGIN_URL = 'https://projectcrud-viktoriia2.onrender.com/api/users/login'; 
    try{
        const response = await fetch(`${API_LOGIN_URL}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({email, password})
        });
        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message || "Login failed");
        }

        localStorage.setItem('token', data.token);

        window.location.href='/main-page.html';

    } catch(err){
        console.error(err);
        alert("Error: "+ err.message);
    }
});

document.addEventListener('DOMContentLoaded', () =>{

    const forgotForm = document.getElementById("forgot_form");
    const forgotLink = document.querySelector("#forgot_password_link");
    const cancelForgotBtn = document.getElementById("cancelBtnForgot");
    const forgotMessage = document.getElementById("forgot_message");

    forgotLink.addEventListener("click", () =>{
        loginForm.classList.add("hidden");
        forgotForm.classList.remove("hidden");
    });
    cancelForgotBtn.addEventListener("click", () =>{
        forgotForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
        forgotMessage.textContent = "";
    });

    forgotForm.addEventListener("submit", async (e) =>{
        e.preventDefault();
        const email = forgotForm.querySelector("input[name='email']").value.trim();
    
        if (!email) return;

        try{
            const response = await fetch(`https://projectcrud-viktoriia2.onrender.com/api/users/forgot-password`, {
                method:"POST",
                headers:{'Content-Type':"application/json"},
                body: JSON.stringify({email}),
            });

            const data = await response.json();
            if(response.ok){
                forgotMessage.style.color = "green";
                forgotMessage.textContent = "Reset link sent! Check your email."

                
            }else{
                forgotMessage.style.color = "red";
                forgotMessage.textContent = data.message || "Something went wrong.";
            }
        }catch (err){
        console.error(err);
            forgotMessage.style.color = "red";
      forgotMessage.textContent = "Server error.";
        }
    })
})