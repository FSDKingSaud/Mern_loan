import PropTypes from "prop-types";
import { useState } from "react";
import { Box, Typography, Tab, Tabs } from "@mui/material";
import TabPanel from "./TabPanel";
import OurVisionMission from "./OurVisionMission";
import WhoWeAre from "./WhoWeAre";
import OurBoard from "./OurBoard";

const Overview = ({ content }) => {
  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabContainer = { backgroundColor: "#ecaa00", color: "#fff" };

  // destructure
  const {
    missionStatement,
    visionStatement,
    whoWeAreText,
    companyGoal,
    ourPeoplePara1,
    ourPeoplePara2,
    ourPeoplePara3,
  } = content;

  return (
    <>
      <Box
        className="OverviewContainer"
        sx={{ textAlign: "center", padding: " 38px 8rem" }}
      >
        <Typography
          variant="h4"
          sx={{
            marginTop: "58px",
            marginBottom: "28px",
            fontWeight: 600,
            color: "#145088",
          }}
        >
          Company Overview
        </Typography>

        <Typography
          variant="p"
          sx={{
            fontSize: "24px",
            marginBottom: "38px",
            lineHeight: "38px",
          }}
        >
          {content?.companyOverviewText ||
            "Our core objective is to provide avenue for saving, access to credit and financial advisory services to individuals and micro, small & medium enterprises with competitive advantages. We believe in Growing Together with our customer."}
        </Typography>
      </Box>

      <div style={tabContainer}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              textColor="inherit"
              indicatorColor="inherit"
              sx={{ backgroundColor: "#ecaa00", color: "#fff", width: "100%" }}
            >
              <Tab label="Our Vision & Mission" {...a11yProps(0)} />
              <Tab label="Who we are" {...a11yProps(1)} />
              <Tab label="Our Board" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <OurVisionMission
              mission={missionStatement}
              vision={visionStatement}
              goal={companyGoal}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <WhoWeAre
              textContent={whoWeAreText}
              para1={ourPeoplePara1}
              para2={ourPeoplePara2}
              para3={ourPeoplePara3}
            />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <OurBoard />
          </TabPanel>
        </Box>
      </div>
    </>
  );
};

Overview.propTypes = {
  content: PropTypes.shape({
    companyOverviewText: PropTypes.string,
    missionStatement: PropTypes.string,
    visionStatement: PropTypes.string,
    whoWeAreText: PropTypes.string,
    companyGoal: PropTypes.string,
    ourPeoplePara1: PropTypes.string,
    ourPeoplePara2: PropTypes.string,
    ourPeoplePara3: PropTypes.string
  }),
};

export default Overview;
