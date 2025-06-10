export const convertFiletoBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject("No file provided");

    const reader = new FileReader();
    reader.onload = function (e) {
      const base64String = e.target.result;
      resolve(base64String);
    };
    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export async function imageUrlToBase64(imageUrl) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // this will be the base64 string
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}