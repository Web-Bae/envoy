"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/global/index.ts
  console.log("start");
  var marketoFormIndex = 0;
  function loadMarketoForm(form) {
    if (window.marketoFormLoading) {
      setTimeout(function() {
        loadMarketoForm(form);
      }, 200);
    } else {
      window.marketoFormLoading = true;
      const $form = $(form), formId = $form.data("marketo-form-id"), index = marketoFormIndex;
      $form.attr("id", "mktoForm_" + formId);
      if ($form.hasClass("email-only") && typeof MktoForms2 === "undefined") {
        $form.attr("action", "https://signup.envoy.com");
        $form.attr("method", "get");
        $form.append(
          '<div class="form-html-version"><div class="col xs-col-12 sm-col-12 md-col-7 md-pr2 mb2"><input name="email" type="email" placeholder="Enter your email" class="input"></div><div class="col xs-col-12 sm-col-12 md-col-5"><button class="btn btn-primary block">Get started</button></div></div>'
        );
        window.marketoFormLoading = false;
        return;
      }
      MktoForms2.setOptions({ formXDPath: "/rs/510-TEH-674/images/marketo-xdframe-relative.html" });
      MktoForms2.loadForm("//pages.envoy.com", "510-TEH-674", formId, function(form2) {
        $form.find(".form-html-version").remove();
        $form.find("label[for]").each(function() {
          const $label = $(this), oldId = $label.attr("for"), newId = oldId + "_" + index;
          $form.find("#" + oldId).attr("id", newId);
          $label.attr("for", newId);
        });
        $form.attr("id", "marketo-form-" + index);
        if ($form.data("button-text")) {
          $form.find(".mktoButton").text($form.data("button-text"));
        }
        const $emailInput = $form.find('input[name="Email"]');
        if ($emailInput.length > 0) {
          $emailInput.closest(".mktoFormRow").addClass("contains-email");
          const $tooltip = $(
            '<div class="input-tooltip"><div class="top"><p class="input-tooltip-content mb0">Please enter a valid email address.</p><i></i></div></div>'
          );
          $tooltip.insertBefore($emailInput);
        }
        const submitCallbackName = $form.data("submit-callback");
        if (typeof submitCallbackName !== "undefined") {
          form2.onSubmit(function(form3) {
            analytics.track("Form Filled", { formID: formId, emailAddress: form3.vals().Email });
            return window[submitCallbackName](form3);
          });
        } else {
          form2.onSubmit(function(form3) {
            analytics.track("Form Filled", { formID: formId, emailAddress: form3.vals().Email });
          });
        }
        const successCallbackName = $form.data("success-callback");
        if (typeof successCallbackName !== "undefined") {
          form2.onSuccess(function(values, followUpUrl) {
            return window[successCallbackName](values, followUpUrl, $form);
          });
        }
        const onloadCallbackName = $form.data("onload-callback");
        if (typeof onloadCallbackName !== "undefined") {
          window[onloadCallbackName]($form);
        }
        if ($form.data("load-from-parameters")) {
          $form.find('input[name="Email"]').val(marketoGetQueryParameter("email"));
        }
        $form.removeAttr("data-marketo-form-id");
        window.marketoFormLoading = false;
      });
    }
  }
  function marketoGetQueryParameter(sParam) {
    let sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL.split("&"), sParameterName, i;
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split("=");
      if (sParameterName[0] === sParam) {
        return sParameterName[1] === void 0 ? true : sParameterName[1];
      }
    }
  }
  console.log("execute");
  document.addEventListener("DOMContentLoaded", function() {
    $(function() {
      $("form[data-marketo-form-id]").each(function() {
        loadMarketoForm($(this));
      });
    });
  });
})();
//# sourceMappingURL=index.js.map
