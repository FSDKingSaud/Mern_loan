import * as XLSX from "xlsx";

export const handleExportToExcel = (
  data,
  filename
) => {
  if (!data) return;

  const wb = XLSX.utils.book_new(),
    ws = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${filename}.xlsx`);
};
