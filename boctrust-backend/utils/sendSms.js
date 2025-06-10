const sendSMS = async (phoneNumber, smsMessage) => {
  let phone = phoneNumber.replace(/^\+/, "");

  if (phone.startsWith("234")) {
    phone = phone;
  } else if (phone.startsWith("0")) {
    phone = "234" + phone.slice(1);
  } else {
    phone = "234" + phone;
  }

  const username = process.env.SMS_USERNAME;
  const password = process.env.SMS_PASSWORD;

  const sender = "BoctrustMFB";

  // Construct the API URL
  const apiUrl = `https://portal.nigeriabulksms.com/api/?username=${username}&password=${password}&message=${smsMessage}&sender=${sender}&mobiles=${phone}`;

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

module.exports = sendSMS;
