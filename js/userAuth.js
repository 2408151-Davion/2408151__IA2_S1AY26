



const tabRegister = document.getElementById('tab-register');
const tabLogin = document.getElementById('tab-login');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const toLoginLink = document.getElementById('to-login');
const toRegisterLink = document.getElementById('to-register');


function showRegister() {
    tabRegister.classList.add('active'); tabRegister.classList.remove('inactive');
    tabLogin.classList.remove('active'); tabLogin.classList.add('inactive');
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    tabRegister.setAttribute('aria-selected','true');
    tabLogin.setAttribute('aria-selected','false');
}

function showLogin() {
    tabLogin.classList.add('active'); tabLogin.classList.remove('inactive');
    tabRegister.classList.remove('active'); tabRegister.classList.add('inactive');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    tabLogin.setAttribute('aria-selected','true');
    tabRegister.setAttribute('aria-selected','false');
}
    
export function showError(id, message){
    const el = document.getElementById(id);
    if(!el) return;
    el.textContent = message;
    el.style.display = 'block';
}
export function clearErrors(form){
    form.querySelectorAll('.error').forEach(e=>{
        e.textContent = '';
        e.style.display = 'none';
    });
}


// localStorage.setItem("User", JSON.stringify({
//     userName: "John",
//     password: "TestPassword1"
// }));
// const userFound = localStorage.getItem("User");
// const userValue = JSON.parse(userFound);

function endUserSession(){
    const hours = 2;
    const delayInMilliseconds = hours * 60 * 60 * 1000;

    setTimeout(() => {
        sessionStorage.removeItem("user");
    }, delayInMilliseconds);
}

function isRegistrationValid(firstName, lastName, userName, email, password, confirm, terms){
    let valid = true;

    if(firstName.length < 2){ showError('err-firstName','Please enter your first name.'); valid = false; }
    if(lastName.length < 2){ showError('err-lastName','Please enter your last name.'); valid = false; }
    if(userName.length < 2){ showError('err-userName','Please enter your username.'); valid = false; }

    // simple email check
    if(!/^\S+@\S+\.\S+$/.test(email)){ showError('err-email','Please enter a valid email address.'); valid = false; }

    if(password.length < 8){ showError('err-password','Password must be at least 8 characters.'); valid = false; }
    if(password !== confirm){ showError('err-confirm','Passwords do not match.'); valid = false; }
    if(!terms){ showError('err-terms','You must accept the terms to continue.'); valid = false; }

    if(!valid) return;
    
    return valid;

}

function registerUser(firstName, lastName, userName, email, password, terms){
    const newUser = {
        id: Date.now(),
        firstName: firstName, 
        lastName: lastName, 
        userName: userName, 
        email: email, 
        password: password,
        terms: terms
    };

    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
}

function isloginUserValid(identifier, password){
    let valid = true;
    if(identifier.length < 1){ showError('err-identifier','Please enter your email or username.'); valid = false; }
    if(password.length < 1){ showError('err-login-password','Please enter your password.'); valid = false; }
    if(!valid) return;
    return valid;
};

function login(identifier, password){
    let userValues = JSON.parse(localStorage.getItem("users")) || [];
    userValues = userValues.find(
        u => u.userName === identifier && 
        u.userName === identifier && 
        u.password === password)

        console.log(userValues);

    if(userValues){
        sessionStorage.setItem("user", userValues.userName);
        sessionStorage.setItem("userID", userValues.id);
        setTimeout(() => {
            window.location.replace("http://127.0.0.1:5500/index.html");
        }, 50);
    } else {
        showError("err-failed", "Incorrect Username or Password");
    }
}

document.addEventListener("DOMContentLoaded", () => {


    if(tabRegister){tabRegister.addEventListener('click', showRegister);}
    if(tabLogin){tabLogin.addEventListener('click', showLogin);}
    if(toLoginLink){
        toLoginLink.addEventListener('click', (e)=>{ 
            e.preventDefault(); 
            showLogin(); 
        });
    }
    if(toRegisterLink){
        toRegisterLink.addEventListener('click', (e)=>{ 
            e.preventDefault(); 
            showRegister(); 
        });
    }


    // Registration form submit
    if(registerForm){
        registerForm.addEventListener('submit', function(e){
            e.preventDefault();
            clearErrors(registerForm);

            const firstName = document.getElementById('firstName').value.trim();
            const lastName  = document.getElementById('lastName').value.trim();
            const userName  = document.getElementById('userName').value.trim();
            const email     = document.getElementById('reg-email').value.trim();
            const password  = document.getElementById('reg-password').value;
            const confirm   = document.getElementById('confirm-password').value;
            const terms     = document.getElementById('terms').checked;
            const valid = isRegistrationValid(firstName, lastName, userName, email, password, confirm, terms);
            
            console.log(valid);
            if(valid){
                registerUser(firstName, lastName, userName, email, password, terms);
                console.log(localStorage.getItem("users"));
                // alert('Registration validated (client-side). Hook up the /api/register endpoint to create accounts.');
                registerForm.reset();
                login(userName, password)
                // showLogin();
            }
        });
    };

    // Login form submit
    if(loginForm){
        loginForm.addEventListener('submit', function(e){
            e.preventDefault();

            clearErrors(loginForm);

            const identifier = document.getElementById('login-identifier').value.trim();
            const password   = document.getElementById('login-password').value;

            const valid = isloginUserValid(identifier, password);

            if(valid){login(identifier, password);};

            [tabRegister, tabLogin].forEach(tab=>{
                tab.addEventListener('keydown', (e)=>{
                    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); tab.click(); }
                    if(e.key === 'ArrowRight'){ tabLogin.focus(); showLogin(); }
                    if(e.key === 'ArrowLeft'){ tabRegister.focus(); showRegister(); }
                });
            });
        });
    }

    
    endUserSession();

});

export default {endUserSession};
