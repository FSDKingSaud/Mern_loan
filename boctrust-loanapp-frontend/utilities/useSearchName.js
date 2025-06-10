import { useState, useEffect } from 'react';
import searchList from './searchListFunc';

const useSearch = (initialList, searchKey) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(initialList);

  const handleSearch = () => {
    const filteredList = searchList(
      initialList,
      searchTerm,
      searchKey
    );
    setFilteredData(filteredList);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
  };
};

// export function
export default useSearch;
