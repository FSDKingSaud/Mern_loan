import CryptoJS from 'crypto-js';

export const encryptText = (plainText) => {
  const encrypted = CryptoJS.AES.encrypt(plainText, import.meta.env.VITE_APP_SECRET_KEY).toString();
  return encrypted;
};

// Function to decrypt text
export const decryptText = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, import.meta.env.VITE_APP_SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
};
