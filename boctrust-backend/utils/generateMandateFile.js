const { generate } = require("@pdfme/generator");
const { image, text } = require("@pdfme/schemas");
const mandateFileTemplate = require("../fileTemplate/mandateFileTemplate.json");
const convertImageToBase64 = require("./covertImageToBase64");
const {
  getBankoneCommercialBanks,
} = require("../services/bankoneOperationsServices");
const { toWords } = require("number-to-words");
// const testSaveFile = require("./saveFileTest");

const genarateMandateFile = async (data) => {
  const template = mandateFileTemplate;

  const {
    currentDate,
    name,
    address,
    bank,
    branch,
    amountInWords,
    accountNumber,
    startDate,
    endDate,
    creditorName,
    creditorAddress,
    customerSignature,
    witnessName,
    witnessAddress,
    witnessOccupation,
    witnessSignature,
  } = data;

  const generatePDF = async () => {
    const inputs = [
      {
        currentDate,
        name,
        customerName2: name,
        address,
        bank,
        branch,
        currentDate2: currentDate,
        currentDate3: currentDate,
        amountInWords,
        bank2: bank,
        branch2: branch,
        accountNumber,
        startDate,
        endDate,
        creditorName,
        creditorAddress,
        customerSignature,
        witnessName,
        witnessAddress,
        witnessOccupation,
        witnessSignature,
      },
    ];

    const pdf = await generate({
      template,
      inputs,
      plugins: {
        text,
        image,
      },
      // options: { font },
    });

    return new Blob([pdf.buffer], { type: "application/pdf" });
  };

  const blobResponse = await generatePDF();

  // await testSaveFile(blobResponse);

  return blobResponse;
};

function amountToWords(amount) {
  const [nairaPart, koboPart] = amount.toFixed(2).split("."); // ensures 2 decimal places

  const nairaWords = toWords(parseInt(nairaPart));
  const koboWords = parseInt(koboPart) > 0 ? toWords(parseInt(koboPart)) : null;

  let result = `${nairaWords} naira`;
  if (koboWords) {
    result += ` and ${koboWords} kobo`;
  }

  return result;
}

const handleGeneratingFile = async ({
  name,
  address,
  bankCode,
  branch,
  accountNumber,
  amount,
  startDate,
  endDate,
  customerSignature,
  witnessName,
  witnessAddress,
  witnessOccupation,
  witnessSignature,
}) => {
  const bankoneCommercialBanks = await getBankoneCommercialBanks();
  const bankName = bankoneCommercialBanks?.find(
    (bank) => bank.Code == bankCode
  )?.Name;

  if (!amount) {
    throw new Error("No Amount passed to mandate Template");
  }

  const amountInWords = amountToWords(amount);

  const data = {
    currentDate: new Date().toISOString().split("T")[0],
    name,
    address,
    bank: bankName,
    branch,
    amountInWords,
    accountNumber,
    startDate,
    endDate,
    creditorName: "Boctrust Microfinance Bank",
    creditorAddress: "26 Moloney Street, Onikan, Lagos",
    customerSignature: convertImageToBase64(customerSignature),
    witnessName,
    witnessAddress,
    witnessOccupation,
    witnessSignature: convertImageToBase64(witnessSignature),
  };

  const blob = await genarateMandateFile(data);
  return blob;
};

module.exports = { handleGeneratingFile };
