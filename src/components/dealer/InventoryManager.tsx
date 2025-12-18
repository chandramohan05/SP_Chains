import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { DealerInventory, Product } from '../../types';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function InventoryManager() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<(DealerInventory & { product?: Product })[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<DealerInventory | null>(null);
  const [formData, setFormData] = useState({
    product_id: '',
    size: 4.0,
    weight: 0,
    quantity: 0
  });

  useEffect(() => {
    if (user) {
      fetchInventory();
      fetchProducts();
    }
  }, [user]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dealer_inventory')
        .select(`
          *,
          product:products(*)
        `)
        .eq('dealer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInventory(data || []);
    } catch (error: unknown) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: unknown) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('dealer_inventory')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('dealer_inventory')
          .insert([{
            dealer_id: user?.id,
            ...formData,
            last_synced: new Date().toISOString()
          }]);

        if (error) throw error;
      }

      alert(editingItem ? 'Inventory updated successfully' : 'Inventory added successfully');
      resetForm();
      fetchInventory();
    } catch (error: unknown) {
      console.error('Error saving inventory:', error);
      alert('Failed to save inventory');
    }
  };

  const handleEdit = (item: DealerInventory) => {
    setEditingItem(item);
    setFormData({
      product_id: item.product_id,
      size: item.size,
      weight: item.weight,
      quantity: item.quantity
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) return;

    try {
      const { error } = await supabase
        .from('dealer_inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Inventory deleted successfully');
      fetchInventory();
    } catch (error: unknown) {
      console.error('Error deleting inventory:', error);
      alert('Failed to delete inventory');
    }
  };

  const handleSync = async () => {
    try {
      const updates = inventory.map(item => ({
        id: item.id,
        last_synced: new Date().toISOString()
      }));

      for (const update of updates) {
        await supabase
          .from('dealer_inventory')
          .update({ last_synced: update.last_synced })
          .eq('id', update.id);
      }

      alert('Inventory synced successfully');
      fetchInventory();
    } catch (error: unknown) {
      console.error('Error syncing inventory:', error);
      alert('Failed to sync inventory');
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: '',
      size: 4.0,
      weight: 0,
      quantity: 0
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const generateSizeOptions = () => {
    const sizes = [];
    for (let i = 4.0; i <= 12.5; i += 0.25) {
      sizes.push(i);
    }
    return sizes;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">My Inventory</h2>
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Package className="w-5 h-5" />
            Sync Stock
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
          >
            <Plus className="w-5 h-5" />
            Add Stock
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            {editingItem ? 'Edit Inventory' : 'Add New Inventory'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Product
              </label>
              <select
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                required
                disabled={!!editingItem}
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Size (inches)
                </label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                  disabled={!!editingItem}
                >
                  {generateSizeOptions().map((size) => (
                    <option key={size} value={size}>
                      {size.toFixed(2)}"
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Weight (grams)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700"
              >
                {editingItem ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-200 text-slate-800 px-6 py-2 rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Weight
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Last Synced
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {inventory.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">
                    {item.product?.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    {item.product?.category}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {item.size.toFixed(2)}"
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {item.weight.toFixed(3)}g
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {item.last_synced
                    ? new Date(item.last_synced).toLocaleString()
                    : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {inventory.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No inventory items yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
