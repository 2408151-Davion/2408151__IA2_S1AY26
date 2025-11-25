
function isLoggedIn(){
    const user = sessionStorage.getItem("user");
    if(!user){
        window.location.href = "/pages/login.html";
        return false
    }
    return true;
}

function logout(redirectTo = "/index.html"){
    sessionStorage.removeItem("user");

    setTimeout(() => {
        window.location.replace(redirectTo);
    }, 50);
}

export default { isLoggedIn, logout };