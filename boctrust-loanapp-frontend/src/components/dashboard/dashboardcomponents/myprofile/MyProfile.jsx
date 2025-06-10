import {useSelector} from "react-redux";
import ProfileCard from "./ProfileCard";

const MyProfile = () => {
  // get current login user
  const user = useSelector((state) => state.adminAuth.user);
  const branch = user.branch.charAt(0).toUpperCase() + user.branch.slice(1);
  const styles = {
    container: {
      backgroundColor: "#f5f6f7",
      borderRadius: "18px",
      marginTop: "2rem",
      paddingRight: "4rem",
    },
    img: {
      width: "90px",
      height: "90px",
      borderRadius: "50%",
      marginBottom: "1rem",
      border: "2px solid orange",
    }
  };

  // console.log("user profile", user)

  return (
    <div style={styles.container} className="PCon">
      <div>
        <img
          src={user.photocaptureImg || "/images/profileavaterlg.png"}
          alt="profile-image"
          style={styles.img}
        />
      </div>
      <div>
        <ProfileCard title="First Name" value={user.firstname} />
        <ProfileCard title="Last Name" value={user.lastname} />
        <ProfileCard
          title="Business Name/Employer"
          value={user?.employer.employersName || "Self Employed"}
        />
        <ProfileCard title="Branch" value={branch} />
        <ProfileCard title="Email" value="femiakin@gmail.com" />
        <ProfileCard title="Mobile Number" value={user.phonenumber} />
        <ProfileCard title="Address" value={user.houseaddress || ""} />
      </div>
    </div>
  );
};

export default MyProfile;
