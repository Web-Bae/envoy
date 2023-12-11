import moment from 'moment-timezone';

export function shouldDisplayEvent(eventTime: moment.Moment, eventTimeZone: string) {
  const currentTime = moment().tz(eventTimeZone);
  const diffHours = currentTime.diff(eventTime, 'hours', true);

  // Event is in the past and occurred more than 1 hour ago
  return diffHours <= 1;
}
