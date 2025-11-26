import products from "./productsList.js";
import access from "./access.js";
import { loadCart } from "./cart.js";


const currentPath = window.location.pathname;
const container = document.getElementById("product-container");
const productPage = "/2408151__IA2_S1AY26/pages/shop/products/product.html";
const productDetailsEl = document.querySelector(".product-details");

export function showMessage(id, message){
    const el = document.getElementById(id);
    if(!el){
        el.style.display = "none"
        return;
    }
    el.textContent = message;
    el.style.display = "block";
}

export function listRandomProducts(){
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    const someProducts = shuffled.slice(0, 4);

    someProducts.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <a class="productLink" href="${productPage}?id=${product.id}" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
            </a>
            <div class="card-body">
                <div class="card-title">
                    <h2>${product.name}</h2>
                    <p class="price">$${product.price}</p>
                </div>
                <button class="addToCart" data-id="${product.id}">Add to Cart</button>
                <p id="atc-message"></p>
            </div>
        `;

        if(container){container.appendChild(card);}
    });
};

function listAllProducts(){
    products.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <a href="${productPage}?id=${product.id}">
                <img src="${product.image}" alt="${product.name}">
            </a>
            <div class="card-body">
                <h2>${product.name}</h2>
                <p class="price">$${product.price}</p>
                <button class="addToCart" data-id="${product.id}">Add to Cart</button>
                <p id="atc-message"></p>
            </div>
        `;

        container.appendChild(card);
    });
};

function productDetails(){
    const productImg = document.querySelector(".product-img");
    const productName = document.querySelector(".product-name");
    const productPrice = document.querySelector(".product-price");
    const productDesc = document.querySelector(".product-desc");

    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"));

    const product = products.find(product => product.id === productId);

    if(!product){
        productName.innerText = "No product found";
    }

    console.log(product.id);

    productImg.src = product.image;
    productName.textContent = product.name;
    productPrice.textContent = `$${product.price}`;
    productDesc.textContent = product.description;

    const addToCartBtnDiv = document.createElement("div");
    addToCartBtnDiv.classList.add("add-to-cart-btn-container");

    addToCartBtnDiv.innerHTML = `<button class="p-addToCart" data-id="${product.id}">Add to Cart</button>`;
    productPrice.appendChild(addToCartBtnDiv);
};

export function addToCart(e){
    const productId = Number(e.target.dataset.id);
    const currentUserID = sessionStorage.getItem("userID");
    const itemNum = Math.floor(Math.random() * 9000) + 1000;
    if(access.isLoggedIn()){
        const product = products.find(product => product.id === productId);
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({
            itemNum: itemNum,
            user: currentUserID,
            id: product.id,
            image: product.image,
            name: product.name,
            description: product.description,
            price: product.price
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        setTimeout(() => {
            const cart = document.getElementById("shopping-cart-items");
            //Clear the element before reloading the cart to update it
            if(cart){
                cart.innerHTML = "";
            }
            loadCart();
        }, 1000);
    }
};

document.addEventListener("DOMContentLoaded", () => {

    if(currentPath.includes("shop") && !currentPath.includes("products")){
        listAllProducts();
        
    } else if(currentPath.includes("products")){
        productDetails();
        listRandomProducts();
    } else {
        listRandomProducts();
    }

    
    if(container){
        container.addEventListener("click", (e) => {
            if(e.target.classList.contains("addToCart")){
                addToCart(e);
                
                showMessage("atc-message", "Added to cart successfully");
            };
        });
    }

    if(productDetailsEl){
        productDetailsEl.addEventListener("click", (e) => {
            if(e.target.classList.contains("p-addToCart")){
                addToCart(e);
            };
        });
    }

    // productLink.addEventListener("click", () => {
    //     const id = Number(productLink.dataset.id);
    //     productDetails(id);
    // });


});

// export default {listRandomProducts, addToCart};