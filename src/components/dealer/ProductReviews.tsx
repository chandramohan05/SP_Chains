import { useState, useMemo } from 'react';
import { Star, User } from 'lucide-react';
import { Review } from '../../types';

interface ReviewWithDealer extends Review {
  dealer_name?: string;
}

interface ProductReviewsProps {
  productId: string;
  reviews: ReviewWithDealer[];
}

export function ProductReviews({ productId, reviews }: ProductReviewsProps) {
  const [showAll, setShowAll] = useState(false);

  const productReviews = useMemo(
    () => reviews.filter(r => r.product_id === productId),
    [reviews, productId]
  );

  const displayedReviews = showAll
    ? productReviews
    : productReviews.slice(0, 3);

  const averageRating = productReviews.length
    ? (
        productReviews.reduce((sum, r) => sum + r.rating, 0) /
        productReviews.length
      ).toFixed(1)
    : '0.0';

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => {
    const count = productReviews.filter(r => r.rating === rating).length;
    return {
      rating,
      count,
      percentage: productReviews.length
        ? (count / productReviews.length) * 100
        : 0
    };
  });

  if (productReviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-600">No reviews yet</p>
        <p className="text-xs text-slate-500 mt-1">
          Be the first to review this product
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-start gap-6 pb-4 border-b border-slate-200">
        <div className="text-center">
          <div className="text-4xl font-bold text-slate-900">
            {averageRating}
          </div>
          <div className="flex justify-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(Number(averageRating))
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {productReviews.length} reviews
          </p>
        </div>

        <div className="flex-1 space-y-1">
          {ratingCounts.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-xs text-slate-600 w-8">
                {rating} ★
              </span>
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 w-8 text-right">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {displayedReviews.map(review => (
          <div key={review.id} className="border-b pb-4 last:border-0">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-slate-900">
                    {review.dealer_name ?? 'Verified Buyer'}
                  </p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {review.review_text && (
                  <p className="text-sm text-slate-700">
                    {review.review_text}
                  </p>
                )}

                <p className="text-xs text-slate-500 mt-2">
                  {new Date(review.created_at).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toggle */}
      {productReviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-sm font-medium text-amber-600 hover:text-amber-700"
        >
          {showAll
            ? 'Show less'
            : `Show all ${productReviews.length} reviews`}
        </button>
      )}
    </div>
  );
}
