/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSelectedProduct } from "../../../../redux/reducers/productReducer";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PageLoader from "../../shared/PageLoader";
import { toast } from "react-toastify";
import apiClient from "../../../../lib/axios";

const EditLoanProduct = (props) => {
  const dispatch = useDispatch();
  const product = props.product;

  const [isLoading, setIsLoading] = useState(false);

  // form state
  const [updateValue, setUpdateValue] = useState(null);

  useEffect(() => {
    if (product) {
      apiClient.get(`/product/${product._id}`).then(({ data }) => {
        setUpdateValue({
          interestRate: data.product.interestRate,
          productTitle: data.product.productTitle,
          bankoneProductName: data.bankoneDetails.ProductName,
        });
      });
    }
  }, [product]);

  const clearForm = () => {
    setUpdateValue(null);
  };

  // close model box
  const handleClose = () => {
    props.onHide();
    clearForm();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setUpdateValue({ ...updateValue, [name]: value });
  };

  // submit update to api endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const updatedProduct = {
        productCode: product.productCode,
        productTitle: updateValue.productTitle,
        interestRate: updateValue.interestRate,
      };

      await apiClient.put(`/product/products/${product._id}`, updatedProduct);
      await dispatch(fetchSelectedProduct());
      clearForm();
      handleClose();
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Loan Product
        </Modal.Title>
      </Modal.Header>
      {updateValue ? (
        <>
          <Modal.Body>
            {/* edit form */}
            <form>
              <div className="FieldRow">
                <div className="FieldGroup">
                  <label htmlFor="productName">Product</label>
                  <input
                    type="text"
                    name="bankoneProductName"
                    id="bankoneProductName"
                    className="Input"
                    value={updateValue.bankoneProductName}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>
              <div className="FieldRow">
                <div className="FieldGroup">
                  <label htmlFor="productTitle">Product Title</label>
                  <input
                    type="text"
                    name="productTitle"
                    id="productTitle"
                    className="Input"
                    value={updateValue.productTitle}
                    onChange={handleChange}
                  />
                </div>

                <div className="FieldGroup">
                  <label htmlFor="interestRate">Interest Rate </label>
                  <input
                    type="text"
                    name="interestRate"
                    id="interestRate"
                    className="Input"
                    value={updateValue.interestRate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary d-flex"
              type="button"
              onClick={handleSubmit}
            >
              {isLoading ? <PageLoader width="20px" /> : null}
              Update
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <div className="p-5">
          <PageLoader width="30px" />
        </div>
      )}
    </Modal>
  );
};

export default EditLoanProduct;
