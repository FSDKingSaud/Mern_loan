const express = require("express");
const router = express.Router();

router.post("/get-userinfo", async (req, res) => {
  // const idpTokenUrl = 'https://idsandbox.nibss-plc.com.ng/oxauth/restv1/token';
  const idpTokenUrl = "https://id.nibss-plc.com.ng/oxauth/restv1/token";
  const clientSecret = process.env.BVN_CLIENTSECRET;
  // const clientSecret = "R6EuiPa8sLsrdbNMVoxMadTOFlbuEXfdEOTabq82";
  const grantType = "authorization_code";
  const clientId = process.env.BVN_CLIENTID;
  // const clientId = "8e7cd2fe-35b5-4e25-9a98-0a555f1c23cd";
  const redirectUri = "https://www.boctrustmfb.com/app/nibbs-login";
  // const redirectUri = "http://localhost:5173/app/nibbs-login";

  try {
    const tokenRequestBody = new URLSearchParams();
    // tokenRequestBody.append("client_id", clientId);
    // tokenRequestBody.append("client_secret", clientSecret);
    // tokenRequestBody.append("code", req.body.code);
    // tokenRequestBody.append("redirect_uri", redirectUri);
    // tokenRequestBody.append("grant_type", grantType);
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    const response = await fetch(idpTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        client_id: clientId,
        code: req.body.code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });
    const data = await response.json();

    console.log(data, "data")

    if (!response.ok) {
      console.log(data, "erro data")
      throw new Error(data.error_description);
    }

    const accessToken = data.access_token;

    // Step 3: Use the access token to call the API endpoints
    const apiEndpoint =
      "https://api.nibss-plc.com.ng/bvnconsent/v1/getPartialDetailsWithBvn";

    const apiResponse = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-consumer-custom-id":  clientId,
        "x-consumer-unique-id": "02kj@audienceconnectng.com"
      },
    });
    

    
    if (!apiResponse.ok) {
      const apiData = await apiResponse.json();
    
      throw new Error(apiData.error_description);
    }

    const apiData = await apiResponse.json();
   

    res.json(apiData[0]);
  } catch (error) {
    console.log(error, "erro data")
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
