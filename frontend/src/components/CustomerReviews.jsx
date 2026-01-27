import { Star, Quote } from 'lucide-react';
import { reviews } from '../data/featuredProduct';

export default function CustomerReviews() {
  

  const StarRating = ({ rating }) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating
                ? 'fill-warning text-warning'
                : 'fill-none text-border'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 px-4 bg-bg-primary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            What Our Customers Say
          </h2>
          <p className="text-text-secondary">
            Trusted by thousands of happy customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="group relative bg-bg-secondary border border-border rounded-xl p-6 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-border opacity-50" />

              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  {review.image ? (
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-12 h-12 rounded-full border-2 border-primary object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                      <span className="text-primary font-semibold text-sm">
                        {review.avatar}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-text-primary font-semibold">
                      {review.name}
                    </h3>
                    <p className="text-text-secondary text-xs">
                      {review.date}
                    </p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>

                {/* Review Text */}
                <p className="text-text-secondary text-sm leading-relaxed pl-16">
                  "{review.review}"
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-bg-secondary border border-border rounded-full px-6 py-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="w-5 h-5 fill-warning text-warning"
                />
              ))}
            </div>
            <span className="text-text-primary font-semibold">
              5.0
            </span>
            <span className="text-text-secondary text-sm">
              (2,500+ Reviews)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}