import { useEffect, useState } from 'react'
import { Notification } from '../../types'
import { Bell, Plus, Trash2 } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL

export function NotificationManager() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'offer' as 'offer' | 'alert' | 'gst_update',
    targetAudience: 'all' as 'all' | 'dealers'
  })

  /* ================= FETCH ================= */
  const fetchNotifications = async () => {
    const res = await fetch(`${API_BASE}/api/admin/notifications`)
    const data = await res.json()
    setNotifications(data || [])
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  /* ================= CREATE ================= */
  const createNotification = async () => {
    if (!formData.title || !formData.message) return

    setLoading(true)
    await fetch(`${API_BASE}/api/admin/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        message: formData.message,
        type: formData.type,
        target_audience: formData.targetAudience
      })
    })

    setFormData({ title: '', message: '', type: 'offer', targetAudience: 'all' })
    setShowForm(false)
    setLoading(false)
    fetchNotifications()
  }

  /* ================= TOGGLE ================= */
  const toggleNotification = async (id: string) => {
    await fetch(`${API_BASE}/api/admin/notifications/${id}/toggle`, {
      method: 'PATCH'
    })
    fetchNotifications()
  }

  /* ================= DELETE ================= */
  const deleteNotification = async (id: string) => {
    if (!confirm('Delete this notification?')) return
    await fetch(`${API_BASE}/api/admin/notifications/${id}`, { method: 'DELETE' })
    fetchNotifications()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'offer': return 'bg-green-100 text-green-700'
      case 'alert': return 'bg-red-100 text-red-700'
      case 'gst_update': return 'bg-blue-100 text-blue-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notification Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Notification
        </button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded shadow border">
          <input
            className="w-full mb-3 border p-2 rounded"
            placeholder="Title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />

          <textarea
            className="w-full mb-3 border p-2 rounded"
            placeholder="Message"
            rows={4}
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3 mb-4">
            <select
              className="border p-2 rounded"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as any })}
            >
              <option value="offer">Offer</option>
              <option value="alert">Alert</option>
              <option value="gst_update">GST Update</option>
            </select>

            <select
              className="border p-2 rounded"
              value={formData.targetAudience}
              onChange={e => setFormData({ ...formData, targetAudience: e.target.value as any })}
            >
              <option value="all">All Users</option>
              <option value="dealers">Dealers Only</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={createNotification}
              disabled={loading}
              className="bg-amber-600 text-white px-4 py-2 rounded w-full"
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-slate-200 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      {notifications.length === 0 ? (
        <div className="text-center py-10 bg-white rounded shadow">
          <Bell className="mx-auto text-slate-300 w-12 h-12 mb-2" />
          No notifications
        </div>
      ) : (
        notifications.map(n => (
          <div key={n.id} className="bg-white p-6 rounded shadow border">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{n.title}</h3>
                <p className="text-slate-600">{n.message}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${getTypeColor(n.type)}`}>
                    {n.type.toUpperCase()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    n.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100'
                  }`}>
                    {n.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleNotification(n.id)}
                  className="text-xs px-3 py-1 rounded bg-slate-200"
                >
                  {n.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="p-2 text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
