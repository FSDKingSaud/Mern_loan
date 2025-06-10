export const calcDaysDiffFromNow = (refDate) => {
  let Difference_In_Time = new Date().getTime() - new Date(refDate).getTime();

  // Calculating the no. of days between
  // two dates
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

  return Difference_In_Days;
};
