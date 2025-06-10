/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFrontPageProduct } from "../../../../redux/reducers/frontPageProductsReducer";
import PageLoader from "../../shared/PageLoader";
import "./Editor.css"; // Import the CSS file
import apiClient from "../../../../lib/axios";

const ProductPageEditor = () => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const pageProducts = useSelector(
    (state) => state?.frontPageProduct?.pageProducts || []
  );

  console.log("products", pageProducts)

  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    category: "",
    productName: "",
    description: "",
    image: "",
    benefits: [],
    features: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openAddProduct, setOpenAddProduct] = useState(false);

  useEffect(() => {
    dispatch(fetchFrontPageProduct());
  }, [dispatch]);

  const handleEditChange = (field, value) => {
    setEditingProduct({
      ...editingProduct,
      [field]: value,
    });
  };

  const handleBenefitChange = (index, value) => {
    const updatedBenefits = [...editingProduct.benefits];
    updatedBenefits[index] = value;
    setEditingProduct({ ...editingProduct, benefits: updatedBenefits });
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...editingProduct.features];
    updatedFeatures[index] = value;
    setEditingProduct({ ...editingProduct, features: updatedFeatures });
  };

  // reset message after 5 seconds
  const resetMessage = () => {
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  // handle save product
  const handleSave = async () => {
    setLoading(true);
    try {
      // Save the updated product details
      const url = `/products-front-page/update-product/${editingProduct._id}`;

      const response = await apiClient.post(url, editingProduct);

      if (response) {
        setMessage("Product updated successfully");
        resetMessage();
        setLoading(false);
        // fetch updated product
        dispatch(fetchFrontPageProduct());
      } else {
        setMessage("Failed to update product");
        resetMessage();
        setLoading(false);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again");
      resetMessage();
      setLoading(false);
      throw new Error(error.message);
    }
  };

  // handle delete product
  const handleDeleteProduct = async (productId) => {
    setLoading(true);
    // Handle product deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        // Delete the product
        const url = `/products-front-page/delete-product/${productId}`;

        const response = await apiClient.delete(url);

        if (response) {
          setMessage("Product deleted successfully");
          resetMessage();
          setLoading(false);
          // fetch updated product
          dispatch(fetchFrontPageProduct());

          // show next product after deleting current product
          if (currentProductIndex === pageProducts.length - 1) {
            setCurrentProductIndex(currentProductIndex - 1);
          } else {
            setCurrentProductIndex(currentProductIndex);
          }
        } else {
          setMessage("Failed to delete product");
          resetMessage();
          setLoading(false);
        }
      } catch (error) {
        setMessage("An error occurred. Please try again");
        resetMessage();
        setLoading(false);
        throw new Error(error.message);
      }
    }
  };

  // handle next product
  const handleNext = () => {
    if (currentProductIndex < pageProducts.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1);
      setEditingProduct(null);
    }
  };

  // handle previous product
  const handlePrevious = () => {
    if (currentProductIndex > 0) {
      setCurrentProductIndex(currentProductIndex - 1);
      setEditingProduct(null);
    }
  };

  // handle open add product
  const handleOpenAddProduct = () => {
    // toggle openAddProduct state
    setOpenAddProduct(!openAddProduct);
  };

  // handle add product
  const handleAddProduct = async (e) => {
    setLoading(true);
    e.preventDefault();
    // Handle adding new product
    try {
      const url = `/products-front-page/add-product`;
    

      const response = await apiClient.post(url, newProduct);

      if (response) {
        setMessage("Product added successfully");
        resetMessage();
        setLoading(false);
        // fetch updated product
        dispatch(fetchFrontPageProduct());
        setNewProduct({
          category: "",
          productName: "",
          description: "",
          image: "",
          benefits: [],
          features: [],
        });
        //   setOpenAddProduct(false);
      } else {
        setMessage("Failed to add product");
        resetMessage();
        setLoading(false);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again");
      resetMessage();
      setLoading(false);
      throw new Error(error.message);
    }
  };

  const currentProduct = pageProducts[currentProductIndex];

  return (
    <div className="container">

      {/* Side Menu */}
    <div className="side-menu">
      <h3>Products</h3>
      <ul className="product-list">
        {pageProducts.map((product, index) => (
          <li
            key={product._id}
            className={`product-item ${index === currentProductIndex ? "active" : ""}`}
            onClick={() => {
              setCurrentProductIndex(index);
              setEditingProduct(null); // Reset editing mode
            }}
          >
            {product.productName}
          </li>
        ))}
      </ul>
    </div>

      {/* main content */}
      <div className="main-content">
        {!openAddProduct ? (
          <div className="section">
            {currentProduct && (
              <div className="product-section">
                <div className="btnContainer">
                  <h2 className="heading">{currentProduct.productName}</h2>

                  <button className="button" onClick={handleOpenAddProduct}>
                    Add New Product
                  </button>
                </div>
                {editingProduct ? (
                  <div className="form">
                    <input
                      className="input"
                      type="text"
                      value={editingProduct.productName}
                      onChange={(e) =>
                        handleEditChange("productName", e.target.value)
                      }
                    />
                    <textarea
                      className="textarea"
                      value={editingProduct.description}
                      onChange={(e) =>
                        handleEditChange("description", e.target.value)
                      }
                    />
                    <input
                      className="input"
                      type="text"
                      value={editingProduct.image}
                      onChange={(e) => handleEditChange("image", e.target.value)}
                    />
                    <h3>Benefits:</h3>
                    {editingProduct.benefits.map((benefit, index) => (
                      <input
                        key={index}
                        className="input"
                        type="text"
                        value={benefit}
                        onChange={(e) =>
                          handleBenefitChange(index, e.target.value)
                        }
                      />
                    ))}
                    <h3>Features:</h3>
                    {editingProduct.features.map((feature, index) => (
                      <input
                        key={index}
                        className="input"
                        type="text"
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                      />
                    ))}

                    {message && <p className="notification">{message}</p>}
                    {loading && <PageLoader width="50px" />}
                    <button className="button" onClick={handleSave}>
                      Save
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text">{currentProduct.description}</p>
                    <img
                      className="image"
                      src={currentProduct.image}
                      alt={currentProduct.productName}
                    />
                    <h3>Benefits:</h3>
                    <ul className="list">
                      {currentProduct.benefits.map((benefit, index) => (
                        <li key={index} className="text">
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <h3>Features:</h3>
                    <ul className="list">
                      {currentProduct.features.map((feature, index) => (
                        <li key={index} className="text">
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {message && <p className="notification">{message}</p>}

                    <button
                      className="button"
                      onClick={() => setEditingProduct(currentProduct)}
                    >
                      Edit
                    </button>
                    <button
                      className="button button-danger"
                      onClick={() => handleDeleteProduct(currentProduct._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}

                <div className="btnContainer">
                  <button
                    className="button"
                    onClick={handlePrevious}
                    disabled={currentProductIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    className="button"
                    onClick={handleNext}
                    disabled={currentProductIndex === pageProducts.length - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ marginTop: "20px" }} className="section">
            <div className="btnContainer">
              <h2 className="heading">Add New Product</h2>

              <button className="button" onClick={handleOpenAddProduct}>
                Close Add Product
              </button>
            </div>

            <form className="form" onSubmit={handleAddProduct}>
              <input
                className="input"
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              />
              <input
                className="input"
                type="text"
                placeholder="Product Name"
                value={newProduct.productName}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, productName: e.target.value })
                }
              />
              <textarea
                className="textarea"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
              />
              <input
                className="input"
                type="text"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
              />
              <textarea
                className="textarea"
                placeholder="Benefits (comma separated)"
                value={newProduct.benefits.join(", ")}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    benefits: e.target.value.split(", "),
                  })
                }
              />
              <textarea
                className="textarea"
                placeholder="Features (comma separated)"
                value={newProduct.features.join(", ")}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    features: e.target.value.split(", "),
                  })
                }
              />

              {message && <p className="notification">{message}</p>}
              {loading && <PageLoader width="50px" />}
              <button className="button" type="submit">
                Add Product
              </button>
            </form>
          </div>
        )}
      </div>
    
    </div>
  );
};

export default ProductPageEditor;
