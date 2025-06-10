const resetAdminPass = async (newPassword, token) => {
    const apiUrl = import.meta.env.VITE_BASE_URL;
    
    const forgotData = {
        newPassword,
        token,
    };

    try {
        const response = await fetch(`${apiUrl}/api/admin/reset-password`, {
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
        console.error('Error Reset Field:', error.message);
        return { success: false, error: 'Reset failed' };
    }
}

export default resetAdminPass;