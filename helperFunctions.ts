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

export function calculateDeadline(
  startDate: Date,
  timeLimitHours: number
): Date {
  // Convert time limit to milliseconds
  const timeLimitMs = timeLimitHours * 60 * 60 * 1000;

  // Calculate deadline by adding time limit to start date
  const deadline = new Date(startDate.getTime() + timeLimitMs);

  return deadline;
}

// Example usage
// const startDate = new Date(); // Current date and time
// const timeLimitHours = 6; // 6 hours time limit

// const deadline = calculateDeadline(startDate, timeLimitHours);
// console.log(deadline); // Output the calculated deadline

export function calculateTimeSpent(startTime: Date, endDate?: Date): number {
  // Get the current time
  const endTime = endDate ? endDate : new Date();

  // Calculate the difference in milliseconds between the current time and the start time
  const timeDifferenceMs = endTime.getTime() - startTime.getTime();

  // Convert the time difference from milliseconds to hours
  const timeSpentHours = parseFloat(
    (timeDifferenceMs / (1000 * 60 * 60)).toFixed(1)
  );

  return timeSpentHours;
}

export function calculateRemainingTime(
  startTime: Date,
  timeLimitHours: number
): number {
  // Calculate the time spent
  const timeSpentHours = calculateTimeSpent(startTime);

  // Calculate the remaining time by subtracting time spent from the total time limit
  const remainingTime = timeLimitHours - timeSpentHours;

  return remainingTime;
}

export function checkIfOverdue(
  startDate: Date,
  timeLimitHours: number
): boolean {
  // Calculate the deadline
  const deadline = calculateDeadline(startDate, timeLimitHours);

  // Check if the current time is after the deadline
  const overdue = new Date() > deadline;

  return overdue;
}

export function isToday(date: Date): boolean {
  // Get the current date
  const currentDate = new Date();

  // Compare the year, month, and day of the given date and the current date
  return (
    date.getFullYear() === currentDate.getFullYear() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getDate() === currentDate.getDate()
  );
}

export function isYesterday(date: Date): boolean {
  // Get the current date
  const currentDate = new Date();

  // Get yesterday's date by subtracting one day from the current date
  const yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(currentDate.getDate() - 1);

  // Compare the year, month, and day of the given date and yesterday's date
  return (
    date.getFullYear() === yesterdayDate.getFullYear() &&
    date.getMonth() === yesterdayDate.getMonth() &&
    date.getDate() === yesterdayDate.getDate()
  );
}
