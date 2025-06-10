// import PropTypes from "prop-types";
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchFrontPageProduct } from "../../redux/reducers/frontPageProductsReducer";
// // animation library
// import AOS from "aos";
// import "aos/dist/aos.css";
// // import data from "../../mockdatabase/products.json";
// import Headline from "../shared/Headline";
// import Header from "../shared/Header";
// import TopCard from "../shared/TopCard";
// import ProductBtn from "../ourproductpage/ProductBtn";
// import "../ourproductpage/OurProduct.css";
// import ProductImage from "./ProductImage";
// import ProductListCard from "./ProductListCard";

// const OurProduct = ({ productTitle, headerImg }) => {
//   // fetch loan product
//   const dispatch = useDispatch();
//   const pageProducts = useSelector(
//     (state) => state?.frontPageProduct?.pageProducts
//   );

//   useEffect(() => {
//     dispatch(fetchFrontPageProduct());
//   }, [dispatch]);
// console.log("Products", pageProducts)
//   // filter using productTitle
//   const currentProduct = pageProducts.find(
//     (product) =>
//       product.productName.toLowerCase() === productTitle.toLowerCase()
//   );

//   const { image, productName, description, benefits, features } = currentProduct;

//   // component state
//   const [img, setImg] = useState(image);
//   const [name, setName] = useState(productName);
//   const [desc, setDesc] = useState(description);
//   const [benefit, setBenefit] = useState(benefits);
//   const [feature, setFeature] = useState(features);

//   // create object of products, key is category and value is array of products
//   const productsByCategory = pageProducts.reduce((acc, product) => {
//     if (!acc[product.category]) {
//       acc[product.category] = [];
//     }
//     acc[product.category].push(product);
//     return acc;
//   }, {});

//   // function to handle button click and change image, description, benefits and features
//   const changeProduct = (id) => {
//     const product = pageProducts.find((product) => product._id === id);
//     setImg(product.image);
//     setName(product.productName);
//     setDesc(product.description);
//     setBenefit(product.benefits);
//     setFeature(product.features);
//   };

//   useEffect(() => {
//     AOS.init({
//       duration: 2000,
//     });
//   }, []);

//   return (
//     <>
//       <Header imgurl={headerImg} />
//       <div className="container">
//         <div className="row">
//           {/* left side container */}
//           <div className="col-md-8 col-sm-12">
//             {/* top row container */}
//             <div className="row">
//               <div className="col-md-6 col-sm-12">
//                 <div className="ProductTitle">
//                   <Headline
//                     color="#593d0e"
//                     spacer="18px 0 78px 0"
//                     text={name}
//                   />
//                 </div>
//                 <ProductImage url={img} altText={name} />
//               </div>
//               <div className="col-md-6 col-sm-12">
//                 <TopCard
//                   size="18px"
//                   align="left"
//                   spacer={"28px 0"}
//                   text={desc}
//                 />
//               </div>
//             </div>

//             {/* bottom row container */}
//             <div className="row" data-aos="fade-up">
//               <div className="col-md-6 col-sm-12 DetailsCard">
//                 <Headline
//                   color="#593d0e"
//                   size="18px"
//                   spacer="18px"
//                   align="left"
//                   text="Benefits"
//                 />
//                 {benefit.map((benefit) => (
//                   <ProductListCard key={benefit} li={benefit} />
//                 ))}
//               </div>
//               <div className="col-md-6 col-sm-12 DetailsCard">
//                 <Headline
//                   color="#593d0e"
//                   size="18px"
//                   spacer="18px"
//                   align="left"
//                   text="Features"
//                 />
//                 {feature.map((feature) => (
//                   <ProductListCard key={feature} li={feature} />
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* right side container */}
//           <div className="col-md-4 col-sm-12 Category">
//             {Object.keys(productsByCategory).map((category) => {
//               return (
//                 <div key={category} data-aos="fade-up">
//                   <Headline
//                     color="#fff"
//                     spacer="8px 0"
//                     text={category.toUpperCase()}
//                   />
//                   <div className="BtnContainer">
//                     {productsByCategory[category].map(({ _id, productName }) => (
//                       <ProductBtn
//                         key={_id}
//                         text={productName}
//                         func={() => changeProduct(_id)}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// OurProduct.propTypes = {
//   headerImg: PropTypes.string,
//   productTitle: PropTypes.shape({
//     toLowerCase: PropTypes.func,
//   }),
// };

// export default OurProduct;

import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Headline from "../shared/Headline";
import Header from "../shared/Header";
import TopCard from "../shared/TopCard";
import ProductBtn from "../ourproductpage/ProductBtn";
import "../ourproductpage/OurProduct.css";
import ProductImage from "./ProductImage";
import ProductListCard from "./ProductListCard";
import PageLoader from "../dashboard/shared/PageLoader";

const OurProduct = ({ productTitle, headerImg }) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const API_ENDPOINT = `${apiUrl}/api/products-front-page/fetch-all`;
  const [loading, setLoading] = useState(false);
  const [pageProducts, setPageProduct] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINT);
      if (response.ok) {
        const data = await response.json();
        setPageProduct(data);
        setLoading(false);
      } else {
        throw new Error("Error fetching products");
      }
    } catch (error) {
      console.error("Error fetching products", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  const currentProduct = useMemo(() => {
    if (selectedProductId) {
      return pageProducts.find((product) => product._id === selectedProductId);
    }
    return pageProducts.find(
      (product) =>
        product.productName.toLowerCase() === productTitle.toLowerCase()
    );
  }, [pageProducts, productTitle, selectedProductId]);

  const productsByCategory = useMemo(() => {
    return pageProducts.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});
  }, [pageProducts]);

  if (loading) {
    return (
      <div className="m-5">
        <PageLoader />
      </div>
    );
  }

  if (!currentProduct) {
    return <div>Product not found</div>;
  }

  const handleOpenProduct = (id) => {
    setSelectedProductId(id);
  };

  const { image, productName, description, benefits, features } =
    currentProduct;

  return (
    <>
      <Header imgurl={headerImg} />
      <div className="container">
        <div className="row">
          {/* Left side container */}
          <div className="col-md-8 col-sm-12">
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="ProductTitle">
                  <Headline
                    color="#593d0e"
                    spacer="18px 0 78px 0"
                    text={productName}
                  />
                </div>
                <ProductImage url={image} altText={productName} />
              </div>
              <div className="col-md-6 col-sm-12">
                <TopCard
                  size="18px"
                  align="left"
                  spacer={"28px 0"}
                  text={description}
                />
              </div>
            </div>

            <div className="row" data-aos="fade-up">
              <div className="col-md-6 col-sm-12 DetailsCard">
                <Headline
                  color="#593d0e"
                  size="18px"
                  spacer="18px"
                  align="left"
                  text="Benefits"
                />
                {benefits.map((benefit, index) => (
                  <ProductListCard key={index} li={benefit} />
                ))}
              </div>
              <div className="col-md-6 col-sm-12 DetailsCard">
                <Headline
                  color="#593d0e"
                  size="18px"
                  spacer="18px"
                  align="left"
                  text="Features"
                />
                {features.map((feature, index) => (
                  <ProductListCard key={index} li={feature} />
                ))}
              </div>
            </div>
          </div>

          {/* Right side container */}
          <div className="col-md-4 col-sm-12 Category">
            {Object.keys(productsByCategory).map((category) => (
              <div key={category} data-aos="fade-up">
                <Headline
                  color="#fff"
                  spacer="8px 0"
                  text={category.toUpperCase()}
                />
                <div className="BtnContainer">
                  {productsByCategory[category].map(({ _id, productName }) => (
                    <ProductBtn
                      key={_id}
                      text={productName}
                      func={() => handleOpenProduct(_id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

OurProduct.propTypes = {
  headerImg: PropTypes.string,
  productTitle: PropTypes.string,
};

export default OurProduct;
