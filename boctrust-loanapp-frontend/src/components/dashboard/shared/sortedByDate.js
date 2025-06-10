 const sortByCreatedAt = (list) => {
    //  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
     
     // Create a copy of the array to avoid mutating the original
    const dataCopy = [...list];

    return dataCopy.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA; // For descending order
    });
}
  
export default sortByCreatedAt;