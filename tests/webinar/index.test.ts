import test, { expect } from '@playwright/test';
import moment from 'moment-timezone';
import { shouldDisplayEvent } from 'src/webinars/shouldDisplayEvent';

test('event 1.5 hours ago should NOT be displayed', () => {
  const eventTimeZone = 'America/Los_Angeles';
  const currentTimePlusNinetyMin = moment().subtract(90, 'minutes').tz(eventTimeZone);
  expect(shouldDisplayEvent(currentTimePlusNinetyMin, eventTimeZone)).toBe(false);
});

test('event 30 minutes ago should be displayed', () => {
  const eventTimeZone = 'America/Los_Angeles';
  const currentTimePlusThirtyMin = moment().subtract(30, 'minutes').tz(eventTimeZone);
  expect(shouldDisplayEvent(currentTimePlusThirtyMin, eventTimeZone)).toBe(true);
});

test('event eight days in the future should be displayed', () => {
  const eventTimeZone = 'America/Los_Angeles';
  const currentTimePlusEightDays = moment().add(8, 'days').tz(eventTimeZone);
  expect(shouldDisplayEvent(currentTimePlusEightDays, eventTimeZone)).toBe(true);
});
