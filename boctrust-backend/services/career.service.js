const handleCareerPaginationSearchSortFilter = (query) => {
  let { search, deadline, dateposted, sortBy, page, limit } = query;

  const filter = {};

  if (deadline && deadline != "all") {
    filter.deadline = deadline;
  }
  if (dateposted && dateposted != "all") {
    filter.dateposted = dateposted;
  }

  if (search) {
    filter.$or = [{ jobtitle: { $regex: search, $options: "i" } }];
  }

  let sortOptions = {};
  switch (sortBy) {
    case "newest":
      sortOptions.createdAt = -1;
      break;
    case "oldest":
      sortOptions.createdAt = -1;
      break;
    default:
      sortOptions.createdAt = -1; // Default: Newest first
  }

  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  return {
    sortOptions,
    filter,
    pageNumber,
    pageSize,
    skip,
  };
};

module.exports = {
  handleCareerPaginationSearchSortFilter,
};
