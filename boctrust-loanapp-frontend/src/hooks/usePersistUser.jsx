import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRefreshToken } from "../services/refreshToken";
import {
  logoutUser,
  setAuthLoading,
  setToken,
  setUser,
} from "../redux/reducers/adminAuthReducer";
import { handleLogout } from "../services/logout";
import { useNavigate } from "react-router-dom";

const usePersistUser = () => {
  const { user: currentUser } = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  

  useEffect(() => {
    const handleRequest = async () => {
      try {
        if (!currentUser) {
         
          dispatch(setAuthLoading(true));
          const { token, user } = await getRefreshToken();

          dispatch(setToken(token));
          dispatch(setUser(user));
        }
      } catch (error) {
        console.log(error);
        await handleLogout();
        dispatch(logoutUser());
        navigate("/login");
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    handleRequest();
  }, []);
};

export default usePersistUser;
