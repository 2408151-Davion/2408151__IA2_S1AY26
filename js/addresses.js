// Davion Spaulding-Bowen, ID: 2408152
// Terence Tucker, ID: 2405308
// Jelani Harding, ID: 2307613

import { User } from "./User.js";
import { popoverDelay } from "./utils.js";

window.addEventListener("DOMContentLoaded", displayAddresses);

export function openAddAddressPopover(e){
    const loader = document.querySelector(".loader");
    const innerPopoverCard =document.querySelector(".inner-popover-card");
    const innerPopoverAddress =document.querySelector(".inner-popover-address");
    const errorEl = document.getElementById("checkoutErrorMessage");
    const pmtsPopoverContainer = document.querySelector(".popover-container");
    const openAction = e.target.dataset.action;

    if(loader){loader.style.display = "block"}
    
    if(openAction === "a-add-address-popover-open"){
        if(pmtsPopoverContainer){
            pmtsPopoverContainer.style.display = "flex";
        if(innerPopoverCard){
            innerPopoverCard.style.display = "none";
        }
            setTimeout(() => {
                if(innerPopoverAddress){
                    innerPopoverAddress.style.display = "block";
                }
            if(loader){loader.style.display = "none"}
            }, 3000);
        }
        return;
    }
}

// Question 4 b. Allow the user to enter their shipping details (e.g., name, address, amount being paid). 
export function saveAddress() {
    const loader = document.querySelector(".loader");

    // Create address object
    const newAddress = {
        id: Date.now(),
        fullName: document.getElementById("fullName").value,
        phone: document.getElementById("phone").value,
        street: document.getElementById("addressLine").value,
        city: document.getElementById("city").value,
        parish: document.getElementById("parish").value,
        instructions: document.getElementById("instructions").value,
    };
    
    if(loader){loader.style.display = "block"}

    // Save to user
    User.addAddress(newAddress);
    
    popoverDelay(displayAddresses());

    // Clear the form
    document.getElementById("address-form").reset();

    console.log("Address saved.");
}

export function displayAddresses() {
    const container = document.getElementById("list-of-addresses");
    if (!container) return;

    const user = User.getCurrentUser();

    container.innerHTML = "";

    if (!user || !user.addresses || user.addresses.length === 0) {
        container.innerHTML = "<p>No saved addresses.</p>";
        return;
    }

    user.addresses.forEach(address => {
        container.innerHTML += `
            <li class="address-card" data-id="${address.id}">
                <input type="radio" name="selectedAddress" value="${address.id}"/>
                <div class="address-info">
                    <strong>${address.fullName}</strong>, 
                    ${address.street}, 
                    ${address.city}, ${address.parish}, 
                </div>

                <button class="remove-address" data-id="${address.id}">
                    Remove
                </button>
            </li>
        `;
    });

    attachRemoveEvents();
}

export function attachRemoveEvents() {
    const removeButtons = document.querySelectorAll(".remove-address");

    removeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            removeAddress(id);
        });
    });
}

function removeAddress(addressID) {
    User.deleteAddress(addressID)
    displayAddresses();
}


