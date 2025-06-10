const stopLoanFunc = async (loanId) => { 
    const apiUrl = import.meta.env.VITE_BASE_URL;
    
    const stopLoanStatus = 'stopped';

    await fetch(`${apiUrl}/api/updatecustomer/remita/${loanId}/stoploan`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ stopLoanStatus }),
    })
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error updating loan status:', error.message);
    });
};

export default stopLoanFunc;