import { useEffect } from "react";
import CustomerReviews from "../components/CustomerReviews";
import Footer from "../components/Footer";
import GroceryCategories from "../components/GroceryCategories";
import Header from "../components/Header";
import Hero from "../components/Hero";
import TopDeals from "../components/ProductSample";
import WhyChooseUs from "../components/WhyChooseUs";
import {useDispatch, useSelector} from "react-redux"
import { getProduct } from "../features/product/productSlice";

const Page = () => {

  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);  
  

  return (
    <section
      className="relative bg-bg-primary overflow-hidden ">
      <Header />
      <Hero />
      <GroceryCategories />
      <TopDeals />
      <WhyChooseUs />
      <CustomerReviews />
      <Footer />
    </section>
  );
};

export default Page;