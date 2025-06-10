// require('dotenv').config();
// // Your NIBSS credentials
// const CLIENT_ID = process.env.NIBSS_DD_CLIENT_ID;
// const CLIENT_SECRET = process.env.NIBSS_DD_CLIENT_SECRET;
// const BASE_URL = process.env.NIBSS_BASE_URL;
// console.log(BASE_URL);
// // Utility function to fetch the access token
// const fetchAccessToken = async () => {
//   const response = await fetch(`${BASE_URL}/reset`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     body: new URLSearchParams({
//       client_id: CLIENT_ID,
//       scope: `${CLIENT_ID}/.default`,
//       client_secret: CLIENT_SECRET,
//       grant_type: 'client_credentials'
//     })
//   });

//   if (!response.ok) {
//     console.log(response)
//     throw new Error(`Error: ${response.status}`);
//   }

//   const data = await response.json();

//   return data.access_token;
// };

// // export function
// module.exports = fetchAccessToken;

require('dotenv').config();
// const fetch = require('node-fetch');

let accessToken = ''; // Stores the current access token
let tokenExpirationTime = 0; // Stores the expiration timestamp

const CLIENT_ID = process.env.NIBSS_DD_CLIENT_ID;
const CLIENT_SECRET = process.env.NIBSS_DD_CLIENT_SECRET;
const BASE_URL = process.env.NIBSS_BASE_URL;

// Utility function to fetch the access token
const fetchAccessToken = async () => {
  const response = await fetch(`${BASE_URL}/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      scope: `${CLIENT_ID}/.default`,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    console.error(`Failed to fetch access token: ${response.status}`);
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();

  // Update the access token and expiration time
  accessToken = data.access_token;
  tokenExpirationTime = Date.now() + (data.expires_in * 1000) - 5000; // Buffer of 5 seconds

  return accessToken;
};

// Function to check if the token is expired and fetch a new one if necessary
const getAccessToken = async () => {
  // Check if the token is expired or not set
  if (!accessToken || Date.now() >= tokenExpirationTime) {
    console.log('Access token expired or not set. Fetching a new token...');
    await fetchAccessToken();
  }
  return accessToken;
};

module.exports = getAccessToken;
