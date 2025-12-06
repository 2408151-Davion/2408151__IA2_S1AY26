import { showError, clearError } from "./utils.js";
import { removeAllItemsFromCart } from "./cart.js";
import { saveAddress, openAddAddressPopover } from "./addresses.js";
import { addCard, openAddCardPopover, closeAddCardPopover, displayCards } from "./paymentMethods.js";
import { User } from "./User.js";

const cart = document.getElementById("shopping-cart-items");
const subTotalPriceEl = document.getElementById("sub-total-price");
const totalItemsEl = document.getElementById("total-cart-items");
const emptyCartMsg = document.getElementById("empty-cart");
const checkoutContainer = document.getElementById("checkout-cart-items");
const discountEl = document.getElementById("discount");
const grantTotalEl = document.getElementById("grand-total");
const discountedAmtEl = document.getElementById("discounted-amt");
const taxedAmtEl = document.getElementById("taxed-amt");
const taxEl = document.getElementById("tax");
const confirmCheckoutBtn = document.getElementById("confirm-checkout-btn");
const pmtsPopoverContainer = document.querySelector(".popover-container");
const pmtsaPopoverCloseBtn = document.querySelectorAll(".a-popover-close-btn");
const addPaymentMethodBtn = document.querySelector(".add-payment-method-btn");
const addAddressBtn = document.querySelector(".add-address-btn");
const submitBtnEl = document.getElementById("add-pmts-submit-btn");
const cancelBtnEl = document.getElementById("add-pmts-cancel-btn");
const cardDetailsForm = document.getElementById("card-details-form");
const cardList = document.getElementById("list-of-cards");
const noCardInfo = document.getElementById("no-cards-info");
const addressUser = document.getElementById("user-name");

export function loadCheckoutList(){
    const currentUserID = sessionStorage.getItem("userID");
    const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const user = users.find(u => u.id == currentUserID);
    const userItems = user.cart;

    // const items = JSON.parse(localStorage.getItem("cart") || []);
    // const userItems = items.filter(item => item.user === currentUser);

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

    
    if(totalItemsEl){totalItemsEl.innerHTML = `${totalItems} ${text}`;}
    if(subTotalPriceEl){subTotalPriceEl.innerHTML = `$${subtotal}`;}
    if(discountEl){discountEl.innerHTML = `${discount*100}%`;}
    if(discountedAmtEl){discountedAmtEl.innerHTML = `-$${discountAmt}`;}
    if(grantTotalEl){grantTotalEl.innerHTML = `$${grantTotal}`;}

    if (taxEl) {taxEl.innerHTML = `${tax * 100}%`;}
    if (taxedAmtEl) {taxedAmtEl.innerHTML = `+$${taxAmt}`;}
    if (grantTotalEl) {grantTotalEl.innerHTML = `$${grantTotal}`;}

}

function showPopoverErrorMsg(id, message) {
  const loader = document.querySelector(".loader");
  setTimeout(() => {
    if (loader) {
      loader.style.display = "none";
    }
    showError(id, message);
    setTimeout(() => {
      pmtsPopoverContainer.style.display = "none";
      loader.style.display = "block";
    clearError(id);
    }, 3000);
  }, 2000);
}

function confirmCheckout() {
    
    const loader = document.querySelector(".loader");
    const innerPopoverCard =document.querySelector(".inner-popover-card");
    const innerPopoverAddress =document.querySelector(".inner-popover-address");
    const innerPopover =document.querySelector(".inner-popover");
    console.log("confirm checkout function");
    const selectedCardInput = document.querySelector('input[name="selectedCard"]:checked');
    const selectedAddressInput = document.querySelector('input[name="selectedAddress"]:checked');

    const user = User.getCurrentUser();
        if(pmtsPopoverContainer){
            pmtsPopoverContainer.style.display = "flex"}

    if(!selectedCardInput && selectedAddressInput){
        if(pmtsPopoverContainer){
            pmtsPopoverContainer.style.display = "flex"
            if(innerPopover){innerPopover.style.display = "none";}
            showPopoverErrorMsg("checkoutErrorMessage", "No payment method has been selected");
        }
        return;
    }

    if(!selectedAddressInput && selectedCardInput){
        if(pmtsPopoverContainer){
            pmtsPopoverContainer.style.display = "flex"
            if(innerPopover){innerPopover.style.display = "none";}
            showPopoverErrorMsg("checkoutErrorMessage", "No shipping address has been selected");
        }
        return;
    }

    if(!selectedAddressInput && !selectedCardInput){
        if(pmtsPopoverContainer){
            pmtsPopoverContainer.style.display = "flex"
            if(innerPopover){innerPopover.style.display = "none";}
            showPopoverErrorMsg("checkoutErrorMessage", "No shipping address or payment method has been selected");
        }
        return;
    }

    const selectedCard = selectedCardInput.value;
    const selectedAddress = selectedAddressInput.value;

    const userCard = user.pmtMethods.find(card => card.id === Number(selectedCard));
    const userShippingAddress = user.addresses.find(address => address.id === Number(selectedAddress));

    console.log(user.pmtMethods);

    const orderedItems = [];
    const items = User.getUserCart();

    const currentDate = new Date().toDateString();
    let subtotal = 0;
    items.forEach((item) => {
        subtotal += Number(item.price);
        console.log(subtotal);
        orderedItems.push({
            dateOrdered: currentDate,
            itemNum: item.itemNum,
            user: item.userID,
            id: item.id,
            image: item.image,
            name: item.name,
            description: item.description,
            price: item.price
        });
    });

    let totalItems = items.length;

    const minDiscountLmt = 6000;
    const tax = subtotal >= minDiscountLmt ? 0.10 : 0.03;
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
        userId: user.id,
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
        shippingAddress: {
            id: userShippingAddress.id,
            fullName: userShippingAddress.fullName,
            phone: userShippingAddress.phone,
            street: userShippingAddress.street,
            city: userShippingAddress.city,
            parish: userShippingAddress.parish,
            instructions: userShippingAddress.instructions,
        },
        orders: orderedItems,
        receipt: receipt
    }

    const newInvoice = {
        user: {
            trn: user.trn,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone
        },
        invoiceNum: `CD${newOrders.orderId}`,
        orderDate: now.toLocaleDateString(),
        cardInfo: {
            id: userCard.id,
            cardNumber: userCard.cardNumber,
            cardHolder: userCard.cardHolder,
        },
        shippingAddress: {
            id: userShippingAddress.id,
            fullName: userShippingAddress.fullName,
            phone: userShippingAddress.phone,
            street: userShippingAddress.street,
            city: userShippingAddress.city,
            parish: userShippingAddress.parish,
            instructions: userShippingAddress.instructions,
        },
        orders: orderedItems,
        receipt: receipt
    }

    User.saveOrders(newOrders);
    const invoiceNumber = User.saveInvoice(newInvoice);

    // Question 5 b
    const localInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    localInvoices.push(newInvoice);
    localStorage.setItem("AllInvoices", JSON.stringify(localInvoices));


    removeAllItemsFromCart(user);    

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

    if(invoiceNumber){window.location.replace(`/pages/cart/invoice.html?invoice=${invoiceNumber}`);}


}


document.addEventListener("DOMContentLoaded", () => {
    if(addressUser){addressUser.innerHTML = sessionStorage.getItem("user");}

    loadCheckoutList();
    displayCards();

    if(cart){cart.addEventListener("click", (e) => onRemoveClick(e, loadCheckoutList));}
    if(confirmCheckoutBtn){confirmCheckoutBtn.addEventListener("click", confirmCheckout);}
    if(pmtsaPopoverCloseBtn){pmtsaPopoverCloseBtn.forEach(close => {close.addEventListener("click", (e) => closeAddCardPopover(e));})}
    if(addPaymentMethodBtn){addPaymentMethodBtn.addEventListener("click", (e) => openAddCardPopover(e));}
    if(addAddressBtn){addAddressBtn.addEventListener("click", (e) => openAddAddressPopover(e));}

    if(cardDetailsForm){
        cardDetailsForm.addEventListener("click", (e) => {
            const action = e.target.dataset.action;
            e.preventDefault();
            const cardNumber = document.getElementById("card-number").value;
            const cardHolder = document.getElementById("cardholder").value;
            const expiryDate = document.getElementById("add-card-expiration-date").value;
            const expiryYear = document.getElementById("add-card-expiry-year").value;
            const cvvNumber = document.getElementById("cvv-number").value;
            if(action == "add-card"){
                addCard(cardNumber, cardHolder, expiryDate, expiryYear, cvvNumber);
            }

            if(action === "a-popover-close"){
                closeAddCardPopover(e)
            }
        })
    }

    document.getElementById("address-form").addEventListener("submit", (e) => {
        e.preventDefault();
        saveAddress();
    });


});