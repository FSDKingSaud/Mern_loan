import axios from "axios";

const fetchAllBanks = async (setBanks) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const res = await axios.get(`${apiUrl}/api/bankone/commercialbanks`);
  if (setBanks) {
    setBanks(res.data);
  } else {
    return res.data;
  }
};

export default fetchAllBanks;

export const filterBank = async (bankCode) => {
  const banks = await fetchAllBanks();

  return banks?.find((bank) => bank.Code == bankCode)?.Name;
};
