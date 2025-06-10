const searchListByDateRange = (list, fromDate, toDate, dateTarget) => {
    if (!fromDate && !toDate) {
        return list;
    } else {
        return list.filter((data) => {
            const targetDate = new Date(data[dateTarget]);
            const startDate = fromDate ? new Date(fromDate) : null;
            const endDate = toDate ? new Date(toDate) : null;

            // Check if the target date falls within the specified range
            if (startDate && endDate) {
                return targetDate >= startDate && targetDate <= endDate;
            } else if (startDate) {
                return targetDate >= startDate;
            } else if (endDate) {
                return targetDate <= endDate;
            }

            return false;
        });
    }
};

export default searchListByDateRange;
