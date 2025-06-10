const crcCheckApi = async() => {
  // try {
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   const raw = {
  //     "Request": "{'@REQUEST_ID': '1', 'REQUEST_PARAMETERS': { 'REPORT_PARAMETERS': { '@REPORT_ID': '2', '@SUBJECT_TYPE': '1', '@RESPONSE_TYPE': '5' }, 'INQUIRY_REASON': { '@CODE': '1' }, 'APPLICATION': { '@PRODUCT': '017', '@NUMBER': '232', '@AMOUNT': '15000', '@CURRENCY': 'NGN' } }, 'SEARCH_PARAMETERS': { '@SEARCH-TYPE': '4', 'BVN_NO': '22170216986' }}",
  //     "UserName": "14093142boctru1",
  //     "Password": "te3tUupw3115@2023"
  //   };

  //   const requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: JSON.stringify(raw),
  //     redirect: 'follow'
  //   };

  //   const response = await fetch("https://webserver.creditreferencenigeria.net/JsonLiveRequest/JsonService.svc/CIRRequest/ProcessRequestJson", requestOptions);
    
  //   if (!response.ok) {
  //     throw new Error(`Request failed with status ${response.status}`);
  //   }

  //   const result = await response.text();
  //   console.log(result);
  // } catch (error) {
  //   console.error('Error:', error);
  // }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "Request": "{'@REQUEST_ID': '1', 'REQUEST_PARAMETERS': { 'REPORT_PARAMETERS': { '@REPORT_ID': '2', '@SUBJECT_TYPE': '1', '@RESPONSE_TYPE': '5' }, 'INQUIRY_REASON': { '@CODE': '1' }, 'APPLICATION': { '@PRODUCT': '017', '@NUMBER': '232', '@AMOUNT': '15000', '@CURRENCY': 'NGN' } }, 'SEARCH_PARAMETERS': { '@SEARCH-TYPE': '4', 'BVN_NO': '22170216986' }}",
    "UserName": "14093142boctru1",
    "Password": "te3tUupw3115@2023"
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response = await fetch("https://webserver.creditreferencenigeria.net/JsonLiveRequest/JsonService.svc/CIRRequest/ProcessRequestJson", requestOptions)
    
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const result = await response.text();
    console.log(result);

  } catch (error) {
    console.error('Error:', error);
  }
}

export default crcCheckApi;