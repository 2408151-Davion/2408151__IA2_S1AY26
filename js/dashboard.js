import { invoice } from "./links.js";

// Question 6 a
export function showUserFrequency() {
    const maleEl = document.getElementById("male");
    const femaleEl = document.getElementById("female");
    const grpOne = document.getElementById("age-grp-one");
    const grpTwo = document.getElementById("age-grp-two");
    const grpThree = document.getElementById("age-grp-three");
    const grpFour = document.getElementById("age-grp-four");

  const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

  // Gender frequencies
  const genderCount = {
    male: 0,
    female: 0,
  };

  // Age group frequencies
  const ageGroupCount = {
    "18-25": 0,
    "26-35": 0,
    "36-50": 0,
    "50+": 0,
  };

  const getAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();
    return today.getFullYear() - birth.getFullYear();
  };

  users.forEach((user) => {
    // Gender
    genderCount[user.gender]++;

    // Age Groups
    const age = getAge(user.dob);

    if (age >= 18 && age <= 25) ageGroupCount["18-25"]++;
    else if (age >= 26 && age <= 35) ageGroupCount["26-35"]++;
    else if (age >= 36 && age <= 50) ageGroupCount["36-50"]++;
    else if (age > 50) ageGroupCount["50+"]++;
  });

  if(maleEl){maleEl.textContent = genderCount.male;}
  if(femaleEl){femaleEl.textContent = genderCount.female;}

  if(grpOne){grpOne.textContent = ageGroupCount["18-25"];}
  if(grpTwo){grpTwo.textContent = ageGroupCount["26-35"];}
  if(grpThree){grpThree.textContent = ageGroupCount["36-50"];}
  if(grpFour){grpFour.textContent = ageGroupCount["50+"];}

//   return {
//     gender: genderCount,
//     ageGroups: ageGroupCount,
//   };
}


// Question 6 b
export function ShowInvoices() {
    
    const trn = document.getElementById("trnInput").value.trim();
    const list = document.getElementById("invoiceList");
    list.innerHTML = ""; // clear results

    if (!trn) return;
    const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];

    // Filter invoices by TRN
    const userInvoices = allInvoices.filter(inv => inv.user.trn == trn);

    if (userInvoices.length === 0) {
        list.innerHTML = "<li>No invoices found for this TRN.</li>";
        return;
    }

    // Display invoice numbers
    userInvoices.forEach(inv => {
        const li = document.createElement("li");

        li.innerHTML = `
            <a href="${invoice}?invoice=${inv.invoiceNum}">
                Invoice #${inv.invoiceNum}
            </a>
        `;

        list.appendChild(li);
    });
}


