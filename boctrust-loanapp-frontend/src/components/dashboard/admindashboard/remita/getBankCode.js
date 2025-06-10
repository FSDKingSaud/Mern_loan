import banks from "./banks";

const getBankCode = (bankName) => {
    const bank = banks.find(bank => bank.name === bankName.toUpperCase());
    if (!bank) {
        throw new Error(`Bank name ${bankName} not found`);
    }
    return bank.code;
}

export default getBankCode;