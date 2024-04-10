function getCookie(name) {
  var value = '; ' + document.cookie;
  var parts = value.split('; ' + name + '=');
  if (parts.length == 2) return parts.pop().split(';').shift();
}

!(function () {
  var analytics = (window.analytics = window.analytics || []);
  if (!analytics.initialize)
    if (analytics.invoked)
      window.console && console.error && console.error('Segment snippet included twice.');
    else {
      analytics.invoked = !0;
      analytics.methods = [
        'trackSubmit',
        'trackClick',
        'trackLink',
        'trackForm',
        'pageview',
        'identify',
        'reset',
        'group',
        'track',
        'ready',
        'alias',
        'debug',
        'page',
        'once',
        'off',
        'on',
      ];
      analytics.factory = function (t) {
        return function () {
          var e = Array.prototype.slice.call(arguments);
          e.unshift(t);
          analytics.push(e);
          return analytics;
        };
      };
      for (var t = 0; t < analytics.methods.length; t++) {
        var e = analytics.methods[t];
        analytics[e] = analytics.factory(e);
      }
      analytics.load = function (t, e) {
        var n = document.createElement('script');
        n.type = 'text/javascript';
        n.async = !0;
        n.src = 'https://sgmnt.envoy.com/analytics.js/v1/' + t + '/analytics.min.js';
        var a = document.getElementsByTagName('script')[0];
        a.parentNode.insertBefore(n, a);
        analytics._loadOptions = e;
      };
      analytics.SNIPPET_VERSION = '4.1.0';

      analytics.load('jmhzjAC1O7mvTJ4taVydJa9YKstvuNME', {
        integrations: {
          FullStory: false,

          'Facebook Pixel': false,

          'LinkedIn Insight Tag': false,
        },
      });

      var page_path = 'pages/index.html';
      // Turn /pages/security.html => security
      var page_name = page_path
        .replace(/^pages\//, '')
        .replace(/\.html$/, '')
        .replace(/\.md$/, '');
      analytics.page('[envoy.com] ' + page_name, (properties = { project: 'envoy.com' }));
    }
})();

// This is an extension of the typical way to call Segment to support Intercom
// identity verification  on a hash string dashboard.envoy.com places in
// an envoy.com cookie during basedlogin. If the cookie isn't there, we manually
// shutdown and reboot an anonymous messenger.
analytics.ready(function () {
  var intercomIdentityHash = getCookie('intercomIdentityHash');

  if (intercomIdentityHash) {
    analytics.identify(
      null,
      {},
      { integrations: { Intercom: { user_hash: intercomIdentityHash } } }
    );
  } else if (typeof Intercom !== 'undefined') {
    Intercom('shutdown');
    Intercom('boot', { app_id: 'shgh0wrr' });
  }
  Intercom('onShow', function () {
    var utmValues = getUtmValuesFromCookies();

    if (utmValues) {
      var translatedUtmValues = {};

      for (var field in utmValues) {
        translatedUtmValues['mkt_' + field] = utmValues[field];
      }

      Intercom('update', translatedUtmValues);
    }
  });
});

window.metrics = {
  trackEvent: function (event, properties, options) {
    if (properties) {
      properties.project = 'envoy.com';
    } else {
      properties = { project: 'envoy.com' };
    }
    analytics.track('[envoy.com] ' + event, properties, options);
  },
};
(function ($, window, document, undefined) {
  'use strict';

  // helper method to show 'Looks like you already have an account!' message,
  // and hide/show appropriate elements when user enter preexisting e-mail
  // It'll start checking whether the e-mail entered by the user is being used
  // after user stop typing for 1000 ms
  var UserEmailChecker = function (options) {
    this.$emailInput = options.$emailInput;
    this.timeout = null;
    this.userLookupUrl = options.userLookupUrl;
    this.errorCallback = options.errorCallback;
    this.$newUserEls = options.$newUserEls;
    this.$existingUserEls = options.$existingUserEls;
    this.$goToDashboardLink = options.$goToDashboardLink;
  };

  UserEmailChecker.prototype = {
    init: function () {
      var self = this;
      var lookUpEmail = function (e) {
        e.preventDefault();

        if (this.timeout) {
          clearTimeout(this.timeout);
        }

        //get e-mail
        var email = $(e.target).val();
        self.signInUrl = 'https://dashboard.envoy.christmas?em=' + email;

        if (!email) {
          self.$newUserEls.removeClass('hide');
          self.$existingUserEls.addClass('hide');
          return;
        }

        this.timeout = setTimeout(function () {
          $.ajax({
            url: self.userLookupUrl + '?email=' + email,
            accept: 'application/json',
            contentType: 'application/json',
            success: function (xhr) {
              // if it's passport only user, allow them to sign up
              if (xhr.data.attributes['passport-only']) return;
              // if we can find user, then hide all new user elements
              self.$newUserEls.addClass('hide');
              self.$existingUserEls.removeClass('hide');
              // update go to dashboard link
              self.$goToDashboardLink.attr('href', self.signInUrl);
            },
            error: function (xhr) {
              if (xhr.status === 404) {
                // if we cannot find user, then show all new user elements
                self.$newUserEls.removeClass('hide');
                self.$existingUserEls.addClass('hide');
              } else {
                self.errorCallback();
              }
            },
          });
        }, 500);
      };

      this.$emailInput.keyup(lookUpEmail);
      this.$emailInput.blur(lookUpEmail);
    },
  };
  window.UserEmailChecker = UserEmailChecker;
})(jQuery, window, window.document);
