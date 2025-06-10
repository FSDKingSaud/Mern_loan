import apiClient from "../src/lib/axios";

// custom hook fetch single employer 

const fetchSingleEmployer = async (employerId) => {
    try {
        const response = await apiClient.get(`/employers/${employerId}`);
        return response.data.employersName;
    } catch (error) {
        console.error(error);
    }
};

export default fetchSingleEmployer;