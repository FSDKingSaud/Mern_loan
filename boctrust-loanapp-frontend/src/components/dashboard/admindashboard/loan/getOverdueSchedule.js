export function getOverdueScheduleDates(schedule) {
  const today = new Date(); // Get the current date

  const overdueDates = schedule
    .filter(
      (item) =>
        new Date(item.PaymentDueDate) < today &&
        (!item.IsPrincipalApplied ||
          !item.IsInterestApplied ||
          !item.IsFeeApplied)
    )
    .map((item) => item.PaymentDueDate);

  return overdueDates;
}
export function getOverdueScheduleDatesAndId(schedule) {
  const today = new Date(); // Get the current date

  const overdueDates = schedule
    .filter(
      (item) =>
        new Date(item.PaymentDueDate) < today &&
        (!item.IsPrincipalApplied ||
          !item.IsInterestApplied ||
          !item.IsFeeApplied)
    )
    .map((item) => ({ date: item.PaymentDueDate, id: item.Id }));

  return overdueDates;
}

export function getOverdueAmount(schedule) {
  const today = new Date(); // Get the current date

  const overdueAmount = schedule
    .filter(
      (item) =>
        new Date(item.PaymentDueDate) < today &&
        (!item.IsPrincipalApplied ||
          !item.IsInterestApplied ||
          !item.IsFeeApplied)
    )
    .reduce(
      (total, item) => total + parseFloat(item.Total.replace(/,/g, "")),
      0
    );

  return overdueAmount;
}

export function getOverdueAmountForSelected(
  repaymentSchedule,
  selectedRepaymentId
) {
  const overdueAmount = repaymentSchedule
    .filter((item) => selectedRepaymentId.includes(item.Id))
    .reduce(
      (total, item) => total + parseFloat(item.Total.replace(/,/g, "")),
      0
    );

  return parseFloat(overdueAmount.toFixed(2));
}
