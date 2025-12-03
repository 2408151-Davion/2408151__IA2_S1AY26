

// Question 1 a-vi
class User {
    
    constructor(firstName, lastName, userName, email, phone, trn, gender, dob, password, terms) {
        this.id = Date.now();
        this.firstName = firstName; 
        this.lastName = lastName; 
        this.userName = userName; 
        this.email = email; 
        this.phone = phone;
        this.trn = trn; 
        this.gender = gender;
        this.dob = dob;
        this.password = password; 
        this.terms = terms;
        this.dateOfRegistration = new Date().toISOString;
        this.cart = [];
        this.invoices = [];
    }

    greet(){ return `Welcome, ${this.firstName}`};
};

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

export function clearInputErrors(id){
    const el = document.getElementById(id); 
    if(el){
        el.textContent = '';
        el.style.display = 'none';
    };
}

function endUserSession(){
    const hours = 2;
    const delayInMilliseconds = hours * 60 * 60 * 1000;

    setTimeout(() => {
        sessionStorage.removeItem("user");
    }, delayInMilliseconds);
}

// Question 1 a-iv.	visitor must be over 18 years old to register. Calculate age using JavaScript.
function getAge(dateString) {
    const today = new Date();
    const birth = new Date(dateString);

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

// Question 1 a-ii.	all fields are filled (HTML validation). JavaScript Error handling.
function isRegistrationValid(firstName, lastName, userName, email, phone, trn, gender, dob, password, confirm, terms){
    let valid = true;
    const age = getAge(dob);

    if(firstName.length < 2){ showError('err-firstName','Please enter your first name.'); valid = false; }
    if(lastName.length < 2){ showError('err-lastName','Please enter your last name.'); valid = false; }
    if(userName.length < 2){ showError('err-userName','Please enter your username.'); valid = false; }

    // simple email check
    if(! /^\S+@\S+\.\S+$/.test(email)){ showError('err-email','Please enter a valid email address.'); valid = false; }

    if(! /^\d{3}-\d{3}-\d{4}$/.test(phone)){ console.log(phone); showError('err-phone', 'Please enter your phone number eg. 876-456-789'); valid=false; } 
    // Question 1 a-v.	trn is unique; must be of length and in the format (000-000-000). 
    if(! /^\d{3}-\d{3}-\d{3}$/.test(trn)){ console.log(trn); showError('err-trn', 'Please enter a vaild trn eg. 123-456-789'); valid=false; } 

    if(!gender) { showError('err-gender', 'Please select a gender.'); valid = false; }
    if(dob.length < 10){ showError('err-dob', 'Please enter your date of birth.'); valid = false; }
    // Question 1 a-iv.	visitor must be over 18 years old to register.
    if(age < 18){ showError('err-dob', 'You must be over 18 y/o to register.'); valid = false; }

    // Question 1 a-iii. passwords should be at least 8 characters long.
    if(password.length < 8){ showError('err-password','Password must be at least 8 characters.'); valid = false; }

    if(password !== confirm){ showError('err-confirm','Passwords do not match.'); valid = false; }
    if(!terms){ showError('err-terms','You must accept the terms to continue.'); valid = false; }

    // if(!valid) return;
    
    return valid;

}

function isUserNameExists(userName){
    let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const existingUserName = users.some(u => u.userName === userName);
    console.log(existingUserName);
    console.log(users.length);
    if(!existingUserName) {
        return false;
    }

    showError('err-userName', 'username already exist');
    return true; 
}

function isEmailExists(email){
    let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const existingEmail = users.some(u => u.email === email);
    console.log(existingEmail);
    console.log(users.length);
    if(!existingEmail) {
        return false;
    }

    showError('err-email', 'email already exist');
    return true; 
}

function isTrnExists(trn){
    let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const existingTRN = users.some(u => u.trn === trn);
    console.log(existingTRN);
    if(!existingTRN) {
        return false;
    }

    console.log(existingTRN + ' already exist!');
    showError('err-trn', 'trn already exist');
    return true;
}

// Question 1 a-vi. Each registration record must be appended to localStorage key called RegistrationData using JavaScript (as an array of objects.)
function registerUser(firstName, lastName, userName, email, phone, trn, gender, dob, password, terms){
    const newUser = new User(firstName, lastName, userName, email, phone, trn, gender, dob, password, terms);

    let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    
    const usernameExists = isUserNameExists(userName);
    const trnExists = isTrnExists(trn);
    const emailExists = isEmailExists(email);

    console.log(`username Exists: ${usernameExists}`);
    console.log(`trn Exists: ${trnExists}`);

    if(!usernameExists && !trnExists && !emailExists){
        console.log(true);
        users.push(newUser);

        localStorage.setItem("RegistrationData", JSON.stringify(users));
        return true;
    }
    
    return false
}

// Question 1. b-ii.	validate this login data by checking the currently entered trn and password against data associated with the localStorage key called, RegistrationData. 
function isloginUserValid(identifier, password){
    let valid = true;
    if(!/^\d{3}-\d{3}-\d{3}$/.test(identifier)){ showError('err-identifier','Please enter a valid TRN. eg. 000-000-000'); valid = false; }
    if(password.length < 1){ showError('err-login-password','Please enter your password.'); valid = false; }
    if(!valid) return;
    return valid;
};

// Question 1. b-ii.	validate this login data by checking the currently entered trn and password against data associated with the localStorage key called, RegistrationData. 
function login(identifier, password){
    let userValues = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    userValues = userValues.find(
        u => u.trn === identifier || 
        u.email === identifier && 
        u.password === password)

        // console.log(userValues);

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

    // Question 1 a-iv.	visitor must be over 18 years old to register. 
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    const maxDate = today.toISOString().split("T")[0];
    document.querySelector('input[name="dob"]').setAttribute('max', maxDate);

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
    // Question 1. a-vii.	Register (used to stored registration form data) 
    if(registerForm){
        registerForm.addEventListener('submit', function(e){
            const source = e.submitter.id;

            if(source !== "register-btn"){ return; }

            e.preventDefault();
            clearErrors(registerForm);

            const firstName = document.getElementById('firstName').value.trim();
            const lastName  = document.getElementById('lastName').value.trim();
            const userName  = document.getElementById('userName').value.trim();
            const email     = document.getElementById('reg-email').value.trim();
            const phone     = document.getElementById('reg-phone').value.trim();
            const trn  = document.getElementById('trn').value.trim();
            const gender = document.querySelector('input[name="gender"]:checked')?.value;
            const dob = document.getElementById("reg-dob").value;
            const password  = document.getElementById('reg-password').value;
            const confirm   = document.getElementById('confirm-password').value;
            const terms     = document.getElementById('terms').checked;

            const valid = isRegistrationValid(firstName, lastName, userName, email, phone, trn, gender, dob, password, confirm, terms);
            
            console.log('validation is: ' + valid);
            if(valid){
                console.log(trn);
                const registered = registerUser(firstName, lastName, userName, email, phone, trn, gender, dob, password, terms);
                if(registered){login(trn, password);}
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
