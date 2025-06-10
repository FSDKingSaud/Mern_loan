import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDirectors } from "../../redux/reducers/boardDirectorReducer";
import Header from "../shared/Header";
import "./OurBoardPage.css";

const OurBoardPage = () => {
  const container = {
    fontSize: "18px",
    letterSpacing: "1.5px",
    lineHeight: "32px",
  };

  // Redux data
  const dispatch = useDispatch();
  const directors = useSelector((state) => state.directors.directors);

  // Fetch directors
  useEffect(() => {
    dispatch(fetchDirectors());
  }, [dispatch]);

  return (
    <>
      <Header imgurl="/images/bocboard.jpg" />

      {/* our board accordion section */}
      <div
        className="accordion accordion-flush"
        id="accordionFlushExample"
        style={container}
      >
        {directors.map((director, index) => (
          <div className="accordion-item" key={director._id}>
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#flush-collapse${index}`}
                aria-expanded="false"
                aria-controls={`flush-collapse${index}`}
              >
                {director.name} - {director.title}
              </button>
            </h2>
            <div
              id={`flush-collapse${index}`}
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="BoardMember">
                <div className="BoardMemberImg">
                  <img
                    className="w-100"
                    src={director.profileImg}
                    alt={director.name}
                  />
                </div>
                <div className="accordion-body px-5">
                  {director.biography.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OurBoardPage;
