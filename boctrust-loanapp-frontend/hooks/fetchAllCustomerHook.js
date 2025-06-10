import {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../src/redux/reducers/customerReducer";

const useFetchAllCustomer = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { customers } = useSelector((state) => state.customers);
    
    useEffect(() => {
        const fetchAllCustomerHook = async () => {
        try {
            await dispatch(fetchAllCustomer());
            setLoading(false);
        } catch (error) {
            setError(true);
            setLoading(false);
        }
        };
        fetchAllCustomerHook();
    }, [dispatch]);
    
    return { loading, error, customers };
};

export default useFetchAllCustomer;