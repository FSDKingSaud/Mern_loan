const getNextMonthDate = (inputDate) => {
  // Parse the input date string (assuming it's in the format dd-mm-yyyy)
  const [day, month, year] = inputDate.split('-');
  const parsedDate = new Date(`${year}-${month}-${day}`);

  // Calculate the next month
  parsedDate.setMonth(parsedDate.getMonth() + 1);

  // Get the components of the next month's date
  const nextMonthDay = parsedDate.getDate();
  const nextMonth = parsedDate.getMonth() + 1; // Months are zero-based, so add 1
  const nextMonthYear = parsedDate.getFullYear();

  // Format the result as dd-mm-yyyy
  const formattedNextMonthDate = `${nextMonthYear}-${nextMonth}-${nextMonthDay}`;

  return formattedNextMonthDate;
}

export default getNextMonthDate;