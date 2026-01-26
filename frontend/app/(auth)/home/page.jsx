import CustomerReviews from "@/app/components/CustomerReviews";
import Footer from "@/app/components/Footer";
import GroceryCategories from "@/app/components/GroceryCategories";
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import FeaturedSection from "@/app/components/ProductSample";
import WhyChooseUs from "@/app/components/WhyChooseUs";

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