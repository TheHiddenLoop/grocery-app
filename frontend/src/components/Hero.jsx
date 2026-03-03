import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-[url('/images/1265794_519.avif')] bg-cover bg-center min-h-[calc(100vh-65px)] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">

        <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-bg-primary/70 text-primary text-sm font-semibold mx-auto md:mx-0">
            <Sparkles className="w-4 h-4" />
            Fresh • Affordable • Trusted
          </div>

          <h1
            className="font-extrabold leading-tight text-text-primary
            text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px]"
          >
            Groceries that are <br />
            <span className="text-primary">Fresh & Fairly Priced</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-xl mx-auto md:mx-0">
            Daily essentials sourced fresh and delivered fast.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">

            <Link
              to="/products"
              className="
                px-7 py-3 rounded-xl
                bg-primary text-white font-semibold
                flex items-center justify-center gap-2
                hover:bg-secondary
                hover:scale-[1.02]
                transition
              "
            >
              Shop Now <ArrowRight size={18} />
            </Link>

            <Link
              to="#deals"
              className="
                px-7 py-3 rounded-xl
                border border-border-dark
                bg-bg-secondary/70 backdrop-blur
                text-text-primary font-medium
                hover:bg-bg-secondary
                transition
              "
            >
              View Deals
            </Link>

          </div>
        </div>

        <div className="hidden md:flex justify-end items-center">
          <div className="relative w-full max-w-md h-112.5">

            <div className="absolute bottom-0 right-0 w-64 h-80 rounded-3xl overflow-hidden border-2 border-border shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=600&fit=crop"
                alt="Fresh Vegetables"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg-primary/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg">Fresh Veggies</h3>
                <p className="text-text-secondary text-sm">Daily Farm Fresh</p>
              </div>
            </div>

            <div className="absolute top-16 right-16 w-64 h-80 rounded-3xl overflow-hidden border-2 border-border shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&h=600&fit=crop"
                alt="Fresh Fruits"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg-primary/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg">Exotic Fruits</h3>
                <p className="text-text-secondary text-sm">Imported Quality</p>
              </div>
            </div>

            <div className="absolute top-0 left-0 w-64 h-80 rounded-3xl overflow-hidden border-2 border-primary shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=600&fit=crop"
                alt="Dairy Products"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg-primary/90 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg">Dairy Fresh</h3>
                <p className="text-text-secondary text-sm">100% Pure</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
