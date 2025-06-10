const convertFile = (e, setField) => { 
    const newFile = e.currentTarget.files[0];
    setField(newFile);
};

export default convertFile;