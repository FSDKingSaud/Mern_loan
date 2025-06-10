  // handle next and previous button
  const handleNextPre = (e, listData, setListData, showCount) => {
      const value = e.target.value || e.target.alt;
    if (value === "next") {
      setListData(
        listData?.slice(
          listData.length,
          listData.length + showCount
        )
      );
    } else if (value === "prev") {
      setListData(
        listData?.slice(
          listData.length - showCount - showCount,
          listData.length - showCount
        )
      );
    }
};
  
export default handleNextPre;