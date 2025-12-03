document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login").addEventListener("submit", (e) => {
        e.preventDefault();

        localStorage.setItem("John", JSON.stringify({
            userName: "John",
            password: "LakeFire"
        }));

        const user = document.getElementById("RegistrationData").value;
        const userFound = localStorage.getItem(user);

        if(userFound){
            const userValue = JSON.parse(userFound);
            document.getElementById("username").innerText = userValue.userName;
            document.getElementById("password").innerText = userValue.password;
            // window.location.href = "../index.html"
            window.location.replace("http://127.0.0.1:5500/index.html");
        } else {
            
            document.getElementById("username").innerText = "Username not found";
            document.getElementById("password").innerText = "Password is not available";
        }


    });
});
