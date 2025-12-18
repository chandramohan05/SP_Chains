import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Banner } from '../../types';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    display_order: 0,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error: unknown) {
      console.error('Error fetching banners:', error);
      alert('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        const { error } = await supabase
          .from('banners')
          .update({
            ...formData,
            end_date: formData.end_date || null
          })
          .eq('id', editingBanner.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('banners')
          .insert([{
            ...formData,
            end_date: formData.end_date || null,
            is_active: true
          }]);

        if (error) throw error;
      }

      alert(editingBanner ? 'Banner updated successfully' : 'Banner created successfully');
      resetForm();
      fetchBanners();
    } catch (error: unknown) {
      console.error('Error saving banner:', error);
      alert('Failed to save banner');
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      image_url: banner.image_url,
      link_url: banner.link_url || '',
      display_order: banner.display_order,
      start_date: banner.start_date.split('T')[0],
      end_date: banner.end_date ? banner.end_date.split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ is_active: !banner.is_active })
        .eq('id', banner.id);

      if (error) throw error;
      fetchBanners();
    } catch (error: unknown) {
      console.error('Error toggling banner status:', error);
      alert('Failed to update banner status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Banner deleted successfully');
      fetchBanners();
    } catch (error: unknown) {
      console.error('Error deleting banner:', error);
      alert('Failed to delete banner');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      display_order: 0,
      start_date: '',
      end_date: ''
    });
    setEditingBanner(null);
    setShowForm(false);
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
        <h2 className="text-2xl font-bold text-slate-800">Banner Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
        >
          <Plus className="w-5 h-5" />
          Create Banner
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            {editingBanner ? 'Edit Banner' : 'Create New Banner'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Link URL (Optional)
              </label>
              <input
                type="url"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="https://example.com/promotion"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700"
              >
                {editingBanner ? 'Update' : 'Create'}
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

      <div className="grid gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              !banner.is_active ? 'opacity-60' : ''
            }`}
          >
            <div className="flex gap-6">
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">{banner.title}</h3>
                    {banner.description && (
                      <p className="text-slate-600 mt-1">{banner.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`p-2 rounded-lg ${
                        banner.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                      title={banner.is_active ? 'Active' : 'Inactive'}
                    >
                      {banner.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleEdit(banner)}
                      className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-4">
                  <span>Order: {banner.display_order}</span>
                  <span>Start: {new Date(banner.start_date).toLocaleDateString()}</span>
                  {banner.end_date && (
                    <span>End: {new Date(banner.end_date).toLocaleDateString()}</span>
                  )}
                  {banner.link_url && (
                    <a
                      href={banner.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Link
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-slate-500">No banners created yet</p>
        </div>
      )}
    </div>
  );
}
