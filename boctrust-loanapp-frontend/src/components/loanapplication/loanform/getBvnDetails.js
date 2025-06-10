// apiService.js

const clientId = '0a8580c1-7254-4774-8b63-048092e8e1b3'; // New Client ID
const clientSecret = 'h9JqBpVYmx14D1oGtdbFmIBza70ft0BM7GgwlYfS'; // New Secret
const accessTokenUrl = 'https://id.nibss-plc.com.ng/oxauth/restv1/token';
const endpoint = 'https://api.nibss-plc.com.ng/bvnconsent/v1/getPartialDetailsWithBvn';

// get access token
const getAccessToken = async () => {
  try {
    const response = await fetch(accessTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    throw new Error('Failed to get access token');
  }
};

// get partial details with customer BVN
export const getPartialDetailsWithBvn = async (bvn) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${endpoint}?bvn=${bvn}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
      console.log(error)
    throw new Error('Failed to fetch partial details with BVN');
  }
};
