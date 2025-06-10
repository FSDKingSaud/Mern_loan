/* eslint-disable no-undef */
import { saveAs } from 'file-saver';

const handleDownload = (content) => {
    const fileContent = content.PDFContent;
    const fileName = content.fileName;
    const base64Content = fileContent;
    const decodedContent = atob(base64Content);

    const blob = new Blob([decodedContent], { type: 'application/pdf' });

     const downloadName = fileName || "default.pdf";
    saveAs(blob, downloadName);
}

export default handleDownload;

