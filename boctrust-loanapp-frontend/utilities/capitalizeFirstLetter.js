// capitalize first letter of each word in a string function
const capitalizeEachWord = (str) => {
    return str.replace(/\b[a-z]/g, (char) => char.toUpperCase());
};

export default capitalizeEachWord;