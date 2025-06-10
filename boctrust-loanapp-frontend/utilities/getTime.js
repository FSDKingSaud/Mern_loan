// get time from timestamp
const getTimeOnly = (timestamp) =>{
  const dateObj = new Date(timestamp);
  const hours = String(dateObj.getUTCHours()).padStart(2, '0');
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');

    const pm = hours > 12 ? 'PM' : 'AM';
  return `${hours}:${minutes} ${pm}`;
}

export default getTimeOnly;