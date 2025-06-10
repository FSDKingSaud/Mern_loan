// generate first central ticket

const generateFirstCentralTicket = async () => {
    // Define the login request payload
    const loginPayload = {
    username: 'demo',
    password: 'demo@123'
    };

    const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginPayload)
    };

    const apiUrl = 'https://uat.firstcentralcreditbureau.com/firstcentralrestv2//login';

    await fetch(apiUrl, options)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Assuming the response contains a DataTicket field
        const dataTicket = data.DataTicket;
        console.log('DataTicket:', dataTicket);
    })
    .catch(err => {
        console.error('Error:', err);
    });
}

export default generateFirstCentralTicket;
