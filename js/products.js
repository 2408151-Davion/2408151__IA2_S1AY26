import products from "./productsList.js";
import { addToCart } from "./cart.js";
import { showMessage } from "./utils.js";

let uriRoot = "";
const host = location.hostname;

if (host === "2408151-davion.github.io") {
    uriRoot = "/2408151__IA2_S1AY26";
}


const currentPath = window.location.pathname;
const container = document.getElementById("product-container");
const productPage = `${uriRoot}/pages/shop/products/product.html`;
const productDetailsEl = document.querySelector(".product-details");


export function getProduct(pid){
    const allProducts = JSON.parse(localStorage.getItem("AllProducts")) || [];
    const product = allProducts.find(product => product.id === pid);
    return product;
}

// Question 2 c. Display the product list dynamically on the website. & d. Each product should have an “Add to Cart” button.
export function listRandomProducts(){
    const allProducts = JSON.parse(localStorage.getItem("AllProducts")) || [];
    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
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
                <p id="atc-message-${product.id}"></p>
            </div>
        `;

        if(container){container.appendChild(card);}
    });
};

// Question 2 c. Display the product list dynamically on the website. & d.	Each product should have an “Add to Cart” button.
function listAllProducts(){
    const allProducts = JSON.parse(localStorage.getItem("AllProducts")) || [];
    allProducts.forEach((product) => {
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
                <p id="atc-message-${product.id}"></p>
            </div>
        `;

        container.appendChild(card);
    });
};

function productDetails(){
    const allProducts = JSON.parse(localStorage.getItem("AllProducts")) || [];
    const productImg = document.querySelector(".product-img");
    const productName = document.querySelector(".product-name");
    const productPrice = document.querySelector(".product-price");
    const productDesc = document.querySelector(".product-desc");

    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"));

    const product = allProducts.find(product => product.id === productId);

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



// Question 2 a. Product List (Using Arrays & Objects) & b.	An updated product list must be kept on localStorage, as AllProducts. 
function addProductsToStorage(){
    if (localStorage.getItem("AllProducts") === "true") {
        return;
    }
    let productStorage = JSON.parse(localStorage.getItem("AllProducts")) || [];

    products.forEach((product) => {
        const pid = productStorage.find(p => p.id == product.id);
        if(!pid){
            productStorage.push({
                id: product.id,
                image: uriRoot + product.image,
                name: product.name,
                price: product.price,
                description: product.description
            });
        }
    });

    localStorage.setItem("AllProducts", JSON.stringify(productStorage));
    
}

document.addEventListener("DOMContentLoaded", () => {    

    addProductsToStorage();
    if(currentPath.includes("shop") && !currentPath.includes("products")){
        listAllProducts();
        
    } else if(currentPath.includes("products")){
        productDetails();
        listRandomProducts();
    } else {
        listRandomProducts();
    }

    
    // Question 2 e. Add to Cart
    if(container){
        container.addEventListener("click", (e) => {
            if(e.target.classList.contains("addToCart")){
                const productId = Number(e.target.dataset.id);
                console.log(productId);
                addToCart(productId);
                
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