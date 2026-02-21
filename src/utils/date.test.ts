import { expect, test } from "bun:test";
import { formatDate } from "./date";

test("formatDate formats valid date string correctly", () => {
  // Use a local time string to avoid UTC conversion issues in tests
  const date = "2023-10-24T12:00:00";
  expect(formatDate(date)).toBe("Oct 24, 2023");
});

test("formatDate formats Date object correctly", () => {
  // Create a date object representing local time
  const date = new Date(2023, 9, 24); // Month is 0-indexed (9 = October)
  expect(formatDate(date)).toBe("Oct 24, 2023");
});

test("formatDate handles different months correctly", () => {
  const date = "2023-01-01T12:00:00";
  expect(formatDate(date)).toBe("Jan 1, 2023");
});

test("formatDate handles invalid date string gracefully", () => {
  const date = "invalid-date";
  expect(formatDate(date)).toBe("Invalid Date");
});
