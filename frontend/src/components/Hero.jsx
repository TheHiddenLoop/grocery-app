import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 min-h-[calc(100vh-65px)] flex items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
        
        <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-primary/10 text-primary text-sm font-semibold mx-auto md:mx-0">
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
              to="#"
              className="px-7 py-3 rounded-xl bg-primary font-semibold text-white
              flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              Shop Now <ArrowRight size={18} />
            </Link>

            <Link
              to="#"
              className="px-7 py-3 rounded-xl border border-border
              font-medium text-text-primary hover:bg-primary-bg transition"
            >
              View Deals
            </Link>
          </div>
        </div>

        <div className="hidden md:flex justify-center">
          <div
            className="relative w-72 lg:w-80 h-72 lg:h-80 rounded-3xl
            bg-linear-to-br from-primary/20 to-accent/20
            border border-border flex items-center justify-center"
          >
            <span className="text-text-secondary text-sm">
              Product Preview / Banner
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
