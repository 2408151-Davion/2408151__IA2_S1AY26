import {login, index} from "./links.js";

function isLoggedIn(){
    const user = sessionStorage.getItem("user");
    if(!user){
        window.location.href = login;
        return false
    }
    return true;
}

function logout(redirectTo = index){
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userID");
    sessionStorage.removeItem("userTRN");

    setTimeout(() => {
        window.location.replace(redirectTo);
    }, 50);
}

export default { isLoggedIn, logout };