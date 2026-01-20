import { useState, useEffect } from 'react';
import { Product, PricingConfig, CartItem, Review } from '../../types';
import { Search, Filter, Plus, Star } from 'lucide-react';
import { ProductReviews } from './ProductReviews';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Silver Chain 24 inch',
    category: 'Chains',
    available_sizes: ['22"', '24"', '26"'],
    base_weight: 15.5,
    stock_quantity: 50,
    making_charges: 250,
    is_active: true,

    weight_per_inch: 0.65,
    wastage_percent: 5,
    purity_percent: 92.5,
    size_range_start: 22,
    size_range_end: 26,
    size_increment: 2,

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Silver Bracelet',
    category: 'Bracelets',
    available_sizes: ['S', 'M', 'L'],
    base_weight: 12.3,
    stock_quantity: 30,
    making_charges: 200,
    is_active: true,

    weight_per_inch: 0.5,
    wastage_percent: 4,
    purity_percent: 92.5,
    size_range_start: 6,
    size_range_end: 8,
    size_increment: 1,

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Silver Ring',
    category: 'Rings',
    available_sizes: ['6', '7', '8', '9'],
    base_weight: 8.5,
    stock_quantity: 100,
    making_charges: 150,
    is_active: true,

    weight_per_inch: 0,
    wastage_percent: 3,
    purity_percent: 92.5,
    size_range_start: 6,
    size_range_end: 9,
    size_increment: 1,

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Silver Pendant',
    category: 'Pendants',
    available_sizes: ['One Size'],
    base_weight: 6.2,
    stock_quantity: 75,
    making_charges: 180,
    is_active: true,

    weight_per_inch: 0,
    wastage_percent: 4,
    purity_percent: 92.5,
    size_range_start: 0,
    size_range_end: 0,
    size_increment: 0,

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Silver Earrings',
    category: 'Earrings',
    available_sizes: ['One Size'],
    base_weight: 4.8,
    stock_quantity: 60,
    making_charges: 120,
    is_active: true,

    weight_per_inch: 0,
    wastage_percent: 3,
    purity_percent: 92.5,
    size_range_start: 0,
    size_range_end: 0,
    size_increment: 0,

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Silver Anklet',
    category: 'Anklets',
    available_sizes: ['S', 'M', 'L'],
    base_weight: 10.5,
    stock_quantity: 40,
    making_charges: 220,
    is_active: true,

    weight_per_inch: 0.7,
    wastage_percent: 5,
    purity_percent: 92.5,
    size_range_start: 8,
    size_range_end: 10,
    size_increment: 1,

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];


const mockPricing: PricingConfig = {
  id: '1',
  mcx_rate: 75.50,
  premium_percentage: 2.5,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockReviews: Review[] = [
  {
    id: '1',
    product_id: '1',
    dealer_id: '2',
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
    dealer_id: '3',
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
    dealer_id: '4',
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
    dealer_id: '5',
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
    dealer_id: '6',
    order_id: 'ORD005',
    rating: 5,
    review_text: 'Amazing quality and fast delivery.',
    is_synced_to_erp: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

interface ProductCatalogueProps {
  onCartUpdate: (count: number) => void;
}

export function ProductCatalogue({ onCartUpdate }: ProductCatalogueProps) {
  const [products] = useState<Product[]>(mockProducts);
  const [pricing] = useState<PricingConfig | null>(mockPricing);
  const [reviews] = useState<Review[]>(mockReviews);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories] = useState<string[]>(['Chains', 'Bracelets', 'Rings', 'Pendants', 'Earrings', 'Anklets']);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    onCartUpdate(cart.length);
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart, onCartUpdate]);

  const calculateNetRate = () => {
    if (!pricing) return 0;
    return pricing.mcx_rate * (1 + pricing.premium_percentage / 100);
  };

  const calculateRetailRate = () => {
    return calculateNetRate() * 1.01;
  };

  const addToCart = (product: Product, size: string, quantity: number) => {
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && item.size === size
    );

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      setCart(newCart);
    } else {
      setCart([...cart, { product, size, quantity }]);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Products</h2>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white text-base"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm bg-slate-50 p-3 rounded-xl">
            <div className="flex-1">
              <p className="text-slate-600">MCX Rate</p>
              <p className="font-bold text-slate-900">₹{pricing?.mcx_rate.toFixed(2)}/g</p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-slate-600">Retail Rate</p>
              <p className="font-bold text-amber-600">₹{calculateRetailRate().toFixed(2)}/g</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            rate={calculateRetailRate()}
            reviews={reviews}
            onAddToCart={addToCart}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No products found</p>
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  rate: number;
  reviews: Review[];
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

function ProductCard({ product, rate, reviews, onAddToCart }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showReviews, setShowReviews] = useState(false);

  const productReviews = reviews.filter(r => r.product_id === product.id);
  const averageRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : null;

  useEffect(() => {
    if (product.available_sizes.length > 0) {
      setSelectedSize(product.available_sizes[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (selectedSize && quantity > 0) {
      onAddToCart(product, selectedSize, quantity);
      setQuantity(1);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
            <p className="text-xs text-slate-500">{product.category}</p>
            {averageRating && (
              <button
                onClick={() => setShowReviews(!showReviews)}
                className="flex items-center gap-1 mt-1 text-xs text-amber-600 hover:text-amber-700 transition-colors"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-medium">{averageRating}</span>
                <span className="text-slate-500">({productReviews.length})</span>
              </button>
            )}
          </div>
          <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
            product.stock_quantity > 0
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {product.stock_quantity > 0 ? `${product.stock_quantity}` : 'Out'}
          </span>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 mb-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Weight:</span>
            <span className="font-medium text-slate-900">{product.base_weight}g</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Making:</span>
            <span className="font-medium text-slate-900">₹{product.making_charges.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base pt-2 border-t border-slate-200">
            <span className="text-slate-600 font-medium">Price:</span>
            <span className="font-bold text-amber-600">
              ₹{((product.base_weight * rate) + product.making_charges).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              >
                {product.available_sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Qty</label>
              <input
                type="number"
                min="1"
                max={product.stock_quantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-center"
              />
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 active:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </div>

        {showReviews && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-slate-900">Customer Reviews</h4>
              <button
                onClick={() => setShowReviews(false)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Hide
              </button>
            </div>
            <ProductReviews productId={product.id} reviews={reviews} />
          </div>
        )}
      </div>
    </div>
  );
}
