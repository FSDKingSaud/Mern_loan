export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };


  export const base64ToFile = (base64, filename) => {
    const [metadata, data] = base64.split(',');
    const mime = metadata.match(/:(.*?);/)[1];
    const binary = atob(data);
    const arrayBuffer = new ArrayBuffer(binary.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binary.length; i++) {
      uint8Array[i] = binary.charCodeAt(i);
    }
    return new File([arrayBuffer], filename, { type: mime });
  };