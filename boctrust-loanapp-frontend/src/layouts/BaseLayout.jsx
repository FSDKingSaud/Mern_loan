import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSetting } from "../redux/reducers/settingReducer";
import { useState } from "react";
import TopNav from "../components/navigation/TopNav";
import Footer from "../components/footer/Footer";
import { Outlet } from "react-router-dom";
// import NoticeModal from "../components/shared/NoticeModal";

const BaseLayout = () => {
  // const [showModal, setShowModal] = useState(false);
  const [appSettings, setAppSettings] = useState({});

  const dispatch = useDispatch();

  const settings = useSelector(
    (state) => state?.settingReducer?.settings?.settings
  );
  // const currentUser = useSelector((state) => state.adminAuth.user);


  useEffect(() => {
    dispatch(fetchSetting());
  }, [dispatch]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
      // setShowModal(true);
  //   }, 5000);

  //   // Cleanup function to clear the timer
  //   return () => clearTimeout(timer);
  // }, []);



  useEffect(() => {
    if (settings) {
      setAppSettings(settings[0]);
    } else {
      setAppSettings({});
    }
  }, [settings]);
  return (
    <div>
      <TopNav settings={appSettings} />

      <Outlet />
      {/* {showModal && !currentUser && <NoticeModal show={showModal} setShow={setShowModal} />} */}
      <Footer settings={appSettings} />
    </div>
  );
};

export default BaseLayout;
