import { useState } from 'react';
import { Star, User, Package, Trash2 } from 'lucide-react';
import { Review } from '../../types';

const mockReviews: (Review & { dealer_name?: string; product_name?: string })[] = [
  {
    id: '1',
    product_id: '1',
    product_name: 'Silver Chain 24 inch',
    dealer_id: '2',
    dealer_name: 'Silver Star Jewellers',
    order_id: 'ORD001',
    rating: 5,
    review_text: 'Excellent quality silver chain. Very happy with the purchase. The finish is perfect and the weight is accurate.',
    is_synced_to_erp: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    product_id: '1',
    product_name: 'Silver Chain 24 inch',
    dealer_id: '3',
    dealer_name: 'Golden Ornaments Ltd',
    order_id: 'ORD002',
    rating: 4,
    review_text: 'Good product. Customers love it. Could have better packaging.',
    is_synced_to_erp: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    product_id: '3',
    product_name: 'Silver Ring',
    dealer_id: '4',
    dealer_name: 'Royal Jewellery Store',
    order_id: 'ORD003',
    rating: 5,
    review_text: 'Best silver rings in the market. My customers are very satisfied.',
    is_synced_to_erp: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    product_id: '2',
    product_name: 'Silver Bracelet',
    dealer_id: '5',
    dealer_name: 'Pearl Jewels',
    order_id: 'ORD004',
    rating: 4,
    review_text: 'Beautiful bracelet design. Good weight and finish.',
    is_synced_to_erp: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    product_id: '1',
    product_name: 'Silver Chain 24 inch',
    dealer_id: '6',
    dealer_name: 'Gems & Gold',
    order_id: 'ORD005',
    rating: 5,
    review_text: 'Amazing quality and fast delivery.',
    is_synced_to_erp: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    product_id: '4',
    product_name: 'Silver Pendant',
    dealer_id: '2',
    dealer_name: 'Silver Star Jewellers',
    order_id: 'ORD006',
    rating: 3,
    review_text: 'Decent product but expected better quality for the price.',
    is_synced_to_erp: false,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

export function ReviewManager() {
  const [reviews, setReviews] = useState(mockReviews);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(r => r.id !== reviewId));
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesRating = filterRating === 'all' || review.rating === filterRating;
    const matchesSearch =
      review.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.dealer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review_text?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Product Reviews</h2>
        <p className="text-slate-600 mt-1">Manage customer reviews and ratings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Star className="w-6 h-6 text-amber-600 fill-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Average Rating</p>
              <p className="text-2xl font-bold text-slate-900">{averageRating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Reviews</p>
              <p className="text-2xl font-bold text-slate-900">{reviews.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Unique Reviewers</p>
              <p className="text-2xl font-bold text-slate-900">
                {new Set(reviews.map(r => r.dealer_id)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Rating Distribution</h3>
        <div className="space-y-2">
          {ratingCounts.map(({ rating, count }) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm text-slate-600 w-8">{rating} ★</span>
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all"
                  style={{
                    width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%`
                  }}
                />
              </div>
              <span className="text-sm text-slate-500 w-12 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search reviews, products, or dealers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      review.is_synced_to_erp
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {review.is_synced_to_erp ? 'Synced' : 'Pending Sync'}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-900">{review.product_name}</p>
                  <p className="text-xs text-slate-500">
                    by {review.dealer_name} • {new Date(review.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {review.review_text && (
                <p className="text-sm text-slate-700 leading-relaxed mt-2">
                  {review.review_text}
                </p>
              )}
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No reviews found</p>
          </div>
        )}
      </div>
    </div>
  );
}
