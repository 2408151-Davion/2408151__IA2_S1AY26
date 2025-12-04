import {listRandomProducts, addToCart, showMessage} from "./products.js";
import { index, checkOutBtnLink, checkoutBtnEl } from "./links.js";
// import { addToCart } from "./products.js";


const cart = document.getElementById("shopping-cart-items");
const totalItemsEl = document.getElementById("total-cart-items");
const subTotalPriceEl = document.getElementById("sub-total-price");
const emptyCartMsg = document.getElementById("empty-cart");
const checkoutContainer = document.getElementById("checkout-container");
const discountEl = document.getElementById("discount");
const grantTotalEl = document.getElementById("grand-total");
const discountedAmtEl = document.getElementById("discounted-amt");
const checkoutBtn = document.querySelector(".checkout-btn");
const cartCount = document.getElementById("total-items");
const clearAllItemsBtn = document.getElementById("clear-all-items");
const closeCartBtn = document.querySelector(".closeCart");

// Question 3 a. Create a shopping cart page that lists the items in the cart (name, price, quantity, sub-total, discount, tax, and total, etc).
export function loadCart(){
    const currentUserID = sessionStorage.getItem("userID");
    const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const user = users.find(u => u.id == currentUserID);
    const cartItems = user.cart;

    const groupItems = {};

    cartItems.forEach((item) => {
        if(groupItems[item.id]){
            groupItems[item.id].count++;
        } else {
            groupItems[item.id] = {...item, count:1};
        }
    })

    let total = 0;
    const totalItems = cartItems.length;
    if(cart){
        Object.values(groupItems).forEach((item) => {
            total += Number(item.price * item.count);
            cart.innerHTML += `
                <li class="cartItem" data-id="${item.id}">
                    <img src="${item.image}" class="cart-img" />
                    <div class="item-desc"> 
                        <p>${item.description == null ? "" : item.description}</p>
                    </div>
                    <div class="ci-details">
                        <span class="cart-name">${item.name}</span>
                        <span class="cart-price">$${item.price * item.count}</span>
                        <span class="item-quantity">Quantity: 
                            <input type="submit" class="reduceItem" data-id="${item.itemNum}" value="-">
                            ${item.count}
                            <input type="submit" class="increaseItem" data-id="${item.id}" value="+">
                        </span>

                        <input type="submit" class="removeItem" data-id="${item.id}" value="Remove">
                    </div>
                </li>
            `;
        });
    };

    // Question 3 c. Calculate and display the total price of the items in the cart.
    const minDiscountLmt = 6000;
    const text = totalItems > 1 ? "items" : "item";
    let discount = total >= minDiscountLmt ? 0.05 : 0;
    const discountAmt = total*discount;
    const grantTotal = total-discountAmt;

    if(totalItemsEl){totalItemsEl.innerHTML = `${totalItems} ${text}`;}
    if(subTotalPriceEl){subTotalPriceEl.innerHTML = `$${total}`;}
    if(discountEl){discountEl.innerHTML = `${discount*100}%`;}
    if(discountedAmtEl){discountedAmtEl.innerHTML = `-$${discountAmt}`;}
    if(grantTotalEl){grantTotalEl.innerHTML = `$${grantTotal}`;}

    console.log(cartItems.length);

    updateCartItemsCount(cartCount);
}
// Question 3 d. Clear All button (remove all items from shopping cart)
function removeAllItemsFromCart(){
    const currentUserID = sessionStorage.getItem("userID");
    const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const user = users.find(u => u.id == currentUserID);
    user.cart = [];
    
    localStorage.setItem("RegistrationData", JSON.stringify(users));

    // refresh UI
    setTimeout(() => {
        const cart = document.getElementById("shopping-cart-items");
        if(cart){cart.innerHTML = "";}
            loadCart();
    }, 300);
}

// Question 3 b. Allow users to remove items from the cart and update quantities.
function removeItemFromCart(itemNum){
    const currentUserID = sessionStorage.getItem("userID");
    const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const user = users.find(u => u.id == currentUserID);
    user.cart = user.cart.filter(item => !(item.itemNum == itemNum));

    console.log(user.cart);
    localStorage.setItem("RegistrationData", JSON.stringify(users));

    // refresh UI
    setTimeout(() => {
        const cart = document.getElementById("shopping-cart-items");
        if(cart){cart.innerHTML = "";}
        loadCart();
    }, 300);
}

// Question 3 b. Allow users to remove items from the cart and update quantities.
function removeAllSameItemsFromCart(itemId){
    const currentUserID = sessionStorage.getItem("userID");
    const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const user = users.find(u => u.id == currentUserID);
    user.cart = user.cart.filter(item => !(item.id == itemId));

    console.log(user.cart);
    localStorage.setItem("RegistrationData", JSON.stringify(users));

    // refresh UI
    setTimeout(() => {
        const cart = document.getElementById("cart");
        if(cart){cart.innerHTML = "";}
        loadCart();
    }, 300);
}

function onRemoveClick(e){
    if(e.target.classList.contains( "reduceItem")){
        const itemNum = Number(e.target.dataset.id);
        console.log(itemNum);
        removeItemFromCart(itemNum);
        return;
    };

    if(e.target.classList.contains("removeItem")){
        const itemId = Number(e.target.dataset.id);
        console.log(itemId);
        removeAllSameItemsFromCart(itemId);
        return;
    };
}

function onAddToCartClick(e){
    if(e.target.classList.contains("increaseItem")){
        const id = Number(e.target.dataset.id);
        addToCart(id);
    };
}

function updateCartItemsCount(elID){
    const currentUserID = sessionStorage.getItem("userID");
    const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const user = users.find(u => u.id == currentUserID);
    const cartItems = user.cart;
    const itemCount = cartItems.length;
    console.log(itemCount);
    if(elID){elID.textContent = itemCount;};
}

// export function displayOrders(){

// }

document.addEventListener("DOMContentLoaded", () => {
    loadCart();

    if(cart){cart.addEventListener("click", (e) => onRemoveClick(e));}
    if(cart){cart.addEventListener("click", (e) => onAddToCartClick(e));}
    if(clearAllItemsBtn){clearAllItemsBtn.addEventListener("click", removeAllItemsFromCart)}

    if(closeCartBtn){
        closeCartBtn.addEventListener("click", () => {
            location.replace(index);
        })
    }

        if(checkoutBtnEl){
            checkoutBtnEl.forEach(link => {
                link.setAttribute("href", checkOutBtnLink);
            });
        }

    listRandomProducts;
});