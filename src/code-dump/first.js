let marketoFormIndex = 0,
  marketoFormLoading = false;
function loadMarketoForm(form) {
  if (window.marketoFormLoading) {
    setTimeout(function () {
      loadMarketoForm(form);
    }, 200);
  } else {
    window.marketoFormLoading = true;
    let $form = $(form),
      formId = $form.data('marketo-form-id'),
      index = marketoFormIndex;
    $form.attr('id', 'mktoForm_' + formId);
    if ($form.hasClass('email-only') && typeof MktoForms2 === 'undefined') {
      $form.attr('action', 'https://signup.envoy.com');
      $form.attr('method', 'get');
      $form.append(
        '<div class="form-html-version"><div class="col xs-col-12 sm-col-12 md-col-7 md-pr2 mb2"><input name="email" type="email" placeholder="Enter your email" class="input"></div><div class="col xs-col-12 sm-col-12 md-col-5"><button class="btn btn-primary block">Get started</button></div></div>'
      );
      window.marketoFormLoading = false;
      return;
    }
    MktoForms2.setOptions({ formXDPath: '/rs/510-TEH-674/images/marketo-xdframe-relative.html' });
    MktoForms2.loadForm('//pages.envoy.com', '510-TEH-674', formId, function (form) {
      $form.find('.form-html-version').remove();
      $form.find('label[for]').each(function () {
        let $label = $(this),
          oldId = $label.attr('for'),
          newId = oldId + '_' + index;
        $form.find('#' + oldId).attr('id', newId);
        $label.attr('for', newId);
      });
      $form.attr('id', 'marketo-form-' + index);
      if ($form.data('button-text')) {
        $form.find('.mktoButton').text($form.data('button-text'));
      }
      let $emailInput = $form.find('input[name="Email"]');
      if ($emailInput.length > 0) {
        $emailInput.closest('.mktoFormRow').addClass('contains-email');
        let $tooltip = $(
          '<div class="input-tooltip"><div class="top"><p class="input-tooltip-content mb0">Please enter a valid email address.</p><i></i></div></div>'
        );
        $tooltip.insertBefore($emailInput);
      }
      let submitCallbackName = $form.data('submit-callback');
      if (typeof submitCallbackName !== 'undefined') {
        form.onSubmit(function (form) {
          analytics.track('Form Filled', { formID: formId, emailAddress: form.vals().Email });
          return window[submitCallbackName](form);
        });
      } else {
        form.onSubmit(function (form) {
          analytics.track('Form Filled', { formID: formId, emailAddress: form.vals().Email });
        });
      }
      let successCallbackName = $form.data('success-callback');
      if (typeof successCallbackName !== 'undefined') {
        form.onSuccess(function (values, followUpUrl) {
          return window[successCallbackName](values, followUpUrl, $form);
        });
      }
      let onloadCallbackName = $form.data('onload-callback');
      if (typeof onloadCallbackName !== 'undefined') {
        window[onloadCallbackName]($form);
      }
      if ($form.data('load-from-parameters')) {
        $form.find('input[name="Email"]').val(marketoGetQueryParameter('email'));
      }
      $form.removeAttr('data-marketo-form-id');
      window.marketoFormLoading = false;
    });
  }
}
function marketoSendToTrialPage(values, followUpUrl, $form) {
  let productsSelected = $form.data('products-selected') ? $form.data('products-selected') : false,
    email = values.Email;
  let url = 'https://signup.envoy.com/?';
  if (productsSelected) {
    url +=
      'products=' + encodeURIComponent(productsSelected) + '&email=' + encodeURIComponent(email);
  } else {
    url += 'email=' + encodeURIComponent(email);
  }
  location.href = url;
  return false;
}
function marketoDisplayThankYou(values, followUpUrl, $form) {
  let thankYouMessage = $form.data('thank-you-message');
  if (typeof thankYouMessage === 'undefined') {
    thankYouMessage = 'Thank you for your submission! Check your email for confirmation.';
  }
  $form.replaceWith("<p class='thank-you-message'>" + thankYouMessage + '</p>');
  $('html, body').animate({ scrollTop: $('.thank-you-message').offset().top - 150 }, 750);
  return false;
}
function marketoGetQueryParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;
  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
}
