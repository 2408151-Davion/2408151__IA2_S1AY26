import access from "./access.js";
import auth from "./userAuth.js";
import { index } from "./links.js";

const logoLink = document.getElementById("logo-link");

document.addEventListener("DOMContentLoaded", () => {
    logoLink.setAttribute("href", index);
    const authButtons = document.getElementById("authButtons");
    const registerBtn = document.getElementById("registerBtn");
    // sessionStorage.setItem("user", "John");
    // sessionStorage.removeItem("user");

    const loginButton = document.createElement("a");
    loginButton.setAttribute("href", "pages/login.html")
    loginButton.textContent = "Login";

    const registerLink = document.createElement("a");
    registerLink.setAttribute("href", "pages/login.html")
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

    

    
});
