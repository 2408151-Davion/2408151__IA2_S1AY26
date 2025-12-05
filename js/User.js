
 // Question 1 a-vi
export class User {
    
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
        this.dateOfRegistration = new Date().toISOString();
        this.cart = [];
        this.orders = [];
        this.pmtMethods = [];
        this.addresses = [];
        this.invoices = [];
    }

    greet(){ return `Welcome, ${this.firstName}`};

    static getAllUsers(){
        return JSON.parse(localStorage.getItem("RegistrationData")) || [];
    }

    static getUser(userID){
        const users = this.getAllUsers();
        const currentUserID = Number(userID);
        const data = users.find(u => u.id == currentUserID);

        if(!data) return null;

        const user = Object.assign(new User(), data);
        console.log(user);
        return user;
    }

    static getCurrentUser() {
        const userID = sessionStorage.getItem("userID");
        if(!userID) return;
        console.log(userID);
        return this.getUser(userID);
    }

    static saveUser(user){
        const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
        const index = users.findIndex(u => u.id == user.id);

        if (index > -1) {
            users[index] = user;
        }
        console.log(index);
        localStorage.setItem("RegistrationData", JSON.stringify(users));
    }

    static addAddress(addressObj){
        const user = this.getCurrentUser();
        if(!user) return;
        console.log(user);
        
        if (!user.addresses) user.addresses = [];

        user.addresses.push(addressObj);
        this.saveUser(user);
    }
    static deleteAddress(addressID) {
        const user = User.getCurrentUser();
        console.log(user);
    
        if (!user || !user.addresses) return;
        user.addresses = user.addresses.filter(addr => addr.id != addressID);
    
        User.saveUser(user);
    }

    static saveCart(cartObj){
        const user = this.getCurrentUser();
        if(!user) return;
        console.log(user);
        
        if (!user.cart) user.cart = [];

        user.cart.push(cartObj);
        this.saveUser(user);
    }

    static getUserCart(){
        const user = this.getCurrentUser();
        return user?.cart || [];
    }
        
    static saveOrders(orderObj){
        const user = this.getCurrentUser();
        if(!user) return;
        console.log(user);
        
        if (!user.orders) user.orders = [];

        user.orders.push(orderObj);
        this.saveUser(user);
    }

    static getUserOrders(){
        return this.getCurrentUser()?.orders || [];
    }

    static saveInvoice(invoiceObj){
        const user = this.getCurrentUser();
        if(!user) return;
            
        if (!Array.isArray(user.invoices)) {
            user.invoices = [];
        }

        user.invoices.push(invoiceObj);
        this.saveUser(user);

        return invoiceObj.invoiceNum;
    }

    static getAllUserInvoices(){
        return this.getCurrentUser()?.invoices || [];
    }

    static getUserInvoice(id){
        const invoices = this.getAllUserInvoices() || [];
        const invoice = invoices.find(i => i.invoiceNum == id) || null;
        return invoice;
    }

    static GetUserInvoices(trn) {
        const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];

        const userInvoices = allInvoices.filter(inv => inv.trn == trn);

        console.log(`Invoices for TRN ${trn}:`, userInvoices);
        return userInvoices;
    }

};

export function getUser(userID){
    const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    
    const currentUserID = Number(userID);
    const data = users.find(u => u.id == currentUserID);

    if(!data){return null}

        const user = new User(
        data.firstName,
        data.lastName,
        data.userName,
        data.email,
        data.phone,
        data.trn,
        data.gender,
        data.dob,
        data.password,
        data.terms
    );

    // Restore saved data
    user.id = data.id;
    user.cart = data.cart || [];
    user.pmtMethods = data.pmtMethods || [];
    user.addresses = data.addresses || [];
    user.invoices = data.invoices || [];

    return user;
}

export function saveUser(user) {
    const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const index = users.findIndex(u => u.id == user.id);

    if (index > -1) {
        users[index] = user;
    }

    localStorage.setItem("RegistrationData", JSON.stringify(users));
}

