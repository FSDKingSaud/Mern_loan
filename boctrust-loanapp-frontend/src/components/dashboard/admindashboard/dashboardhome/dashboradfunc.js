import { format } from "date-fns";

// get the current date and format it to the format "Month Day, Year"
const getCurrentDateFormatted = () => {
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentDate = new Date();
  const month = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  return `${month} ${day}, ${year}`;
};

// get the date of yesterday and format it to the format "Month Day, Year"
const getYesterdayDate = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const date = format(yesterday, "MMM. d, yyyy");

  return date;
};

// get current month and year
const getCurrentMonthAndYear = () => {
  const currentDate = new Date();
  const monthIndex = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = months[monthIndex];

  return `${currentMonth}, ${year}`;
};

// get last month
const getLastMonthAndYear = () => {
  const currentDate = new Date();
  let month = currentDate.getMonth();
  let year = currentDate.getFullYear();

  // Subtract one month from the current month
  if (month === 0) {
    // January
    month = 11; // December
    year -= 1; // Decrease year by 1
  } else {
    month -= 1;
  }

  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const lastMonth = months[month];

  return `${lastMonth}, ${year}`;
};

// get current year
const getCurrentYear = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  return year;
};

function getCurrentMonthDates() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const startDay = "01";

  // Get the last day of the current month
  const endDateObj = new Date(year, now.getMonth() + 1, 0);
  const endDay = String(endDateObj.getDate()).padStart(2, "0");

  const startDate = `${startDay}-${month}-${year}`;
  const endDate = `${endDay}-${month}-${year}`;

  return { startDate, endDate };
}

export {
  getCurrentDateFormatted,
  getYesterdayDate,
  getCurrentMonthAndYear,
  getLastMonthAndYear,
  getCurrentYear,
  getCurrentMonthDates,
};
