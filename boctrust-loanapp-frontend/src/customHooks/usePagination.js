import { useState } from "react";

const usePagination = (initialPage = 1, totalPages = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const setPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    goToNextPage,
    goToPreviousPage,
    setPage,
  };
};

export default usePagination;
