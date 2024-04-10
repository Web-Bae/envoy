"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/quote/index.ts
  window.Webflow ||= [];
  window.Webflow.push(() => {
    const annualRadio = document.querySelector("#Annually");
    const monthlyRadio = document.querySelector("#Monthly");
    const standardVisitorPrice = document.querySelector("#standardVisitorPrice");
    const premiumVisitorPrice = document.querySelector("#premiumVisitorPrice");
    if (!annualRadio || !monthlyRadio || !standardVisitorPrice || !premiumVisitorPrice) {
      console.error("Could not find radio buttons or price elements");
      console.error({ annualRadio, monthlyRadio, standardVisitorPrice, premiumVisitorPrice });
      return;
    }
    const annualRadioDiv = annualRadio.previousElementSibling;
    if (!annualRadioDiv) {
      console.error("Could not find annual radio div");
      console.error({ annualRadioDiv });
      return;
    }
    function updatePrices() {
      if (annualRadio?.checked) {
        standardVisitorPrice.textContent = "109";
        premiumVisitorPrice.textContent = "329";
      } else if (monthlyRadio?.checked) {
        standardVisitorPrice.textContent = "131";
        premiumVisitorPrice.textContent = "395";
      }
    }
    annualRadio.addEventListener("change", updatePrices);
    monthlyRadio.addEventListener("change", updatePrices);
    annualRadioDiv.classList.add("w--redirected-checked");
    updatePrices();
    const prices = {
      Annually: {
        Workplace: {
          Standard: 3,
          Premium: 5,
          "Premium Plus": 7
        },
        Visitors: {
          Standard: 109,
          Premium: 329
        },
        "Equip-iPad": 449,
        "Equip-Badge-Printer": 249,
        "Equip-WindFall-iPad-Stand": 149
      },
      Monthly: {
        Workplace: {
          Standard: 3,
          Premium: 5,
          "Premium Plus": 7
        },
        Visitors: {
          Standard: 131,
          Premium: 395
        },
        "Equip-iPad": 449,
        "Equip-Badge-Printer": 249,
        "Equip-WindFall-iPad-Stand": 149
      }
    };
    function validateNumber(inputValue) {
      if (typeof inputValue === "number") {
        return inputValue;
      }
      const number = Number(inputValue);
      return number > 0 ? number : 0;
    }
    const calculateTotals = () => {
      const workplacePlanEl = document.querySelector(
        'input[name="Workplace-Plan"]:checked'
      );
      const numEmployeesEl = document.querySelector('input[name="Employees"]');
      if (!workplacePlanEl || !numEmployeesEl) {
        console.error(
          "Could not find billing period, workplace plan, or number of employees elements"
        );
        console.error({ workplacePlanEl, numEmployeesEl });
        return;
      }
      const billingPeriod = annualRadio.checked ? "Annually" : "Monthly";
      const pricesToUse = prices[billingPeriod];
      const workplacePlan = workplacePlanEl.value;
      const numEmployees = validateNumber(numEmployeesEl.value);
      const workplacePrice = pricesToUse["Workplace"][workplacePlan] * numEmployees;
      let lineItemsText = "", monthlyPrice = 0, oneTimePrice = 0;
      if (numEmployees > 0) {
        lineItemsText += `Workplace - ${numEmployees} employees, ${workplacePlan.toLowerCase()} plan - $${workplacePrice}/month | `;
        monthlyPrice += workplacePrice;
      }
      const visitorsPlanEl = document.querySelector(
        'input[name="Visitor-Plan"]:checked'
      );
      const numLocationsEl = document.querySelector('input[name="Locations"]');
      if (!visitorsPlanEl || !numLocationsEl) {
        console.error("Could not find visitors plan or number of locations elements");
        console.error({ visitorsPlanEl, numLocationsEl });
        return;
      }
      const visitorsPlan = visitorsPlanEl.value;
      const numLocations = validateNumber(numLocationsEl.value);
      const visitorsPrice = pricesToUse["Visitors"][visitorsPlan] * numLocations;
      if (numLocations > 0) {
        lineItemsText += `Visitors - ${numLocations} locations, ${visitorsPlan.toLowerCase()} plan, billed ${billingPeriod.toLowerCase()} - $${visitorsPrice}/month | `;
        monthlyPrice += visitorsPrice;
      }
      const equipmentItemEls = document.querySelectorAll(
        ".quote-calc_equipment-item"
      );
      equipmentItemEls.forEach(function(equipmentItemEl) {
        const valueEl = equipmentItemEl.querySelector("input");
        if (!valueEl) {
          console.error("Could not find equipment item input element");
          console.error({ equipmentItemEl, valueEl });
          return;
        }
        const number = validateNumber(valueEl.value);
        if (number > 0) {
          const productName = valueEl.getAttribute("name");
          if (!productName) {
            console.error("Could not find equipment item name element");
            return;
          }
          const price = pricesToUse[productName] * number;
          lineItemsText += `${productName.replace("Equip ", "")} - ${number} - $${price} | `;
          oneTimePrice += price;
        }
      });
      lineItemsText = lineItemsText.slice(0, -3);
      const priceText = `$${monthlyPrice}/month, billed ${billingPeriod.toLowerCase()}`;
      if (oneTimePrice > 0) {
        lineItemsText = `$${oneTimePrice} one-time + ` + priceText;
      }
      const marketoEmailQuoteText1El = document.querySelector(
        '.marketo-form input[name="emailQuoteText1"]'
      );
      const marketoEmailQuoteText2El = document.querySelector(
        '.marketo-form input[name="emailQuoteText2"]'
      );
      if (!marketoEmailQuoteText1El || !marketoEmailQuoteText2El) {
        console.error("Could not find marketo email quote text elements");
        console.error({ marketoEmailQuoteText1El, marketoEmailQuoteText2El });
        return;
      }
      marketoEmailQuoteText1El.value = lineItemsText;
      marketoEmailQuoteText2El.value = priceText;
    };
    const radioEls = document.querySelectorAll(
      'input[type="radio"], input[type="number"]'
    );
    radioEls.forEach(function(radioEl) {
      radioEl.addEventListener("click", calculateTotals);
    });
  });
})();
//# sourceMappingURL=index.js.map
