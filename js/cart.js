import {listRandomProducts, addToCart, showMessage} from "./products.js";
// import { addToCart } from "./products.js";


const cart = document.getElementById("shopping-cart-items");
const subTotalPriceEl = document.getElementById("sub-total-price");
const emptyCartMsg = document.getElementById("empty-cart");
const checkoutContainer = document.getElementById("checkout-container");
const discountEl = document.getElementById("discount");
const grantTotalEl = document.getElementById("grand-total");
const discountedAmtEl = document.getElementById("discounted-amt");
const checkoutBtn = document.querySelector(".checkout-btn");
const cartCount = document.getElementById("total-items");


export function loadCart(){
    const currentUser = sessionStorage.getItem("userID");
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    const userItems = items.filter(item => item.user === currentUser);

    if(userItems < 1 && cart){
        cart.innerHTML = "";
        emptyCartMsg.style.display = "block";
        subTotalPriceEl.textContent = 0.00;
        return;
    }

    // emptyCartMsg.style.display = "none";

    const groupItems = {};

    userItems.forEach((item) => {
        if(groupItems[item.id]){
            groupItems[item.id].count++;
        } else {
            groupItems[item.id] = {...item, count:1};
        }
    })

    let total = 0;
    let totalItems = userItems.length;
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

                        <input type="submit" class="removeItem" data-id="${item.itemNum}" value="Remove">
                    </div>
                </li>
            `;
            console.log(item.user, item.id, item.name, item.price, item.description, item.itemNum);
        });
    };

    const minDiscountLmt = 6000;
    const text = totalItems > 1 ? "items" : "item";
    let discount = total >= minDiscountLmt ? 0.05 : 0;
    const discountAmt = total*discount;
    const grantTotal = total-discountAmt;

    if(subTotalPriceEl){subTotalPriceEl.innerHTML = `Subtotal (${totalItems} ${text}): <span>$${total}</span>`;}
    if(discountEl){discountEl.innerHTML = `discount applies: <span>${discount*100}%</span>`;}
    if(discountedAmtEl){discountedAmtEl.innerHTML = `discount amount: <span>-$${discountAmt}</span>`;}
    if(grantTotalEl){grantTotalEl.innerHTML = `Total: <span>$${grantTotal}<span>`;}

    updateCartItemsCount(cartCount);
}

export function removeAllItemsFromCart(currentUser){
    let items = JSON.parse(localStorage.getItem("cart")) || [];

    items = items.filter(item => !(item.user === currentUser)
    );
    
    localStorage.setItem("cart", JSON.stringify(items));

    // refresh UI
    setTimeout(() => {
        const cart = document.getElementById("cart");
        if(cart){cart.innerHTML = "";}
            loadCart();
            reloadFunc();
    }, 300);
}

export function removeItemFromCart(id, reloadFunc){
    const currentUser = sessionStorage.getItem("userID");
    let items = JSON.parse(localStorage.getItem("cart")) || [];

    items = items.filter(item => !(item.itemNum == id && item.user === currentUser)
    );

    console.log(items);
    localStorage.setItem("cart", JSON.stringify(items));

    // refresh UI
    setTimeout(() => {
        const cart = document.getElementById("cart");
        if(cart){cart.innerHTML = "";}
        loadCart();
        // reloadFunc();
    }, 300);
}

export function onRemoveClick(e, reloadFunc){
    if(e.target.classList.contains("removeItem") || e.target.classList.contains( "reduceItem")){
        const id = e.target.dataset.id;
        removeItemFromCart(id, reloadFunc);
        
        showMessage("atc-message", "Added to cart successfully");
    };
}

function onAddToCartClick(e){
    if(e.target.classList.contains("increaseItem")){
        addToCart(e);
    };
}

export function updateCartItemsCount(elID){
    const currentUser = sessionStorage.getItem("userID");
    const uCartItem = JSON.parse(localStorage.getItem("cart")) || [];
    const itemCount = uCartItem.filter(item => item.user === currentUser).length;
    console.log(itemCount);
    if(elID){elID.textContent = itemCount;};
}

export function displayOrders(){

}

function onCheckoutClick(){

}

document.addEventListener("DOMContentLoaded", () => {
    loadCart();

    if(cart){cart.addEventListener("click", (e) => onRemoveClick(e, loadCart));}
    if(cart){cart.addEventListener("click", onAddToCartClick);}
    // cart.addEventListener("click", onRemoveClick);

    listRandomProducts;
});