import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSelectedProduct } from "../../../../redux/reducers/productReducer";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import PageLoader from "../../shared/PageLoader";
import EditLoanProduct from "./EditLoanProduct";
import ActionNotification from "../../shared/ActionNotification";
import NoResult from "../../../shared/NoResult";
// function
import searchList from "../../../../../utilities/searchListFunc";
import TableOptionsDropdown from "../../shared/tableOptionsDropdown/TableOptionsDropdown";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FcCancel } from "react-icons/fc";
import apiClient from "../../../../lib/axios";
// custom hook
import usePaginatedData from "../../../../customHooks/usePaginationData";

const LoanProductsList = ({
  count,
  searchTerm,
  setTotalPages,
  currentPage,
  admin,
  adminRoles,
}) => {
   // styles
   const styles = {
    head: {
      color: "#fff",
      fontSize: "1.2rem",
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

  // fetch products
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSelectedProduct());
  }, [dispatch]);

  const products = useSelector((state) => state.productReducer.products);

  const status = useSelector((state) => state.productReducer.status);
  const [productsList, setProductsList] = useState(products);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [showEditModel, setShowEditModel] = useState(false);
  const [action, setAction] = useState(false);

  // update productsList to show 5 products on page load
  // or when count changes
  // custom pagination update
  const { paginatedData: paginatedProductsList, totalPages } = usePaginatedData(
    products,
    count,
    currentPage
  );

  useEffect(() => {
    setProductsList(paginatedProductsList); // Update local state with paginated data
  }, [paginatedProductsList]);

  useEffect(() => {
    setTotalPages(totalPages); // Update total pages when it changes
  }, [totalPages, setTotalPages]);

  // update productsList on search
  const handleSearch = () => {
    const currProducts = searchList(products, searchTerm, "productName");
    setProductsList(currProducts?.slice(0, count));
  };
  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  // handle delete action
  const handleDelete = async (productId) => {
    const apiUrl = import.meta.env.VITE_BASE_URL;
    await fetch(`${apiUrl}/api/product/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    dispatch(fetchSelectedProduct());
    setAction(false);
  };

  const getTableOptions = (product) => {
    const tableOptions = [
      {
        className: "text-primary",
        icon: <IoMdCheckmarkCircleOutline />,
        label: "Edit",
        isDisabled: false,
        func: () => {
          setSelectedProduct(product);
          setShowEditModel(true);
        },
      },
      {
        className: "text-danger",
        icon: <FcCancel />,
        label: "Delete",
        isDisabled: false,
        func: async () => {
          setSelectedProduct(product);
          setAction(true);
        },
      },
    ];

    return tableOptions;
  };

  return (
    <>
      {status === "loading" ? (
        <PageLoader />
      ) : (
        <div>
          <DashboardHeadline
            height="52px"
            mspacer="2rem 0 -2.95rem -1rem"
            bgcolor="#145098"
          ></DashboardHeadline>
          <div style={styles.table}>
            <Table borderless hover responsive="sm">
              <thead style={styles.head}>
                <tr>
                  <th>Code</th>
                  <th>Product Name</th>
                  <th>Annual Interest Rate</th>

                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {productsList?.length === 0 && <NoResult name="Product" />}
                {productsList?.map((product) => (
                  <tr key={product._id}>
                    <td>{product?.productCode}</td>
                    <td>{product?.productTitle}</td>
                    <td>{product?.interestRate}</td>

                    <td>
                      <TableOptionsDropdown
                        items={getTableOptions(product)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}

      {/* edit loan product modal */}
      <EditLoanProduct
        show={showEditModel}
        product={selectedProduct}
        onHide={() => setShowEditModel(false)}
      />
      <ActionNotification
        show={action}
        handleClose={() => setAction(false)}
        handleProceed={async () => {
          await handleDelete(selectedProduct._id);
        }}
      />
    </>
  );
};

LoanProductsList.propTypes = {
  count: PropTypes.number,
  searchTerm: PropTypes.string,
  admin: PropTypes.string,
  adminRoles: PropTypes.array,
};

export default LoanProductsList;
