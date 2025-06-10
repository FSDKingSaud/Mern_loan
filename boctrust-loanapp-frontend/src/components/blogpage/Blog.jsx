import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogPosts } from "../../redux/reducers/blogReducer";
import { useParams } from "react-router-dom";
// import blogData from "../../mockdatabase/blogs.json";
import BlogSidebar from "./BlogSidebar";
import Headline from "../shared/Headline";
import PageLoader from "../dashboard/shared/PageLoader";
import "./Blogs.css";

const Blog = () => {
  const { title } = useParams();
  const formatedTitle = title.replace(/-/g, " ");

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

  const blog = blogs?.find(
    (blog) => blog.title.toLowerCase() === formatedTitle.toLowerCase()
  );

  return (
    <>
      <div className="container-fluid SingleBlog">
        <div>
          <div className="row">
            {status === "loading" || blogs.length < 1 ? (
              <PageLoader />
            ) : (
              <div className="row">
                <div
                  className="col-md-9 col-sm-12"
                  style={{ borderRight: "1px solid blue" }}
                >
                  <div className="container my-5 ">
                    <Headline spacer="0" text={formatedTitle} align="center" />

                    <div className="BlogDetails">
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="img-fluid"
                      />
                      <div className="TagsContainer">
                        <p className="text-muted">
                          Posted on: {blog.updatedAt}
                        </p>
                        <div>
                          {blog.tags[0].split(",").map((tag, index) => (
                            <span
                              key={index}
                              className="badge bg-secondary me-2"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="BlogContent">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: blog.body,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-12">
                  <BlogSidebar blogsData={blogs} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
