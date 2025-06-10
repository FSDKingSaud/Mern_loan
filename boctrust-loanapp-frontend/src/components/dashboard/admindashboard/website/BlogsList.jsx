import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogPosts } from "../../../../redux/reducers/blogReducer";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import PageLoader from "../../shared/PageLoader";
import EditBlogPage from "./EditBlogPost";
import BocButton from "../../shared/BocButton";
import ActionNotification from "../../shared/ActionNotification";
import NoResult from "../../../shared/NoResult";
// function
import getDateOnly from "../../../../../utilities/getDate";
import searchList from "../../../../../utilities/searchListFunc";
import apiClient from "../../../../lib/axios";

// custom hook
import usePaginatedData from "../../../../customHooks/usePaginationData";

const BlogsList = ({ count, searchTerms, setTotalPages, currentPage })  => {
  const [modalShow, setModalShow] = useState(false);
  const [action, setAction] = useState(false);
  const [actionId, setActionId] = useState("");
  const [selectedBlog, setSelectedBlog] = useState({});
  const [canUserManage, setCanUserManage] = useState(false);

  // current login superAdmin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch the fetchBlogPosts action here
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  useEffect(() => {
    setCanUserManage(currentUser?.userRole?.can.includes("websiteManagement"));
  }, [currentUser]);

  

  // Get the blogs from the store
  const blogs = useSelector((state) => state.blogReducer.posts.posts);
  const status = useSelector((state) => state.blogReducer.status);
  // local state
  const [blogsList, setBlogsList] = useState(blogs);


  // custom pagination update
  const { paginatedData: paginatedBlogsList, totalPages } = usePaginatedData(
    blogs,
    count,
    currentPage
  );

  useEffect(() => {
    setBlogsList(paginatedBlogsList); // Update local state with paginated data
  }, [paginatedBlogsList]);

  useEffect(() => {
    setTotalPages(totalPages); // Update total pages when it changes
  }, [totalPages, setTotalPages]);

  // update blogsList to show 10 blogs on page load
  // or when count changes
  useEffect(() => {
    setBlogsList(blogs?.slice(0, count));
  }, [blogs, count]);

  // update blogsList on search
  const handleSearch = () => {
    const currSearch = searchList(blogs, searchTerms, "title");
    setBlogsList(currSearch?.slice(0, count));
  };
  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  // handle selection option change
  const handleAction = (e) => {
    const setValue = e.target.innerHTML.toLowerCase();
    const postId = e.target.id;
    setActionId(postId);

    // find single blog post
    const blog = blogs?.find((blog) => blog._id === postId);
    setSelectedBlog(blog);

    if (setValue === "edit") {
      setModalShow(true);
    } else if (setValue === "delete") {
      setAction(true);
    }
  };

  // delete blog post
  const handleDelete = async (e) => {
    e.preventDefault();

    await apiClient.delete(`/blog/posts/${actionId}`);

    setAction(false);
    dispatch(fetchBlogPosts());
  };

  const styles = {
    head: {
      color: "#fff",
      fontSize: "1rem",
      backgroundColor: "#145098",
    },
    booked: {
      color: "#145098",
    },
    completed: {
      color: "#5cc51c",
    },
    withcredit: {
      color: "#f64f4f",
    },
    withdisbursement: {
      color: "#ecaa00",
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
                  <th>Title</th>
                  <th>Summary</th>
                  <th>Category</th>
                  <th>Date Posted</th>
                  <th>Status</th>
                  {canUserManage && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {blogsList?.length === 0 && <NoResult name="blogs" />}
                {blogsList?.map((blog) => (
                  <tr key={blog._id}>
                    <td>{blog.title}</td>
                    <td>{blog.postSummary}</td>
                    <td>{blog.category}</td>
                    <td>{getDateOnly(blog.createdAt)}</td>
                    <td style={styles.completed}>Active</td>
                    {canUserManage && (
                      <td>
                        <div>
                          <BocButton
                            margin="4px"
                            bradius="8px"
                            bgcolor="#145098"
                            func={handleAction}
                            id={blog._id}
                            width="58px"
                          >
                            Edit
                          </BocButton>
                          <BocButton
                            margin="4px"
                            bradius="8px"
                            func={handleAction}
                            id={blog._id}
                            width="58px"
                          >
                            Delete
                          </BocButton>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
      <EditBlogPage
        blog={selectedBlog}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <ActionNotification
        handleClose={() => setAction(false)}
        handleProceed={handleDelete}
        show={action}
      />
    </>
  );
};

BlogsList.propTypes = {
  count: PropTypes.number,
  searchTerms: PropTypes.string,
};

export default BlogsList;
