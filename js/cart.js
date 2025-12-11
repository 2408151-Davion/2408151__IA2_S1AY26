// Davion Spaulding-Bowen, ID: 2408152
// Terence Tucker, ID: 2405308
// Jelani Harding, ID: 2307613


import {getProduct, listRandomProducts} from "./products.js";
import { index, checkOutBtnLink, checkoutBtnEl } from "./links.js";
import { showMessage } from "./utils.js";
import access from "./access.js";
import { User } from "./User.js";


const shoppingCart = document.getElementById("shopping-cart-items");
const totalItemsEl = document.getElementById("total-cart-items");
const subTotalPriceEl = document.getElementById("sub-total-price");
const emptyCartMsg = document.getElementById("empty-cart");
const cartFooter = document.getElementById("cart-footer");
const checkoutContainer = document.getElementById("checkout-container");
const discountEl = document.getElementById("discount");
const grantTotalEl = document.getElementById("grand-total");
const discountedAmtEl = document.getElementById("discounted-amt");
const taxedAmtEl = document.getElementById("taxed-amt");
const taxEl = document.getElementById("tax");
const checkoutBtn = document.querySelector(".checkout-btn");
const cartCount = document.getElementById("total-items");
const clearAllItemsBtn = document.getElementById("clear-all-items");
const closeCartBtn = document.querySelector(".closeCart");

// Question 2 e. Add to Cart
export function addToCart(pid){
    if(!access.isLoggedIn()){
        alert("You must be logged in to add items to your cart.");
        return;
    }

    const product = getProduct(pid);

    const itemNum = Math.floor(Math.random() * 9000) + 1000;
    const cartItems = {
        itemNum: itemNum,
        id: product.id,
        image: product.image,
        name: product.name,
        description: product.description,
        price: product.price
    };

    User.saveCart(cartItems);

    showMessage(`atc-message-${pid}`, "Added to cart successfully");
    setTimeout(() => {
        const cartFooter = document.getElementById("cart-footer");
        const cartEl = document.getElementById("shopping-cart-items");
        //Clear the element before reloading the cart to update it
        if(cartEl){cartEl.innerHTML = "";}
        if(cartFooter){cartFooter.style.display = "none";}

        loadCart();
    }, 300);
    
};

// Question 3 a. Create a shopping cart page that lists the items in the cart (name, price, quantity, sub-total, discount, tax, and total, etc).
export function loadCart(){
    if(shoppingCart){shoppingCart.style.display = "block";}
    if(clearAllItemsBtn){clearAllItemsBtn.style.display = "block";}
    const cartItems = User.getUserCart();
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
    if(shoppingCart){
        Object.values(groupItems).forEach((item) => {
            total += Number(item.price * item.count);
            shoppingCart.innerHTML += `
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
    const tax = total >= minDiscountLmt ? 0.10 : 0.3;
    const text = totalItems > 1 ? "items" : "item";
    let discount = total >= minDiscountLmt ? 0.05 : 0;
    const discountAmt = total*discount;
    const taxAmt = discountAmt == 0 ? total*tax : discountAmt*tax;
    const grantTotal = (total-discountAmt)+taxAmt;

    if(totalItemsEl){totalItemsEl.innerHTML = `${totalItems} ${text}`;}
    if(subTotalPriceEl){subTotalPriceEl.innerHTML = `$${total}`;}
    if(discountEl){discountEl.innerHTML = `${discount*100}%`;}
    if(discountedAmtEl){discountedAmtEl.innerHTML = `-$${discountAmt}`;}
    if (taxEl) {taxEl.innerHTML = `${tax * 100}%`;}
    if (taxedAmtEl) {taxedAmtEl.innerHTML = `+$${taxAmt}`;}
    if(grantTotalEl){grantTotalEl.innerHTML = `$${grantTotal}`;}

    if(totalItems == 0){
        if(shoppingCart){shoppingCart.style.display = "none";}
        if(clearAllItemsBtn){clearAllItemsBtn.style.display = "none";}
        if(emptyCartMsg){emptyCartMsg.style.display = "block";}
        if(cartFooter){cartFooter.style.display = "block";}
    }

    console.log(cartItems.length);

    updateCartItemsCount(cartCount);
}
// Question 3 d. Clear All button (remove all items from shopping cart)
export function removeAllItemsFromCart(){
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
export function removeItemFromCart(itemNum){
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
export function removeAllSameItemsFromCart(itemId){
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

export function onRemoveClick(e){
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

export function onAddToCartClick(e){
    if(e.target.classList.contains("increaseItem")){
        const id = Number(e.target.dataset.id);
        addToCart(id);
    };
}

export function updateCartItemsCount(elID){
    // const currentUserID = sessionStorage.getItem("userID");
    // const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    // const user = users.find(u => u.id == currentUserID);
    // const cartItems = user.cart;
    const cartItems = User.getUserCart();
    const itemCount = cartItems.length;
    console.log(itemCount);
    if(elID){elID.textContent = itemCount;};
}

// export function displayOrders(){

// }

document.addEventListener("DOMContentLoaded", () => {
    loadCart();

    if(shoppingCart){shoppingCart.addEventListener("click", (e) => onRemoveClick(e));}
    if(shoppingCart){shoppingCart.addEventListener("click", (e) => onAddToCartClick(e));}
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