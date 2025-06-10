const nibssInstitution = [
  {
    institutionCode: "999000",
    institutionName: "Pse-Test",
    category: 2,
  },
  {
    institutionCode: "999001",
    institutionName: "ADH",
    category: 3,
  },
  {
    institutionCode: "999002",
    institutionName: "NPF",
    category: 11,
  },
  {
    institutionCode: "999003",
    institutionName: "FETS",
    category: 11,
  },
  {
    institutionCode: "999004",
    institutionName: "Teasy",
    category: 11,
  },
  {
    institutionCode: "999009",
    institutionName: "PagaTech",
    category: 2,
  },
  {
    institutionCode: "999011",
    institutionName: "First Bank",
    category: 2,
  },
  {
    institutionCode: "999015",
    institutionName: "Parallex MFB",
    category: 7,
  },
  {
    institutionCode: "999018",
    institutionName: "Trustbond",
    category: 7,
  },
  {
    institutionCode: "999023",
    institutionName: "Citi Bank",
    category: 2,
  },
  {
    institutionCode: "999033",
    institutionName: "UBA",
    category: 2,
  },
  {
    institutionCode: "999035",
    institutionName: "Wema Bank",
    category: 2,
  },
  {
    institutionCode: "999044",
    institutionName: "Access Bank",
    category: 2,
  },
  {
    institutionCode: "999050",
    institutionName: "ECOBANK",
    category: 2,
  },
  {
    institutionCode: "999052",
    institutionName: "Covenant MFB",
    category: 7,
  },
  {
    institutionCode: "999057",
    institutionName: "Zenith Bank",
    category: 2,
  },
  {
    institutionCode: "999058",
    institutionName: "GTBank",
    category: 2,
  },
  {
    institutionCode: "999063",
    institutionName: "DIAMOND BANK",
    category: 2,
  },
  {
    institutionCode: "999070",
    institutionName: "Fidelity",
    category: 2,
  },
  {
    institutionCode: "999076",
    institutionName: "Skye Bank",
    category: 2,
  },
  {
    institutionCode: "999078",
    institutionName: "NOW NOW",
    category: 11,
  },
  {
    institutionCode: "999082",
    institutionName: "Keystone Bank",
    category: 2,
  },
  {
    institutionCode: "999104",
    institutionName: "BOSAK",
    category: 7,
  },
  {
    institutionCode: "999105",
    institutionName: "NOVA",
    category: 7,
  },
  {
    institutionCode: "999107",
    institutionName: "Mutual Benefits",
    category: 7,
  },
  {
    institutionCode: "999116",
    institutionName: "VFD MFB",
    category: 7,
  },
  {
    institutionCode: "999140",
    institutionName: "WEMA MOBILE",
    category: 11,
  },
  {
    institutionCode: "999214",
    institutionName: "FCMB",
    category: 2,
  },
  {
    institutionCode: "999215",
    institutionName: "UNITY BANK",
    category: 2,
  },
  {
    institutionCode: "999221",
    institutionName: "Stanbic Ibtc",
    category: 2,
  },
  {
    institutionCode: "999232",
    institutionName: "Sterling Bank",
    category: 2,
  },
  {
    institutionCode: "999998",
    institutionName: "Psuedo",
    category: 2,
  },
  {
    institutionCode: "999999",
    institutionName: "NIBSS",
    category: 1,
  },
];

const balancePayload = {
  channelCode: "1",

  targetAccountName: "vee Test",

  targetAccountNumber: "0112345678",

  targetBankVerificationNumber: "33333333333",

  authorizationCode: "MA-0112345678-2022315-53097",

  destinationInstitutionCode: "999998",

  billerId: "ADC19BDC-7D3A-4C00-4F7B-08DA06684F59",

  transactionId: "000446250221204500123456789111",
};

const fundsTransferPayload = {
  sourceInstitutionCode: "999998",

  amount: 100,

  beneficiaryAccountName: "Ake Mobolaji & Temabo",

  beneficiaryAccountNumber: "1780004070",

  beneficiaryBankVerificationNumber: "22222222226",

  beneficiaryKYCLevel: 1,

  channelCode: 1,

  originatorAccountName: "vee Test",

  originatorAccountNumber: "0112345678",

  originatorBankVerificationNumber: 33333333333,

  originatorKYCLevel: 1,

  destinationInstitutionCode: 999998,

  mandateReferenceNumber: "MA-0112345678-2022315-53097",

  nameEnquiryRef: "999999191106195503191106195503",

  originatorNarration: "Payment from 0112345678 to 1780004070",

  paymentReference: "NIPMINI/1234567890",

  transactionId: "000446250221204500123456789113",

  transactionLocation: "1.38716,3.05117",

  beneficiaryNarration: "Payment to 0112345678 from 1780004070",

  billerId: "ADC19BDC-7D3A-4C00-4F7B-08DA06684F59",

  initiatorAccountNumber: "0912345678",

  initiatorAccountName: "Helen Test",
};

module.exports = { nibssInstitution, balancePayload, fundsTransferPayload };
