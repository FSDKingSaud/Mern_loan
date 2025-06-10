import { useEffect, useState } from "react";

const usePaginatedData = (data = [], count, currentPage) => {
  const [paginatedData, setPaginatedData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Ensure data is always treated as an array
    const safeData = data || [];
    const startIndex = (currentPage - 1) * count;
    const endIndex = startIndex + count;

    // Slice data for pagination
    setPaginatedData(safeData.slice(startIndex, endIndex));

    // Calculate total pages
    setTotalPages(Math.ceil(safeData.length / count) || 1);
  }, [data, count, currentPage]);

  return { paginatedData, totalPages };
};

export default usePaginatedData;
