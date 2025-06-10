// remita api call code example
const url = 'https://remitademo.net/remita/exapp/api/v1/send/api/loansvc/data/api/v2/payday/salary/history/provideCustomerDetails';
const headers = {
  'Content-Type': 'application/json',
  'API_KEY': '1946',
  'MERCHANT_ID': '2547916',
  'REQUEST_ID': '{{requestId}}', // Replace with the actual requestId
  'AUTHORIZATION': '{{authorization}}', // Replace with the actual authorization token
};

const requestBody = {
  "authorisationCode": "{{authorisationCode}}", // Replace with the actual authorisationCode
  "firstName": "Teresa",
  "lastName": "Stoker",
  "middleName": "R",
  "accountNumber": "5012284010",
  "bankCode": "023",
  "bvn": "22222222223",
  "authorisationChannel": "USSD"
};

fetch(url, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(requestBody)
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  console.log(data); // Handle the response data here
})
.catch(error => {
  console.error('There was a problem with the fetch operation:', error);
});
