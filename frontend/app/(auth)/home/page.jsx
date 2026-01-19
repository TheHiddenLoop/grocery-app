import GroceryCategories from "@/app/components/GroceryCategories";
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";

const Page = () => {
  return (
    <section
      className="relative bg-bg-primary overflow-hidden ">
      <Header />
      <Hero />
      <GroceryCategories />
    </section>
  );
};

export default Page;