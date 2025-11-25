
document.addEventListener("DOMContentLoaded", () => {
    const ordersData = JSON.parse(localStorage.getItem("Orders")) || [];
    
    if (ordersData.length === 0) return; 

    const latestOrder = ordersData[ordersData.length - 1];

    
    const invoiceNumberEl = document.getElementById("invoiceNumber");
    const invoiceDateEl = document.getElementById("invoiceDate");
    invoiceNumberEl.textContent = latestOrder.orderId;
    invoiceDateEl.textContent = latestOrder.orderDate;

    
    const customerNameEl = document.getElementById("customerName");
    const customerEmailEl = document.getElementById("customerEmail");
    customerNameEl.textContent = latestOrder.cardInfo.cardHolder;
    customerEmailEl.textContent = latestOrder.cardInfo.email || "N/A";

    
    const tbody = document.querySelector("#invoiceTable tbody");
    tbody.innerHTML = ""; 

    let subtotal = 0;

    latestOrder.orders.forEach(item => {
        const total = item.price * item.quantity || item.price;
        subtotal += total;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity || 1}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${total.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });

    
    const tax = latestOrder.taxAmt || subtotal * 0.15; 
    const grandTotal = latestOrder.grantTotal || subtotal + tax;

    
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
});
