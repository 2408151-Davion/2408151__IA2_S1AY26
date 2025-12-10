window.uriRoot = "";
const host = location.hostname;

if(host == "2408151-davion.github.io"){
    window.uriRoot = "/2408151__IA2_S1AY26";
} else if(host == "127.0.0.1") {
    window.uriRoot = "";
}

export const checkoutBtnEl = document.querySelectorAll(".checkout-btn");

export const index = `${uriRoot}/index.html`;

export const shop = `${uriRoot}/pages/shop/shop.html`;

export const cart = `${uriRoot}/pages/cart/cart.html`;

export const invoice = `${uriRoot}/pages/cart/invoice.html`;

export const login = `${uriRoot}/pages/login.html`;

export const dashboard = `${uriRoot}/dashboard.html`

export const logo = `${uriRoot}/assets/logo_white.png`;

export const closeXIcon = `${uriRoot}/assets/close-x-white.png`;

export const checkOutBtnLink = `${uriRoot}/pages/cart/checkout.html`;

export const checkOutBtnIcon = `${uriRoot}/assets/shopping-cart.png`;

export const loaderIcon = `${uriRoot}/assets/loader.gif`;

export const viseCardImg = `${uriRoot}/assets/visa.jpg`;

export const accLocked = `${uriRoot}/pages/account_locked.html`;
