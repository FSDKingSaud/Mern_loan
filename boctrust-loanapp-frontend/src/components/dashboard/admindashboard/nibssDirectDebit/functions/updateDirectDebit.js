 const apiUrl = import.meta.env.VITE_BASE_URL;

const updateDirectDebit = async (customerId, status, isDebitProcessed, mandateObj, setLoading) => {
  setLoading(true);

  try {
    const response = await fetch(
      `${apiUrl}/api/direct-debit/update-direct-debit-status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customerId,
          directDebitStatus: status,
          isDebitProcessed: isDebitProcessed,
          mandateObj: mandateObj,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json(); // Parse JSON response
      setLoading(false);
    } else {
      const errorData = await response.json(); // Parse error response
      console.error("Failed to decline direct debit request:", errorData);
      setLoading(false);
    }
  } catch (error) {
    console.error("Error declining direct debit request:", error.message);
    setLoading(false);
  };
}

export default updateDirectDebit;