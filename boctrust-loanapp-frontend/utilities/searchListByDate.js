// search list by date
const searchListByDate = (list, date, dateTarget) => {
    if (date === "") {
        return list;
    } else {
        return list?.filter((data) =>
            data[dateTarget].toLowerCase().includes(date.toLowerCase())
        );
    }
};

export default searchListByDate;
    