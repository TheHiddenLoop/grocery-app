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
import { fetchCart } from "../features/cart/cartSlice";

const Home = ({cartCount}) => {

  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  useEffect(() => {
    dispatch(fetchCart());
    
  }, [dispatch]);  
  
    const { cartItems } = useSelector((state) => state.cart);
    
  return (
    <section
      className="relative bg-bg-primary overflow-hidden ">
      <Header cartCount={cartItems.length || 0}/>
      <Hero />
      <GroceryCategories />
      <TopDeals />
      <WhyChooseUs />
      <CustomerReviews />
      <Footer />
    </section>
  );
};

export default Home;