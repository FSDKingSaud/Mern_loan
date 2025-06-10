import { toWords } from "number-to-words";
import mandateFileTemplate from "../assets/template/mandateFileTemplate.json";
import { generate } from "@pdfme/generator";
import { image, text } from "@pdfme/schemas";
import {
  convertFiletoBase64,
  imageUrlToBase64,
} from "../../utilities/convertFiletoBase64";
import { filterBank } from "../components/loanapplication/loanform/fetchBanks";

export const genarateMandateFile = async (data) => {
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

function getDateRange(noOfMonths) {
  const startDate = new Date();

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + noOfMonths);

  // Format as YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split("T")[0];

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

export const handleGeneratingFile = async ({
  name,
  address,
  bankCode,
  branch,
  accountNumber,
  amount,
  noOfMonth,
  customerSignature,
  witnessName,
  witnessAddress,
  witnessOccupation,
  witnessSignature,
}) => {
  const bankName = await filterBank(bankCode);
  console.log(
    name,
    address,
    bankCode,
    branch,
    accountNumber,
    amount,
    noOfMonth,
    bankName,
    customerSignature,
    witnessName,
    witnessAddress,
    witnessOccupation,
    witnessSignature
  );

  if (!amount) {
    throw new Error("No Amount passed to mandate Template");
  }

  const amountInWords = amountToWords(amount);
  const { endDate, startDate } = getDateRange(noOfMonth);

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
    customerSignature: await convertFiletoBase64(customerSignature),
    witnessName,
    witnessAddress,
    witnessOccupation,
    witnessSignature: await imageUrlToBase64(
      `${import.meta.env.VITE_BASE_URL}/uploads/${witnessSignature}`
    ),
  };

  const blob = await genarateMandateFile(data);
  const mandateUrl = blob.size > 0 ? URL.createObjectURL(blob) : "/";
  if (typeof window !== "undefined" && mandateUrl) window.open(mandateUrl);
};
