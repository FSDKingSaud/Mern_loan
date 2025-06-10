// module.exports = router;
const express = require('express');
const router = express.Router();

// crc basic report endpoint
router.post('/getcrc', async (req, res) => {
  
    // Extract BVN from the request body
    let { bvn } = req.body;

    bvn = bvn.replace(/\s/g, '');
    // const bvn = '22170216986';

    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "Request": "{'@REQUEST_ID': '1', 'REQUEST_PARAMETERS': { 'REPORT_PARAMETERS': { '@REPORT_ID': '2', '@SUBJECT_TYPE': '1', '@RESPONSE_TYPE': '5' }, 'INQUIRY_REASON': { '@CODE': '1' }, 'APPLICATION': { '@PRODUCT': '017', '@NUMBER': '232', '@AMOUNT': '15000', '@CURRENCY': 'NGN' } }, 'SEARCH_PARAMETERS': { '@SEARCH-TYPE': '4', 'BVN_NO': '"+bvn+"' }}",
            "UserName": process.env.CRC_USERNAME,
            "Password": process.env.CRC_PASSWORD
        });
        
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const response = await fetch("https://webserver.creditreferencenigeria.net/JsonLiveRequest/JsonService.svc/CIRRequest/ProcessRequestJson", requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        // Send the result as a response to the client
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// crc classic report endpoint
router.post('/getcrcclassic', async (req, res) => {
  
    // Extract BVN from the request body
    let { bvn } = req.body;
    bvn = bvn.replace(/\s/g, '');
    // const bvn = '22170216986';

    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
             "Request": "{'@REQUEST_ID': '1','REQUEST_PARAMETERS': {   'REPORT_PARAMETERS': {      '@REPORT_ID': '2',      '@SUBJECT_TYPE': '1',      '@RESPONSE_TYPE': '5'   },   'INQUIRY_REASON': {      '@CODE': '1'   },   'APPLICATION': {      '@PRODUCT': '017',      '@NUMBER': '232',      '@AMOUNT': '15000',      '@CURRENCY': 'NGN'   }},'SEARCH_PARAMETERS': {   '@SEARCH-TYPE': '4',   'BVN_NO': '"+bvn+"' }}",
            "UserName": process.env.CRC_USERNAME,
            "Password": process.env.CRC_PASSWORD
        });
        
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const response = await fetch("https://webserver.creditreferencenigeria.net/JsonLiveRequest/JsonService.svc/CIRRequest/ProcessRequestJson", requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        // Send the result as a response to the client
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// crc cooporate report endpoint
router.post('/getcrccooporate', async (req, res) => {
  
    // Extract BVN from the request body
    let { bvn } = req.body;
    bvn = bvn.replace(/\s/g, '');

    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "Request": "{'@REQUEST_ID': '1','REQUEST_PARAMETERS': {   'REPORT_PARAMETERS': {      '@REPORT_ID': '4',      '@SUBJECT_TYPE': '0',      '@RESPONSE_TYPE': '5'   },   'INQUIRY_REASON': {      '@CODE': '1'   },   'APPLICATION': {      '@PRODUCT': '017',      '@NUMBER': '232',      '@AMOUNT': '15000',      '@CURRENCY': 'NGN'   }},'SEARCH_PARAMETERS': {   '@SEARCH-TYPE': '3',   'BUSINESS_REG_NO': '"+bvn+"' }}",
            "UserName": process.env.CRC_USERNAME,
            "Password": process.env.CRC_PASSWORD
        });
        
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const response = await fetch("https://webserver.creditreferencenigeria.net/JsonLiveRequest/JsonService.svc/CIRRequest/ProcessRequestJson", requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        // Send the result as a response to the client
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;