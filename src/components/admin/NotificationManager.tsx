import { useState } from 'react';
import { Notification } from '../../types';
import { Bell, Plus, Trash2 } from 'lucide-react';

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Special Diwali Offer',
    message: 'Get 15% off on all silver chains. Valid till month end!',
    type: 'offer',
    target_audience: 'all',
    is_active: true,
    created_by: 'admin1',
    published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: 'GST Rate Update',
    message: 'New GST rates will be applicable from next month. Please review the updated rates.',
    type: 'gst_update',
    target_audience: 'dealers',
    is_active: true,
    created_by: 'admin1',
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export function NotificationManager() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'offer' as 'offer' | 'alert' | 'gst_update',
    targetAudience: 'all' as 'all' | 'dealers'
  });

  const createNotification = () => {
    if (!formData.title || !formData.message) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: formData.title,
        message: formData.message,
        type: formData.type,
        target_audience: formData.targetAudience,
        created_by: 'admin1',
        published_at: new Date().toISOString(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setNotifications([newNotification, ...notifications]);
      setFormData({
        title: '',
        message: '',
        type: 'offer',
        targetAudience: 'all'
      });
      setShowForm(false);
      setLoading(false);
    }, 500);
  };

  const toggleNotification = (notificationId: string, currentStatus: boolean) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, is_active: !currentStatus } : n
    ));
  };

  const deleteNotification = (notificationId: string) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(n => n.id !== notificationId));
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'offer':
        return 'bg-green-100 text-green-700';
      case 'alert':
        return 'bg-red-100 text-red-700';
      case 'gst_update':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Notification Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Notification
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">New Notification</h3>

          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Notification title"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Notification message"
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="offer">Offer</option>
                  <option value="alert">Alert</option>
                  <option value="gst_update">GST Update</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Audience
                </label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="dealers">Dealers Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={createNotification}
              disabled={loading}
              className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Notification'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No notifications published yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div key={notification.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{notification.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                      {notification.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      notification.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {notification.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-2">{notification.message}</p>
                  <p className="text-xs text-slate-500">
                    Published on {new Date(notification.created_at).toLocaleString('en-IN')} •
                    Target: {notification.target_audience === 'all' ? 'All Users' : 'Dealers Only'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleNotification(notification.id, notification.is_active)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      notification.is_active
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {notification.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
