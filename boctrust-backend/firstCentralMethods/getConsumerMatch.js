const consumerMatch = async(bvn, ticket) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
    "DataTicket": ticket,  // data ticket
    "EnquiryReason": "credit scoring of the client by credit bureau",
    "ConsumerName": "",
    "DateOfBirth": "",
    "Identification": bvn, // customer bvn
    "Accountno": "",
    "ProductID": "45"
    });

    const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    try {
        const response = await fetch("https://online.firstcentralcreditbureau.com/firstcentralrestv2/ConnectConsumerMatch", requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return result[0].MatchedConsumer;
        
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = consumerMatch;
