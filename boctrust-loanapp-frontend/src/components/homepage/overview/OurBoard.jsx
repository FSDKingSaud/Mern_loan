import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDirectors } from "../../../redux/reducers/boardDirectorReducer";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Overview.css";

const OurBoard = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Redux data
  const dispatch = useDispatch();
  const directors = useSelector((state) => state.directors.directors);

  // Fetch directors
  useEffect(() => {
    dispatch(fetchDirectors());
  }, [dispatch]);

  return (
    <div className="container">
      <div className="row">
        <div className="VisionLeft col-md-6 col-sm-12">
          <h3>Meet Our Board</h3>
          <div>
            {directors.map((director, index) => (
              <Accordion
                key={director._id}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}bh-content`}
                  id={`panel${index}bh-header`}
                >
                  <Typography sx={{ width: "53%", flexShrink: 0 }}>
                    {director.name}
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    - {director.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {director.biography.map((para, i) => (
                    <Typography key={i}>{para}</Typography>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>

        <div className="VisionRight col-md-6 col-sm-12">
          <img
            className="TopImg"
            src="/images/boctrust-staff1.avif"
            alt="bocstrust-microfinance-staff"
          />
        </div>
      </div>
    </div>
  );
};

export default OurBoard;
