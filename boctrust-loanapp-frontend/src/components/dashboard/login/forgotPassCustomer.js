const forgotPassCustomer = async (username, email) => {
    const apiUrl = import.meta.env.VITE_BASE_URL;
    
    const forgotData = {
        username,
        email,
    };

    try {
        const response = await fetch(`${apiUrl}/api/customer/forgot-password`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(forgotData),
        });

        if (!response.ok) {
        throw new Error('Reset failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: 'Login failed' };
    }
}

export default forgotPassCustomer;