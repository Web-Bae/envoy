// This is the original code on quote page.

document.addEventListener('DOMContentLoaded', function () {
  // Get references to the radio buttons and h2 elements
  const annualRadio = document.getElementById('Annually');
  const monthlyRadio = document.getElementById('Monthly');
  const standardVisitorPrice = document.getElementById('standardVisitorPrice');
  const premiumVisitorPrice = document.getElementById('premiumVisitorPrice');

  // Get the div sibling to the annualRadio input
  const annualRadioDiv = annualRadio.previousElementSibling;

  // Function to update the prices based on the selected radio button
  function updatePrices() {
    if (annualRadio.checked) {
      standardVisitorPrice.textContent = '109';
      premiumVisitorPrice.textContent = '329';
    } else if (monthlyRadio.checked) {
      standardVisitorPrice.textContent = '131';
      premiumVisitorPrice.textContent = '395';
    }
  }

  // Add event listeners to the radio buttons
  annualRadio.addEventListener('change', updatePrices);
  monthlyRadio.addEventListener('change', updatePrices);

  // Add the .w--redirected-checked class to the annualRadioDiv on page load
  annualRadioDiv.classList.add('w--redirected-checked');

  // Initial update (in case the page loads with one of the options already selected)
  updatePrices();
});

if ($('input[name="Visitor-Plan"]:checked').length == 0) {
  $('input[name="Visitor-Plan"][value="Standard"]').prop('checked', true);
  $('input[name="Visitor-Plan"][value="Standard"]')
    .siblings('.w-form-formradioinput')
    .addClass('w--redirected-checked');
}

if ($('input[name="Worplace-Plan"]:checked').length == 0) {
  $('input[name="Worplace-Plan"][value="Standard"]').prop('checked', true);
  $('input[name="Worplace-Plan"][value="Standard"]')
    .siblings('.w-form-formradioinput')
    .addClass('w--redirected-checked');
}

if ($('input[name="Billing-Cycle]:checked').length == 0) {
  $('input[name="Billing-Cycle"][value="Annually"]').prop('checked', true);
}

var prices = {
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
    'Equip iPad': 449,
    'Equip Badge Printer': 249,
    'Equip WindFall iPad Stand': 149,
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
    'Equip iPad': 449,
    'Equip Badge Printer': 249,
    'Equip WindFall iPad Stand': 149,
  },
};

var validateNumber = function (number) {
  if (number == '' || number < 0) {
    number = 0;
  }

  return number;
};

var calculateTotals = function () {
  // grab annual vs monthly to determine price array we use
  var billingPeriod = $('input[name="Billing-Cycle"]:checked').val(),
    pricesToUse = prices[billingPeriod],
    lineItemsText = '',
    monthlyPrice = 0,
    oneTimePrice = 0;

  // sum visitors price
  var workplacePlan = $('input[name="Worplace-Plan"]:checked').val(),
    numEmployees = validateNumber($('input[name="Employees"]').val()),
    workplacePrice = pricesToUse['Workplace'][workplacePlan] * numEmployees;

  if (numEmployees > 0) {
    lineItemsText += `Workplace - ${numEmployees} employees, ${workplacePlan.toLowerCase()} plan - $${workplacePrice}/month | `;
    monthlyPrice += workplacePrice;
  }

  // sum visitors price
  var visitorsPlan = $('input[name="Visitor-Plan"]:checked').val(),
    numLocations = validateNumber($('input[name="Locations"]').val()),
    visitorsPrice = pricesToUse['Visitors'][visitorsPlan] * numLocations;

  if (numLocations > 0) {
    lineItemsText += `Visitors - ${numLocations} locations, ${visitorsPlan.toLowerCase()} plan, billed ${billingPeriod.toLowerCase()} - $${visitorsPrice}/month | `;
    monthlyPrice += visitorsPrice;
  }

  // sum equipment price
  var equipmentPrices = [];
  $('.quote-calc_equipment-item').each(function () {
    var number = validateNumber($(this).find(':input').val());
    if (number > 0) {
      var productName = $(this).find(':input').data('name'),
        price = pricesToUse[productName] * number;

      equipmentPrices.push({ name: productName, number: number, price: price });
      lineItemsText += `${productName.replace('Equip ', '')} - ${number} - $${price} | `;
      oneTimePrice += price;
    }
  });

  lineItemsText = lineItemsText.slice(0, -3);

  var priceText = `$${monthlyPrice}/month, billed ${billingPeriod.toLowerCase()}`;

  if (oneTimePrice > 0) {
    priceText = `$${oneTimePrice} one-time + ` + priceText;
  }

  $('.marketo-form input[name="emailQuoteText1"]').val(lineItemsText);
  $('.marketo-form input[name="emailQuoteText2"]').val(priceText);
};
