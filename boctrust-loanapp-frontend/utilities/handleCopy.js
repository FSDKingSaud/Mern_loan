import { toast } from "react-toastify";

export const handleCopy = async (textToCopy, onSuccess) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    onSuccess();
  } catch (err) {
    console.error("Failed to copy text: ", err);
    toast.error("Failed to copy text");
  }
};
