import { showError, clearErrors } from "./userAuth.js";
import { removeAllItemsFromCart } from "./cart.js";

const cart = document.getElementById("shopping-cart-items");
const subTotalPriceEl = document.getElementById("sub-total-price");
const emptyCartMsg = document.getElementById("empty-cart");
const checkoutContainer = document.getElementById("checkout-cart-items");
const discountEl = document.getElementById("discount");
const grantTotalEl = document.getElementById("grand-total");
const discountedAmtEl = document.getElementById("discounted-amt");
const taxedAmtEl = document.getElementById("taxed-amt");
const taxEl = document.getElementById("tax");
const confirmCheckoutBtn = document.getElementById("confirm-checkout-btn");
const pmtsPopoverContainer = document.querySelector(".popover-container");
const pmtsaPopoverCloseBtn = document.querySelector(".a-popover-close-btn");
const addPaymentMethodBtn = document.querySelector(".add-payment-method-btn");
const submitBtnEl = document.getElementById("add-pmts-submit-btn");
const cancelBtnEl = document.getElementById("add-pmts-cancel-btn");
const cardDetailsForm = document.getElementById("card-details-form");
const cardList = document.getElementById("list-of-cards");

export function loadCheckoutList(){
    const currentUser = sessionStorage.getItem("userID");
    const items = JSON.parse(localStorage.getItem("cart") || []);
    const userItems = items.filter(item => item.user === currentUser);

    if(userItems === 0){
        cart.innerHTML = "";
        emptyCartMsg.style.display = "block";
        subTotalPriceEl.textContent = "";
        return;
    }

    const groupItems = {};

    let subtotal = 0;
    userItems.forEach((item) => {
        // total += Number(item.price);
        if(groupItems[item.id]){
            groupItems[item.id].count++;
        } else {
            groupItems[item.id] = {...item, count:1};
        }
    })

    let totalItems = userItems.length;
    
    Object.values(groupItems).forEach((item) => {
        subtotal += Number(item.price * item.count);
        console.log(subtotal);
        checkoutContainer.innerHTML += `
            <li class="cartItem" data-id="${item.id}">
            <div>
            <div>
                <img src="${item.image}" class="cart-img" />
                </div>
                    <span class="item-quantity"> 
                        <input type="submit" class="reduceItem" data-id="${
                          item.itemNum
                        }" value="-">
                        ${item.count}
                        <input type="submit" class="increaseItem" data-id="${
                          item.id
                        }" value="+">
                    </span>
                    </div>
                <div class="item-desc"> 
                    <p>${item.description == null ? "" : item.description}</p>
                </div>
                <div class="ci-details">
                    <span class="cart-name">${item.name}</span>
                    <span class="cart-price">$${item.price * item.count}</span>
                </div>
            </li>
        `;
        console.log(item.user, item.id, item.name, item.price, item.description, item.itemNum);
    });

    const minDiscountLmt = 6000;
    const tax = subtotal >= minDiscountLmt ? 0.10 : 0.3;
    const text = totalItems > 1 ? "items" : "item";
    let discount = subtotal >= minDiscountLmt ? 0.05 : 0;
    const discountAmt = subtotal*discount;
    const taxAmt = discountAmt == 0 ? subtotal*tax : discountAmt*tax;
    const grantTotal = (subtotal-discountAmt)+taxAmt;
    console.log((subtotal-discountAmt)+taxAmt);



    if (subTotalPriceEl) {
        subTotalPriceEl.innerHTML = `Sub-total (${totalItems} ${text}): <span>$${subtotal}</span>`;
    }
    if (discountEl) {
        discountEl.innerHTML = `discount applied: <span>${discount * 100}%</span>`;
    }
    if (discountedAmtEl) {
        discountedAmtEl.innerHTML = `discount: <span>-$${discountAmt}</span>`;
    }
    if (taxEl) {
        taxEl.innerHTML = `tax applied: <span>${tax * 100}%</span>`;
    }
    if (taxedAmtEl) {
        taxedAmtEl.innerHTML = `tax amount: <span>+$${taxAmt}</span>`;
    }
    if (grantTotalEl) {
        grantTotalEl.innerHTML = `Total: <span>$${grantTotal}<span>`;
    }

}

function confirmCheckout() {
    
    const loader = document.querySelector(".loader");
    const innerPopover =document.querySelector(".inner-popover");
    console.log("confirm checkout function");
    const currentUser = sessionStorage.getItem("userID");
    const selectedInput = document.querySelector('input[name="selectedCard"]:checked');


    if(!selectedInput){
        if(pmtsPopoverContainer){
            pmtsPopoverContainer.style.display = "flex"
                if(innerPopover){
                    innerPopover.style.display = "none";
                }
            
        
            setTimeout(() => {
                if(loader){loader.style.display = "none"}
                showError("checkoutErrorMessage", "No payment method has been selected");
                        setTimeout(() => {
            pmtsPopoverContainer.style.display = "none"
            }, 3000);
            }, 300);

        }

    }
    const selectedCard = selectedInput.value;

    const cards = JSON.parse(localStorage.getItem("paymentInfo")) || [];
    const userCard = cards.find(card => card.id === Number(selectedCard));

    console.log(userCard);

    const orderedItems = [];
    const items = JSON.parse(localStorage.getItem("cart")) || [];

    const userItems = items.filter(item => item.user === currentUser);
    let subtotal = 0;
    userItems.forEach((item) => {
        subtotal += Number(item.price);
        console.log(subtotal);
        orderedItems.push({
            itemNum: item.itemNum,
            user: item.userID,
            id: item.id,
            image: item.image,
            name: item.name,
            description: item.description,
            price: item.price
        });
    });

    let totalItems = userItems.length;

    const minDiscountLmt = 6000;
    const tax = subtotal >= minDiscountLmt ? 0.10 : 0.3;
    const text = totalItems > 1 ? "items" : "item";
    let discount = subtotal >= minDiscountLmt ? 0.05 : 0;
    const discountAmt = subtotal*discount;
    const taxAmt = discountAmt == 0 ? subtotal*tax : discountAmt*tax;
    const grantTotal = (subtotal-discountAmt)+taxAmt;

    const receipt = {
        numberOfItems: totalItems,
        subtotal: subtotal,
        discountAmt: discountAmt,
        taxAmt: taxAmt,
        grantTotal: grantTotal,
    };

    const now = new Date();
    const newOrders = {
        userId: currentUser,
        orderId: Date.now(),
        orderDate: now.toLocaleDateString(),
        cardInfo: {
            id: userCard.id,
            cardNumber: userCard.cardNumber,
            cardHolder: userCard.cardHolder,
            expiryDate: userCard.expiryDate,
            expiryYear: userCard.expiryYear,
            cvvNumber: userCard.cvvNumber
        },
        orders: orderedItems,
        receipt: receipt
    }

    const orders = JSON.parse(localStorage.getItem("Orders")) || [];
    orders.push(newOrders);

    localStorage.setItem("Orders", JSON.stringify(orders));
    removeAllItemsFromCart(currentUser);
    


    
        if(pmtsPopoverContainer){
            pmtsPopoverContainer.style.display = "flex"
                if(innerPopover){
                    innerPopover.style.display = "none";
                }
            setTimeout(() => {
            if(loader){loader.style.display = "none"}
            pmtsPopoverContainer.style.display = "none"
            }, 3000);
        }

        window.location.replace("/pages/cart/invoice.html");


}

function closeAddCardPopover(e){
    const closeAction = e.target.dataset.action;

    if(closeAction === "a-popover-close"){
        if(pmtsPopoverContainer){
            pmtsPopoverContainer.style.display = "none"
        }
    }
}

function openAddCardPopover(e){
    const loader = document.querySelector(".loader");
    const innerPopover =document.querySelector(".inner-popover");
    const errorEl = document.getElementById("checkoutErrorMessage");
    const openAction = e.target.dataset.action;
    if(openAction === "a-add-card-popover-open"){
        if(pmtsPopoverContainer){
            pmtsPopoverContainer.style.display = "flex";
            setTimeout(() => {
                if(innerPopover){
                    innerPopover.style.display = "block";
                }
            if(loader){loader.style.display = "none"}
            }, 3000);
        }
    }
}

function addCard(cardNumber, cardHolder, expiryDate, expiryYear, cvvNumber){

    const loader = document.querySelector(".loader");
    const currentUser = sessionStorage.getItem("userID");
    const newCard = {
        userID: currentUser,
        id: Date.now(),
        cardNumber: cardNumber.slice(-4),
        cardHolder: cardHolder,
        expiryDate: expiryDate,
        expiryYear: expiryYear,
        cvvNumber: cvvNumber
    }

    if(loader){loader.style.display = "block"}

    const paymentInfo = JSON.parse(localStorage.getItem("paymentInfo")) || [];
    const newCardLastFourDigits = cardNumber.slice(-4);
    const filteredCard = paymentInfo.filter(digit => {return digit.cardNumber === newCardLastFourDigits || digit.cvvNumber === cvvNumber});

    if(filteredCard.length > 0){   
        setTimeout(() => {
            if(loader){loader.style.display = "none"}
            if(pmtsPopoverContainer){
                pmtsPopoverContainer.style.display = "none"
                cardDetailsForm.reset();
            }
        }, 5000)
        return;
    }
    paymentInfo.push(newCard);
    localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));

    setTimeout(() => {
        if(loader){loader.style.display = "none"}
        if(pmtsPopoverContainer){
            displayCards();
            pmtsPopoverContainer.style.display = "none"
            cardDetailsForm.reset();
        }
    }, 5000)
}

function displayCards(){
    const currentUser = sessionStorage.getItem("userID");
    const cards = JSON.parse(localStorage.getItem("paymentInfo")) || [];
    const userCards = cards.filter(card => card.userID === currentUser);

    // if(userCards === 0){
    //     cart.innerHTML = "";
    //     emptyCartMsg.style.display = "block";
    //     subTotalPriceEl.textContent = "";
    //     return;
    // }

    const groupCards = {};

    userCards.forEach((card) => {
        // total += Number(item.price);
        if(groupCards[card.id]){
            groupCards[card.id].count++;
        } else {
            groupCards[card.id] = {...card, count:1};
        }
    })
    
    Object.values(groupCards).forEach((card) => {
        const cardEndingNumber = card.cardNumber.slice(-4);
        cardList.innerHTML += `
            <li class="card-list-heading" data-id="${card.id}">
                <input type="radio" name="selectedCard" value="${card.id}"/>
                <div class="a-span6">
                    <img src="/assets/visa.jpg" class="cart-img" />
                    <span class="card-type"> 
                        Visa
                    </span>
                    <span>
                        ending in ${cardEndingNumber}
                    </span>
                </div>
                <div class="cardholder-name a-span3">
                    <p>${card.cardHolder}</p>
                </div>
                <div class="expiresOn a-text-right a-span3">
                    <span class="card-expiry-date">${card.expiryDate}/${card.expiryYear}</span>
                </div>
            </li>
        `;
        console.log(card.userID, card.id, card.cardHolder, card.expiryDate, card.expiryYear, card.cardNumber, cardEndingNumber);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadCheckoutList();
    displayCards();
    if(cart){cart.addEventListener("click", (e) => onRemoveClick(e, loadCheckoutList));}
    if(confirmCheckoutBtn){confirmCheckoutBtn.addEventListener("click", confirmCheckout);};
    if(pmtsaPopoverCloseBtn){pmtsaPopoverCloseBtn.addEventListener("click", (e) => closeAddCardPopover(e));};

    if(addPaymentMethodBtn){addPaymentMethodBtn.addEventListener("click", (e) => openAddCardPopover(e));};
    if(cancelBtnEl){cancelBtnEl.addEventListener("click", (e) => closeAddCardPopover(e))}
    if(cardDetailsForm){
        cardDetailsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const cardNumber = document.getElementById("card-number").value;
            const cardHolder = document.getElementById("cardholder").value;
            const expiryDate = document.getElementById("add-card-expiration-date").value;
            const expiryYear = document.getElementById("add-card-expiry-year").value;
            const cvvNumber = document.getElementById("cvv-number").value;
            addCard(cardNumber, cardHolder, expiryDate, expiryYear, cvvNumber);
        })
    }


});