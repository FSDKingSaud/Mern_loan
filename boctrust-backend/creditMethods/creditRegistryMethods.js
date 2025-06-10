
const getCreditRegistrySessionCode = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "EmailAddress": process.env.CR_EMAIL,
        "Password": process.env.CR_PASSWORD,
        "SubscriberID": process.env.CR_SUBSCRIBER_ID
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://api.creditregistry.com/nigeria/AutoCred/Live/v8/api/Login", requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("result", result);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = getCreditRegistrySessionCode;
