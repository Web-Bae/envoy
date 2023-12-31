import moment from 'moment-timezone';

import { handleFeatureVisibility } from '$utils/handleFeatureVisibility';

import { shouldDisplayEvent } from './shouldDisplayEvent';

// handles the date time elements on the page
// if the event has already occurred, it hides the event
// otherwise, it does nothing
// handles converting PT to user's timezone
function handleDateTimeElements(dateTimeElements: NodeListOf<HTMLDivElement>) {
  dateTimeElements.forEach((dateTimeElement) => {
    if (!dateTimeElements) {
      console.error('Error getting date time element');
      return;
    }
    const dateTimeData = dateTimeElement.getAttribute('data-date-time-el');
    const eventTimeZone = 'America/Los_Angeles'; // For example, if your event times are in PST

    if (!dateTimeData) {
      console.error('Error getting date time data');
      return;
    }

    const eventTime = moment.tz(dateTimeData, 'MMMM DD, YYYY hh:mm A', eventTimeZone);

    if (!shouldDisplayEvent(eventTime, eventTimeZone)) {
      // Hide the event
      const grandParent = dateTimeElement.parentElement?.parentElement?.parentElement;
      if (grandParent) {
        grandParent.remove();
      }
    }
  });
}

// calls handleDateTimeElements() when the page is loaded
// only matters on the first page
document.addEventListener('DOMContentLoaded', () => {
  const dateTimeElements = document.querySelectorAll<HTMLDivElement>('[data-date-time-el]');
  handleDateTimeElements(dateTimeElements);
});

handleFeatureVisibility();

/*

Previous code no longer used due to bugs in browser back/forward button.

document.addEventListener('DOMContentLoaded', function() {
    function checkQueryParamAndToggleDiv() {

        let params = new URLSearchParams(window.location.search);
        let pageValue = params.get('0a0a5105_page');
        let divElem = document.querySelector('#feature-blog-component');

        if (pageValue && parseInt(pageValue) > 1) {
            divElem.style.display = 'none';
        } else {
            divElem.style.display = 'block';
        }
    }
    
    function updateBrowserHistory(url) {
        history.pushState({}, '', url);
    }

    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
        'cmsload',
        (listInstances) => {

          const [listInstance] = listInstances;

          listInstance.on('renderitems', (renderedItems) => {
            checkQueryParamAndToggleDiv();
            
            updateBrowserHistory(window.location.href);
            
            setTimeout(function() {
                window.scrollTo(0, 0);
            }, 50);
          });
        },
    ]);

    checkQueryParamAndToggleDiv();
    
    updateBrowserHistory(window.location.href);

    window.addEventListener('popstate', function(event) {

        checkQueryParamAndToggleDiv();

        setTimeout(function() {
           window.scrollTo(0, 0);
        }, 50);
    });
});

*/
