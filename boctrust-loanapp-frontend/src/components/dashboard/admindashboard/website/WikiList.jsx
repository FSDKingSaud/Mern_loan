import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWikis } from "../../../../redux/reducers/wikiReducer";
import Table from "react-bootstrap/Table";
import PageLoader from "../../shared/PageLoader";
import ActionNotification from "../../shared/ActionNotification";
import "../../Dashboard.css";
import EditWiki from "./EditWiki";
import NoResult from "../../../shared/NoResult";
// functions
import getDateOnly from "../../../../../utilities/getDate";
import searchList from "../../../../../utilities/searchListFunc";
import apiClient from "../../../../lib/axios";

// custom hook
import usePaginatedData from "../../../../customHooks/usePaginationData";

const WikiList = ({ count, searchTerms, setTotalPages, currentPage }) => {
  const [openModel, setOpenModel] = useState(false);
  const [action, setAction] = useState(false);
  const [wikiId, setWikiId] = useState("");
  const [wikisObj, setWikisObj] = useState({});

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchWikis());
  }, [dispatch]);

  const wikis = useSelector((state) => state.wikiReducer.wikis.wikis);
  const status = useSelector((state) => state.wikiReducer.status);
  const [wikisList, setWikisList] = useState(wikis);


  // custom pagination update
  const { paginatedData: paginatedWikisList, totalPages } = usePaginatedData(
    wikis,
    count,
    currentPage
  );

  useEffect(() => {
    setWikisList(paginatedWikisList); // Update local state with paginated data
  }, [paginatedWikisList]);

  useEffect(() => {
    setTotalPages(totalPages); // Update total pages when it changes
  }, [totalPages, setTotalPages]);

  // update wikisList to show 10 wikis on page load
  // or when count changes
  useEffect(() => {
    setWikisList(wikis?.slice(0, count));
  }, [wikis, count]);

  // update wikisList on search
  const handleSearch = () => {
    const currSearch = searchList(wikis, searchTerms, "question");
    setWikisList(currSearch?.slice(0, count));
  };
  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  // handle edit action
  const handleEdit = () => {
    setOpenModel(true);
  };

  // handle select action
  const handleSelect = (e) => {
    const option = e.target.value;
    const id = e.target.id;
    setWikiId(id);

    // filter wiki object by id
    const wiki = wikis.find((wiki) => wiki._id === id);
    setWikisObj(wiki);

    if (option === "edit") {
      handleEdit();
    } else if (option === "delete") {
      setAction(true);
    }
  };

  // handle delete action
  const handleDelete = async () => {
    await apiClient.delete(`/wiki/wikis/${wikiId}`);

    dispatch(fetchWikis());
    setAction(false);
  };

  const styles = {
    head: {
      color: "#145098",
      fontSize: "1.2rem",
      backgroudColor: "#f9f9f9",
    },
    select: {
      backgroundColor: "#ecaa00",
      color: "#fff",
      border: "none",
      fontSize: "1rem",
      marginTop: "0.1rem",
      padding: "0.2rem 0.5rem",
    },
  };

  return (
    <>
      {status === "loading" ? (
        <PageLoader />
      ) : (
        <div className="ListSec">
          <div style={styles.table}>
            <Table hover responsive="sm">
              <thead style={styles.head}>
                <tr>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {wikisList?.length === 0 && <NoResult name="wikis" />}
                {wikisList?.map((wiki) => (
                  <tr key={wiki._id}>
                    <td>{wiki.question}</td>
                    <td>{wiki.answer}</td>
                    <td>{wiki.category}</td>
                    <td>{getDateOnly(wiki.createdAt)}</td>
                    <td>
                      <div>
                        <select
                          name="action"
                          id={wiki._id}
                          onChange={(e) => handleSelect(e)}
                          style={styles.select}
                        >
                          <option value="">Action</option>
                          <option value="edit">Edit</option>
                          <option value="delete">Delete</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}

      <EditWiki
        onHide={() => setOpenModel(false)}
        show={openModel}
        wikis={wikisObj}
      />
      <ActionNotification
        show={action}
        handleClose={() => setAction(false)}
        handleProceed={handleDelete}
      />
    </>
  );
};

WikiList.propTypes = {
  count: PropTypes.number,
  searchTerms: PropTypes.string,
};

export default WikiList;
