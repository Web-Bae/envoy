window.Webflow ||= [];
window.Webflow.push(() => {
  // Get references to the radio buttons and h2 elements
  const annualRadio = document.querySelector<HTMLInputElement>('#Annually');
  const monthlyRadio = document.querySelector<HTMLInputElement>('#Monthly');
  const standardVisitorPrice = document.querySelector<HTMLInputElement>('#standardVisitorPrice');
  const premiumVisitorPrice = document.querySelector<HTMLInputElement>('#premiumVisitorPrice');

  if (!annualRadio || !monthlyRadio || !standardVisitorPrice || !premiumVisitorPrice) {
    console.error('Could not find radio buttons or price elements');
    console.error({ annualRadio, monthlyRadio, standardVisitorPrice, premiumVisitorPrice });
    return;
  }

  // Get the div sibling to the annualRadio input
  const annualRadioDiv = annualRadio.previousElementSibling;

  if (!annualRadioDiv) {
    console.error('Could not find annual radio div');
    console.error({ annualRadioDiv });
    return;
  }

  // Function to update the prices based on the selected radio button
  function updatePrices() {
    if (annualRadio?.checked) {
      standardVisitorPrice!.textContent = '109';
      premiumVisitorPrice!.textContent = '329';
    } else if (monthlyRadio?.checked) {
      standardVisitorPrice!.textContent = '131';
      premiumVisitorPrice!.textContent = '395';
    }
  }

  // Add event listeners to the radio buttons
  annualRadio.addEventListener('change', updatePrices);
  monthlyRadio.addEventListener('change', updatePrices);

  // Add the .w--redirected-checked class to the annualRadioDiv on page load
  annualRadioDiv.classList.add('w--redirected-checked');

  // Initial update (in case the page loads with one of the options already selected)
  updatePrices();

  // -----

  // Define a structure for prices based on different criteria
  const prices = {
    Annually: {
      Workplace: {
        Standard: 3,
        Premium: 5,
        'Premium Plus': 7,
      },
      Visitors: {
        Standard: 109,
        Premium: 329,
      },
      'Equip-iPad': 449,
      'Equip-Badge-Printer': 249,
      'Equip-WindFall-iPad-Stand': 149,
    },
    Monthly: {
      Workplace: {
        Standard: 3,
        Premium: 5,
        'Premium Plus': 7,
      },
      Visitors: {
        Standard: 131,
        Premium: 395,
      },
      'Equip-iPad': 449,
      'Equip-Badge-Printer': 249,
      'Equip-WindFall-iPad-Stand': 149,
    },
  };

  // Function to validate a number, ensuring it's not empty or negative
  function validateNumber(inputValue: string | number): number {
    if (typeof inputValue === 'number') {
      return inputValue;
    }
    const number = Number(inputValue);
    return number > 0 ? number : 0;
  }

  // Function to calculate total prices based on selected options and quantities
  const calculateTotals = (): void => {
    // Determine the billing period and select the corresponding price list
    const workplacePlanEl = document.querySelector<HTMLInputElement>(
      'input[name="Workplace-Plan"]:checked'
    );
    const numEmployeesEl = document.querySelector<HTMLInputElement>('input[name="Employees"]');
    if (!workplacePlanEl || !numEmployeesEl) {
      console.error(
        'Could not find billing period, workplace plan, or number of employees elements'
      );
      console.error({ workplacePlanEl, numEmployeesEl });
      return;
    }

    const billingPeriod = annualRadio.checked ? 'Annually' : 'Monthly';
    const pricesToUse = prices[billingPeriod];
    const workplacePlan = workplacePlanEl.value as 'Standard' | 'Premium' | 'Premium Plus';
    const numEmployees = validateNumber(numEmployeesEl.value);
    const workplacePrice = pricesToUse['Workplace'][workplacePlan] * numEmployees;

    let lineItemsText: string = '',
      monthlyPrice: number = 0,
      oneTimePrice: number = 0;

    if (numEmployees > 0) {
      lineItemsText += `Workplace - ${numEmployees} employees, ${workplacePlan.toLowerCase()} plan - $${workplacePrice}/month | `;
      monthlyPrice += workplacePrice;
    }

    // Calculate visitors plan price
    const visitorsPlanEl = document.querySelector<HTMLInputElement>(
      'input[name="Visitor-Plan"]:checked'
    );
    const numLocationsEl = document.querySelector<HTMLInputElement>('input[name="Locations"]');
    if (!visitorsPlanEl || !numLocationsEl) {
      console.error('Could not find visitors plan or number of locations elements');
      console.error({ visitorsPlanEl, numLocationsEl });
      return;
    }

    const visitorsPlan = visitorsPlanEl.value as 'Standard' | 'Premium';
    const numLocations = validateNumber(numLocationsEl.value);

    const visitorsPrice = pricesToUse['Visitors'][visitorsPlan] * numLocations;

    if (numLocations > 0) {
      lineItemsText += `Visitors - ${numLocations} locations, ${visitorsPlan.toLowerCase()} plan, billed ${billingPeriod.toLowerCase()} - $${visitorsPrice}/month | `;
      monthlyPrice += visitorsPrice;
    }

    // Calculate equipment prices
    const equipmentItemEls = document.querySelectorAll<HTMLDivElement>(
      '.quote-calc_equipment-item'
    );

    equipmentItemEls.forEach(function (equipmentItemEl) {
      const valueEl = equipmentItemEl.querySelector<HTMLInputElement>('input');
      if (!valueEl) {
        console.error('Could not find equipment item input element');
        console.error({ equipmentItemEl, valueEl });
        return;
      }
      const number = validateNumber(valueEl.value);
      if (number > 0) {
        const productName = valueEl.getAttribute('name') as
          | 'Equip-iPad'
          | 'Equip-Badge-Printer'
          | 'Equip-WindFall-iPad-Stand';
        if (!productName) {
          console.error('Could not find equipment item name element');
          return;
        }
        const price = pricesToUse[productName] * number;

        lineItemsText += `${productName.replace('Equip ', '')} - ${number} - $${price} | `;
        oneTimePrice += price;
      }
    });

    lineItemsText = lineItemsText.slice(0, -3);

    const priceText: string = `$${monthlyPrice}/month, billed ${billingPeriod.toLowerCase()}`;

    if (oneTimePrice > 0) {
      lineItemsText = `$${oneTimePrice} one-time + ` + priceText;
    }

    // Update form fields with the calculated price information
    const marketoEmailQuoteText1El = document.querySelector<HTMLInputElement>(
      '.marketo-form input[name="emailQuoteText1"]'
    );
    const marketoEmailQuoteText2El = document.querySelector<HTMLInputElement>(
      '.marketo-form input[name="emailQuoteText2"]'
    );
    if (!marketoEmailQuoteText1El || !marketoEmailQuoteText2El) {
      console.error('Could not find marketo email quote text elements');
      console.error({ marketoEmailQuoteText1El, marketoEmailQuoteText2El });
      return;
    }

    // Set the values of the hidden form fields
    marketoEmailQuoteText1El.value = lineItemsText;
    marketoEmailQuoteText2El.value = priceText;
  };

  // Calculate Totals anytime a radio is clicked
  const radioEls = document.querySelectorAll<HTMLInputElement>(
    'input[type="radio"], input[type="number"]'
  );
  radioEls.forEach(function (radioEl) {
    radioEl.addEventListener('click', calculateTotals);
  });
});
