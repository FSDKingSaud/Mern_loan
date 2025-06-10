import axios from "axios";

/* eslint-disable no-undef */
const clientSecret = import.meta.env.VITE_BVN_CLIENTSECRET;

const clientId = import.meta.env.VITE_BVN_CLIENTID;
const redirectUri = "https://www.boctrustmfb.com/app/nibbs-login";

const bvnVerification = () => {
  // Step 1: Redirect the customer to the IDP page
  const idpAuthorizeUrl = 'https://id.nibss-plc.com.ng/oxauth/restv1/authorize'
  // const authorizeUrl = `${idpAuthorizeUrl}?scope=icad&acr_values=otp&response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}`;
  // BUG: 'icad' is not in the scope.
  // FIX: changed the scope into 'bvn'
  // SUGGETION: move 'clientSecret' , 'clientId' & 'redirectUri' into enviroment varibales
  const authorizeUrl = `${idpAuthorizeUrl}?scope=bvn&acr_values=otp&response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}`

  // Redirect the user to the IDP authorization page
  window.location.href = authorizeUrl
}

const getBvnDetails = async (code) => {
  // Step 2: After the customer is redirected back to callback URL with a temporary code,
  // extract the code and exchange it for an access token
  // const grantType = 'authorization_code';

  // Simulate receiving the temporary code (replace with the actual code received)
  // const urlSearchParams = new URLSearchParams(window.location.search)

  // const code = urlSearchParams.get('code')

  
  const credentials = btoa(`${clientId}:${clientSecret}`);

  // const exchangeCodeForToken = async () => {
  //   try {
  //     // Exchange the code for an access token
  //     if (!code) {
  //       throw new Error('Authorization code not found in the URL')
  //     }
  //     const response = await fetch(
  //       `https://id.nibss-plc.com.ng/oxauth/restv1/token`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/x-www-form-urlencoded',
  //           Authorization: `Basic ${credentials}`,
  //         },
  //         body: new URLSearchParams({
  //           client_id: clientId,
  //           code: code,
  //           grant_type: 'authorization_code',
  //           redirect_uri: redirectUri,
  //         }),
  //       }
  //     )

  //     if (!response.ok) {
  //       throw new Error(`Token request failed with status ${response.status}`)
  //     }

  //     const data = await response.json()
  //     console.log('data', data)
  //     const accessToken = data.access_token
  //     console.log(`Access Token: ${accessToken}`)

  //     // Step 3: Use the access token to call the API endpoints
  //     const apiEndpoint =
  //       'https://api.nibss-plc.com.ng/bvnconsent/v1/getPartialDetailsWithBvn'

  //     const apiResponse = await fetch(apiEndpoint, {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     })

  //     if (!apiResponse.ok) {
  //       throw new Error(`API request failed with status ${apiResponse.status}`)
  //     }

  //     const apiData = await apiResponse.json()
  //     console.log('API Response:', apiData)
  //   } catch (error) {
  //     console.error('Error:', error.message)
  //   }
  // }

  // // Call the function to exchange the code for an access token
  // exchangeCodeForToken()

    try {
    const BaseURL = import.meta.env.VITE_BASE_URL;
    const response = await axios.post(`${BaseURL}/api/bvn/get-userinfo`, {
      code: code,
    });
   return response.data
  } catch (error) {
    throw new Error(error.message);
  }
}

export { bvnVerification, getBvnDetails }