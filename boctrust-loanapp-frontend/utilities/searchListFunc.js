  const searchList = (listData, searchTerms, searchTarget) => {
    if (!listData || !Array.isArray(listData)) {
    return [];
  }

  if (searchTerms === "") {
    return listData;
  } else {
    return listData.filter((data) =>
      data && data[searchTarget] &&
      data[searchTarget].toLowerCase().includes(searchTerms.toLowerCase())
    );
  }
};
  
export default searchList;