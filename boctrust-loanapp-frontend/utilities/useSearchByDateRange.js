import { useState, useEffect } from 'react';
import searchListByDateRange from './searchListByRange';


const useSearchByDateRange = (initialList, dateRange, dateKey) => {
  const [searchData, setSearchData] = useState(initialList);

  const searchByDateRange = () => {
    const { fromDate, toDate } = dateRange;
    const searchResult = searchListByDateRange(initialList, fromDate, toDate, dateKey);
    setSearchData(searchResult);
  };

  useEffect(() => {
    searchByDateRange();
  }, [dateRange, dateKey, initialList]);

  return {
    searchData,
  };
};

export default useSearchByDateRange;