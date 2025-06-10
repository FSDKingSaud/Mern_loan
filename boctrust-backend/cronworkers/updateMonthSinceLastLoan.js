const Customer = require("../models/Customer");
const Loan = require("../models/Loan");

// Function to update monthsSinceLastLoan for all customers
const updateMonthsSinceLastLoan = async () => {
    try {
        // Fetch all customers
        const customers = await Customer.find();

        // Iterate over customers to calculate months since last loan
        for (const customer of customers) {
            // Find the latest loan for the customer
            const lastLoan = await Loan.findOne({
                customerId: customer._id,
                loanstatus: "completed", // Only consider completed loans
            })
                .sort({ updatedAt: -1 }) // Sort by most recent loan
                .exec();

            if (lastLoan) {
                const lastLoanDate = new Date(lastLoan.updatedAt); // Use the loan's `updatedAt` field
                const now = new Date();

                // Calculate the difference in months
                const monthsSinceLastLoan =
                    (now.getFullYear() - lastLoanDate.getFullYear()) * 12 +
                    now.getMonth() -
                    lastLoanDate.getMonth();

                // Update the customer's topUpLoanEligibility
                await Customer.findByIdAndUpdate(customer._id, {
                    $set: {
                        "topUpLoanEligibility.monthsSinceLastLoan":
                            monthsSinceLastLoan,
                    },
                });
            }
        }

        console.log("Updated monthsSinceLastLoan for all customers.");
    } catch (error) {
        console.error("Error updating monthsSinceLastLoan:", error.message);
    }
};

module.exports = updateMonthsSinceLastLoan;
