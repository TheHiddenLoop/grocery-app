import GroceryCategories from "@/app/components/GroceryCategories";
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import FeaturedSection from "@/app/components/ProductSample";

const Page = () => {
  return (
    <section
      className="relative bg-bg-primary overflow-hidden ">
      <Header />
      <Hero />
      <GroceryCategories />
      <FeaturedSection />
    </section>
  );
};

export default Page;