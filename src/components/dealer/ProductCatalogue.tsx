import { useState, useEffect } from 'react';
import { Product, PricingConfig, CartItem } from '../../types';
import { Search, Filter, Plus } from 'lucide-react';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Silver Chain 24 inch',
    category: 'Chains',
    available_sizes: ['22", 24", 26"'],
    base_weight: 15.5,
    stock_quantity: 50,
    making_charges: 250,
    is_active: true,
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

interface ProductCatalogueProps {
  onCartUpdate: (count: number) => void;
}

export function ProductCatalogue({ onCartUpdate }: ProductCatalogueProps) {
  const [products] = useState<Product[]>(mockProducts);
  const [pricing] = useState<PricingConfig | null>(mockPricing);
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
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

function ProductCard({ product, rate, onAddToCart }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden active:scale-[0.98] transition-transform">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
            <p className="text-xs text-slate-500">{product.category}</p>
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
      </div>
    </div>
  );
}
