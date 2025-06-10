/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogPosts } from "../../redux/reducers/blogReducer";
import { Row } from "react-bootstrap";
import BlogCard from "./BlogCard";
import Headline from "../shared/Headline";
import BlogSidebar from "./BlogSidebar";
import "./Blogs.css";
import PageLoader from "../dashboard/shared/PageLoader";

const Blogs = () => {
  // fetch blog posts
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  const blogsData = useSelector((state) => state.blogReducer.posts.posts);
  const status = useSelector((state) => state.blogReducer.status);

  // update component state
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    if (blogsData) {
      setBlogs(blogsData);
    } else {
      setBlogs([]);
    }
  }, [blogsData]);

  // open blog in new tab on click
  const openBlog = (title) => {
    window.open(`/blog/${title.replaceAll(" ", "-")}`, "_blank");
  };
  return (
    <>
      <div className="container-fluid">
        <Headline spacer="118px 0 0 30px" text="Blogs" align="left" />
        <div className="row">
          <div className="col-md-9 col-sm-12">
            <div className="container my-5 ">
              {status === "loading" && <PageLoader />}
              <Row xs={1} md={2} className="gap-4 px-4">
                {blogs?.map((blog) => (
                  <BlogCard
                    func={() => openBlog(blog.title)}
                    key={blog._id}
                    title={blog.title}
                    //  shorten description
                    content={blog.postSummary.substring(0, 300) + "..."}
                    img={blog.imageUrl}
                  />
                ))}
              </Row>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 ">
            <BlogSidebar blogsData={blogs} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Blogs;
