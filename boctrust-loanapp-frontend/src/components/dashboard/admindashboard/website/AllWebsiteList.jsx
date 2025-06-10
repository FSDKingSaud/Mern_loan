import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
// import DashboardHeadline from "../../shared/DashboardHeadline";

const AllWebsiteList = () => {
  const styles = {
    table: {
      // margin: "0 2rem 0 3rem",
    },
    head: {
      color: "#145098",
      fontSize: "1.2rem",
      },
      img: {
        width: "30px"
    }
   
  };
  return (
    <div>
      {/* <DashboardHeadline
        height="42px"
        mspacer="2rem 0 -2.4rem -1rem"
        bgcolor="#145098"
      ></DashboardHeadline> */}
      <div style={styles.table}>
        <Table hover responsive="sm">
          <thead style={styles.head}>
            <tr>
              <th>Header</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><img src="/images/headerimg.png" style={styles.img}/></td>
              <td>Home</td>
              <td>Boc_admin</td>
              <td>Generic Page</td>
              <td>
                <select name="action" id="action">
                  <option value="">Action</option>
                  <option value="">Edit</option>
                  <option value="">View</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><img src="/images/headerimg.png" style={styles.img}/></td>
              <td>About Us</td>
              <td>Boc_admin</td>
              <td>Generic Page</td>
              <td>
                <select name="action" id="action">
                  <option value="">Action</option>
                  <option value="">Edit</option>
                  <option value="">View</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><img src="/images/headerimg.png" style={styles.img}/></td>
              <td>Loans</td>
              <td>Boc_admin</td>
              <td>Generic Page</td>
              <td>
                <select name="action" id="action">
                  <option value="">Action</option>
                  <option value="">Edit</option>
                  <option value="">View</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><img src="/images/headerimg.png" style={styles.img}/></td>
              <td>Blog</td>
              <td>Boc_admin</td>
              <td>Blog Page</td>
              <td>
                <select name="action" id="action">
                  <option value="">Action</option>
                  <option value="">Edit</option>
                  <option value="">View</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><img src="/images/headerimg.png" style={styles.img}/></td>
              <td>Contact Us</td>
              <td>Boc_admin</td>
              <td>Generic Page</td>
              <td>
                <select name="action" id="action">
                  <option value="">Action</option>
                  <option value="">Edit</option>
                  <option value="">View</option>
                </select>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AllWebsiteList;
