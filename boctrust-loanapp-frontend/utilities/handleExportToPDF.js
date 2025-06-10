import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const handleExportToPDF = ({ tableId, filename }) => {
  const doc = new jsPDF();

  autoTable(doc, {
    html: `#${tableId}`,
    theme: "grid",
    headStyles: { fillColor: [20, 80, 152] },
    
  });

  doc.save(`${filename}.pdf`);
};
