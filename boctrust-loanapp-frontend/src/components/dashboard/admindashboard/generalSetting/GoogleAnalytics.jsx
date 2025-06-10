/* eslint-disable no-undef */

const GoogleAnalytics = () => {
  const styles = {
    button: {
      backgroundColor: "#145098",
      border: "none",
      color: "white",
      padding: "15px 32px",
      textAlign: "center",
      textDecoration: "none",
    },
  };
  // useEffect(() => {
  //   // Open Google Analytics URL in a new tab when component mounts
  //   window.open(
  //     "https://analytics.google.com/analytics/web/#/p432229551/reports/intelligenthome",
  //     "_blank"
  //   );
  // }, []);

  return (
    <div>
      <h2>📊 Google Analytics Dashboard Access.</h2>
      <p>
        Monitor website performance and user insights through Google Analytics.
      </p>
      <div className="my-3">
        <h3>Instructions</h3>

        <p>Click the button below to access the analytics dashboard.</p>
        <p>You must be signed in with an authorized Google account.</p>
        <p>If you experience issues, ensure you have the correct permissions</p>
      </div>

      <div className="my-4">
        <p>By clicking you will be redirected...</p>

        <a
          href="https://analytics.google.com/analytics/web/#/p432229551/reports/intelligenthome"
          target="_blank"
          rel="noopener noreferrer"
        ></a>

        <div>
          <button
            style={styles.button}
            onClick={() => {
              window.open(
                "https://analytics.google.com/analytics/web/#/p432229551/reports/intelligenthome",
                "_blank"
              );
            }}
          >
            Open Google Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalytics;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const GoogleAnalytics = () => {
//   const [analyticsData, setAnalyticsData] = useState(null);

//   useEffect(() => {
//     const fetchAnalyticsData = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/analytics-data");
//         setAnalyticsData(response.data);
//       } catch (error) {
//         console.error("Error fetching analytics data:", error);
//       }
//     };

//     fetchAnalyticsData();
//   }, []);

//   return (
//     <div>
//       <h1>Google Analytics Dashboard</h1>
//       {analyticsData ? (
//         <div>
//           <h2>Sessions & Pageviews</h2>
//           <ul>
//             {analyticsData.reports[0].data.rows.map((row, index) => (
//               <li key={index}>
//                 Page: {row.dimensions[0]} - Sessions: {row.metrics[0].values[0]} - Pageviews:{" "}
//                 {row.metrics[0].values[1]}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>Loading data...</p>
//       )}
//     </div>
//   );
// };

// export default GoogleAnalytics;
