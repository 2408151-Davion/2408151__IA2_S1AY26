import { User } from "./User.js";

export function displayInvoice(invoiceNum){
    const invoice = User.getUserInvoice(invoiceNum);
    
    const invoiceNumberEl = document.getElementById("invoiceNumber");
    const invoiceDateEl = document.getElementById("invoiceDate");
    const customerTRNEl = document.getElementById("customerTRN");
    invoiceNumberEl.textContent = invoice.invoiceNum;
    invoiceDateEl.textContent = invoice.orderDate;
    customerTRNEl.textContent = invoice.user.trn || "N/A";

    
    const customerNameEl = document.getElementById("customerName");
    const customerEmailEl = document.getElementById("customerEmail");
    customerNameEl.textContent = invoice.user.name;
    customerEmailEl.textContent = invoice.user.email || "N/A";

    const street = document.getElementById("customerStreet");
    const cityNParish = document.getElementById("customerCityNParish");
    const phone = document.getElementById("customerPhone");

    street.textContent = invoice.shippingAddress.street;
    cityNParish.textContent = `${invoice.shippingAddress.city}, ${invoice.shippingAddress.parish}`;
    phone.textContent = invoice.shippingAddress.phone;
    
    const paymentMethod = document.getElementById("paymentMethod");
    paymentMethod.textContent = invoice.cardInfo.cardNumber;

    
    const tbody = document.querySelector("#invoiceTable tbody");
    tbody.innerHTML = ""; 

    let subtotal = 0;

    invoice.orders.forEach(item => {
        const total = item.price * item.quantity || item.price;
        subtotal += total;
        
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name} </td>
            <td>${item.quantity || 1}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${total.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });

    
    const tax = invoice.taxAmt || subtotal * 0.15; 
    const grandTotal = invoice.grantTotal || subtotal + tax;

    
    document.getElementById("subtotalAmount").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("taxAmount").textContent = `$${tax.toFixed(2)}`;
    document.getElementById("totalAmount").textContent = `$${grandTotal.toFixed(2)}`;

    
    const downloadBtn = document.getElementById("downloadBtn");
    downloadBtn.addEventListener("click", () => {
        const invoiceContent = document.querySelector(".invoice-container").innerHTML;
        const blob = new Blob([invoiceContent], { type: "text/html" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Invoice_${latestOrder.orderId}.html`;
        link.click();
    });

}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const invoiceNum = urlParams.get("invoice");
console.log(invoiceNum);
    if (invoiceNum) {
        displayInvoice(invoiceNum);
    }



});
