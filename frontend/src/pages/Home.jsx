import CustomerReviews from "../components/CustomerReviews";
import Footer from "../components/Footer";
import GroceryCategories from "../components/GroceryCategories";
import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedSection from "../components/ProductSample";
import WhyChooseUs from "../components/WhyChooseUs";

const Page = () => {
  return (
    <section
      className="relative bg-bg-primary overflow-hidden ">
      <Header />
      <Hero />
      <GroceryCategories />
      <FeaturedSection />
      <WhyChooseUs />
      <CustomerReviews />
      <Footer />
    </section>
  );
};

export default Page;