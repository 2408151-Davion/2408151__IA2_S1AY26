import { User } from "./User.js";
import { popoverDelay } from "./utils.js";


const pmtsPopoverContainer = document.querySelector(".popover-container");
const cardDetailsForm = document.getElementById("card-details-form");
const cardList = document.getElementById("list-of-cards");
const noCardInfo = document.getElementById("no-cards-info");

export function addCard(cardNumber, cardHolder, expiryDate, expiryYear, cvvNumber){

    const loader = document.querySelector(".loader");
    // const currentUserID = sessionStorage.getItem("userID");
    // const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    // const user = users.find(u => u.id == currentUserID);
    const userCards = User.getPmtMthds();


    if(loader){loader.style.display = "block"}

    const newCardLastFourDigits = cardNumber.slice(-4);
    const filteredCard = userCards.filter(digit => {return digit.cardNumber === newCardLastFourDigits || digit.cvvNumber === cvvNumber});

    if(filteredCard.length > 0){   
        // setTimeout(() => {
        //     if(loader){loader.style.display = "none"}
        //     if(pmtsPopoverContainer){
        //         pmtsPopoverContainer.style.display = "none"
        //         cardDetailsForm.reset();
        //     }
        // }, 5000)
        popoverDelay(cardDetailsForm.reset());
        return;
    }
    
    User.savePmtMthds({
        id: Date.now(),
        cardNumber: cardNumber.slice(-4),
        cardHolder: cardHolder,
        expiryDate: expiryDate,
        expiryYear: expiryYear,
        cvvNumber: cvvNumber
    });
    // localStorage.setItem("RegistrationData", JSON.stringify(users));



    setTimeout(() => {
        if(loader){loader.style.display = "none"}
        if(pmtsPopoverContainer){
            displayCards();
            pmtsPopoverContainer.style.display = "none"
            cardDetailsForm.reset();
        }    
        if(noCardInfo){noCardInfo.style.display = "none";}
    }, 5000)
}

export function closeAddCardPopover(e){

        if(pmtsPopoverContainer){
            pmtsPopoverContainer.style.display = "none"
        }
}

export function openAddCardPopover(e){
    const loader = document.querySelector(".loader");
    const innerPopoverCard =document.querySelector(".inner-popover-card");
    const innerPopoverAddress =document.querySelector(".inner-popover-address");
    const errorEl = document.getElementById("checkoutErrorMessage");
    const openAction = e.target.dataset.action;

    if(loader){loader.style.display = "block"}

    if(openAction === "a-add-card-popover-open"){
        if(pmtsPopoverContainer){
            pmtsPopoverContainer.style.display = "flex";
        if(innerPopoverAddress){
            innerPopoverAddress.style.display = "none";
        }
            setTimeout(() => {
                if(innerPopoverCard){
                    innerPopoverCard.style.display = "block";
                }
            if(loader){loader.style.display = "none"}
            }, 3000);
        }
        return;
    }
}

export function displayCards(){
    const userCards = User.getPmtMthds();

    if(!userCards || userCards.length === 0){
        if(noCardInfo){noCardInfo.style.display = "block";}
        return;
    }

    const groupCards = {};

    userCards.forEach((card) => {
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