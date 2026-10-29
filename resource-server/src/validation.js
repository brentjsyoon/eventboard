const isValidDate = (date) => {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  return Number.isFinite(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === date;
};

const isValidEvent = ({ title, date, location, description }) =>
  typeof title === "string" && title.trim().length > 0 && title.trim().length <= 120 &&
  isValidDate(date) &&
  typeof location === "string" && location.trim().length > 0 && location.trim().length <= 200 &&
  typeof description === "string" && description.trim().length > 0 && description.trim().length <= 5000;

const isValidBooking = ({ eventId, seats }) =>
  typeof eventId === "string" && /^[a-f\d]{24}$/i.test(eventId) &&
  (seats === undefined || (Number.isSafeInteger(seats) && seats > 0));

module.exports = { isValidDate, isValidEvent, isValidBooking };
