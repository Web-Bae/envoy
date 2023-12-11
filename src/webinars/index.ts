import moment from 'moment-timezone';

import { shouldDisplayEvent } from './shouldDisplayEvent';

document.addEventListener('DOMContentLoaded', function () {
  const dateTimeElements = document.querySelectorAll<HTMLDivElement>('[data-date-time-el]');

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
      // Code to hide the event
      const grandParent = dateTimeElement.parentElement?.parentElement?.parentElement;
      if (grandParent) {
        grandParent.remove();
      }
    }
  });
});
