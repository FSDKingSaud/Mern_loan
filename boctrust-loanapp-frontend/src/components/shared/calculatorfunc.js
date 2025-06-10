// calculator functions
const interestRate = (amount, days, rate) => {
  const month = days / 30;
  const rateValue = rate / 100;
  const interest = amount * rateValue * month;

  return interest;
};

export default interestRate;




export function calculateSimpleInterest(
  principal,
  annualInterestRate,
  loanDurationMonths
) {
  let rate = annualInterestRate / 100;

  let loanDurationYears = loanDurationMonths / 12;

  let interest = principal * rate * loanDurationYears;

  let totalPayment = principal + interest;

  let monthlyPayment = totalPayment / loanDurationMonths;

  return {
    interest: interest.toFixed(2),
    totalPayment: totalPayment.toFixed(2),
    monthlyPayment: monthlyPayment.toFixed(2),
  };
}
