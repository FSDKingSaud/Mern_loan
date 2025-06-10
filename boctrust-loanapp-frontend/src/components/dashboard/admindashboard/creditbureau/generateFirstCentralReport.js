import axios from "axios";

//  Generate Consumer Report
  const generateConsumerReport = async (dataTicket) => {
    try {
      const response = await axios.post(
        "https://uat.firstcentralcreditbureau.com/RestAPI/firstCentral /ConnectConsumerMatch",
        {
            "DataTicket": dataTicket,
            "EnquiryReason": "Test",
            "Identification": "22471069115",
            "ConsumerName": "",
            "ProductID": "45",
            "DateOfBirth": "",
            "AccountNo": "",
          
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const generatedReport = response.data;
    //   setReport(generatedReport);
      console.log("Generated Report:", generatedReport);
    } catch (error) {
      console.error("Report generation error:", error);
    }
};
  
export default generateConsumerReport;