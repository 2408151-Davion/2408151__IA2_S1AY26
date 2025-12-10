import access from "./access.js";
import auth from "./userAuth.js";
import { index, logo, closeXIcon, cart } from "./links.js";
import { showUserFrequency, ShowInvoices } from "./dashboard.js";
import { invoice } from "./links.js";

const logoLink = document.querySelectorAll(".logo-link");
const logoImg = document.querySelectorAll(".logo-img");
const closeXEl = document.querySelectorAll(".close-btn-icon");
const chkoutCnlBtn = document.getElementById("checkout-cancel-btn");

window.uriRoot = "";
const host = location.hostname;

if(host == "2408151-davion.github.io"){
    window.uriRoot = "/2408151__IA2_S1AY26";
} else if(host == "127.0.0.1") {
    window.uriRoot = "";
}




document.addEventListener("DOMContentLoaded", () => {
    if(logoLink){
        logoLink.forEach(link => {
            link.setAttribute("href", index);
        });
    }

    if(logoImg){
        logoImg.forEach(img => {
            img.src = logo;
        });
    }

    if(closeXEl){
        closeXEl.forEach(img => {
            img.src = closeXIcon;
        });
    }

    if(chkoutCnlBtn){
        chkoutCnlBtn.href = cart;
    }

    const authButtons = document.getElementById("authButtons");
    const registerBtn = document.getElementById("registerBtn");
    if(authButtons){authButtons.style.cursor = "pointer";}
    if(registerBtn){registerBtn.style.cursor = "pointer";}

    const loginButton = document.createElement("a");
    // loginButton.setAttribute("href", "C:\Users\coder\source\repos\2408151__IA2_S1AY26\pages\login.html")
    loginButton.addEventListener('click', () => {
        window.location.href = `${uriRoot}/pages/login.html#login`;
    });
    loginButton.textContent = "Login";

    const registerLink = document.createElement("a");
    // registerLink.setAttribute("href", "pages/login.html")
    registerLink.addEventListener('click', () => {
        window.location.href = `${uriRoot}/pages/login.html#register`;
    });
    registerLink.textContent = "Register";

    const logoutButton = document.createElement("a");
    logoutButton.setAttribute("id", "logout")
    logoutButton.setAttribute("href", "#")
    logoutButton.textContent = "Logout";

    if(sessionStorage.length === 0 || !sessionStorage.getItem("user")){
        const cartTab = document.getElementById("cartTab");
        if(cartTab){cartTab.style.display = "none"}
        if(authButtons){authButtons.append(loginButton);}
        if(registerBtn){registerBtn.append(registerLink);}

    } else {
        if(authButtons){authButtons.append(logoutButton);}
    }

    const enterShopBtn = document.getElementById("enterShopBtn");
    if(enterShopBtn){
        enterShopBtn.addEventListener('click',() => {
            // if(access.isLoggedIn()){
                window.location.href = "/pages/shop/shop.html";
            // }
        });
    };

    logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        access.logout();
    });

    auth.endUserSession();

    showUserFrequency();

    // Show everything
    // console.log(ShowInvoices());

    // Search by TRN
    // console.log(ShowInvoices("123456789"));


    const invoiceForm = document.getElementById("invoiceSearchForm");
    if(invoiceForm){
        invoiceForm.addEventListener("submit", function (event) {
            event.preventDefault();
            
            ShowInvoices()
        });
    }


    
});
