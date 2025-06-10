const sendSMS = async (phoneNumber, smsMessage) => {
  const username = import.meta.env.VITE_SMS_USERNAME;
  const password = import.meta.env.VITE_SMS_PASSWORD;
  const message = smsMessage;
  const sender = "BoctrustMFB";
  const mobiles = phoneNumber;

  // Construct the API URL
  const apiUrl = `https://portal.nigeriabulksms.com/api/?username=${username}&password=${password}&message=${message}&sender=${sender}&mobiles=${mobiles}`;

  // Make a GET request using the Fetch API
  await fetch(apiUrl)
    .then((response) => {
      // Check if the request was successful (status code 200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Parse the response JSON
      return response.json();
    })
    .then((data) => {
      // Handle the response data
      console.log(`SMS sent successfully! Status: ${data.status}`);
    })
    .catch((error) => {
 
      // Handle errors
      throw new Error(`Error: ${error}`);
    });
};

export default sendSMS;
