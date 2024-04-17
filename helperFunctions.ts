export function formatDate(date: Date): string {
  // Get the day, month, and year from the date object
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero based, so we add 1
  const year = date.getFullYear();

  // Get the hours and minutes from the date object
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Convert hours to a number for comparison
  const numericHours = Number(hours);

  // Determine if it's AM or PM
  const meridiem = numericHours < 12 ? "AM" : "PM";

  // Convert hours from 24-hour to 12-hour format
  const hours12 = numericHours % 12 || 12;

  // Concatenate the day, month, and year with dashes
  // Also include the time in 12-hour format with AM/PM
  return `${month}/${day}/${year} ${hours12}:${minutes}${meridiem}`;
}
