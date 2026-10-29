const test = require("node:test");
const assert = require("node:assert/strict");
const { isValidBooking, isValidEvent } = require("../src/validation");

test("event validation accepts complete event data and rejects missing fields", () => {
  const validEvent = {
    title: "Community meetup",
    date: "2027-01-20",
    location: "Toronto",
    description: "A community event",
  };
  assert.equal(isValidEvent(validEvent), true);
  assert.equal(isValidEvent({ ...validEvent, description: " " }), false);
  assert.equal(isValidEvent({ ...validEvent, date: "not-a-date" }), false);
  assert.equal(isValidEvent({ ...validEvent, date: "2027-02-30" }), false);
});

test("booking validation requires a Mongo ID and positive whole seats", () => {
  const eventId = "507f1f77bcf86cd799439011";
  assert.equal(isValidBooking({ eventId }), true);
  assert.equal(isValidBooking({ eventId, seats: 2 }), true);
  assert.equal(isValidBooking({ eventId: "invalid", seats: 1 }), false);
  assert.equal(isValidBooking({ eventId, seats: 0 }), false);
  assert.equal(isValidBooking({ eventId, seats: 1.5 }), false);
});
