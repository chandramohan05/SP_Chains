import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { Banner } from '../../types'

const API_URL = 'http://localhost:5000/api/banners'


export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    display_order: 0,
    start_date: '',
    end_date: ''
  })

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_URL)

      if (!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()

      // ✅ backend returns ARRAY directly
      setBanners(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      alert('Failed to fetch banners')
    } finally {
      setLoading(false)
    }
  }

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      ...formData,
      end_date: formData.end_date || null
    }

    try {
      const res = await fetch(
        editingBanner ? `${API_URL}/${editingBanner.id}` : API_URL,
        {
          method: editingBanner ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )

      if (!res.ok) throw new Error()

      alert(editingBanner ? 'Banner updated' : 'Banner created')
      resetForm()
      fetchBanners()
    } catch {
      alert('Failed to save banner')
    }
  }

  /* ================= ACTIONS ================= */
  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      description: banner.description || '',
      image_url: banner.image_url,
      link_url: banner.link_url || '',
      display_order: banner.display_order,
      start_date: banner.start_date.split('T')[0],
      end_date: banner.end_date ? banner.end_date.split('T')[0] : ''
    })
    setShowForm(true)
  }

  const handleToggleActive = async (banner: Banner) => {
    await fetch(`${API_URL}/${banner.id}/toggle`, {
      method: 'PATCH'
    })
    fetchBanners()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return

    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })

    fetchBanners()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      display_order: 0,
      start_date: '',
      end_date: ''
    })
    setEditingBanner(null)
    setShowForm(false)
  }

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center h-64">
        <div className="animate-spin h-12 w-12 border-b-2 border-slate-800 rounded-full" />
      </div>
    )
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Banner Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus /> Create Banner
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg mb-6">
          <input
            className="w-full mb-3 border p-2"
            placeholder="Title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <textarea
            className="w-full mb-3 border p-2"
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />

          <input
            className="w-full mb-3 border p-2"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
            required
          />

          <input
            className="w-full mb-3 border p-2"
            placeholder="Link URL"
            value={formData.link_url}
            onChange={e => setFormData({ ...formData, link_url: e.target.value })}
          />

          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              className="border p-2"
              placeholder="Order"
              value={formData.display_order}
              onChange={e =>
                setFormData({ ...formData, display_order: Number(e.target.value) })
              }
            />
            <input
              type="date"
              className="border p-2"
              value={formData.start_date}
              onChange={e => setFormData({ ...formData, start_date: e.target.value })}
              required
            />
            <input
              type="date"
              className="border p-2"
              value={formData.end_date}
              onChange={e => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button className="bg-slate-800 text-white px-4 py-2 rounded">
              {editingBanner ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="bg-slate-200 px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      )}

      {banners.map(b => (
        <div key={b.id} className="bg-white p-4 rounded mb-3 flex justify-between">
          <div>
            <h3 className="font-bold">{b.title}</h3>
            <p className="text-sm text-slate-500">{b.description}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleToggleActive(b)}>
              {b.is_active ? <Eye /> : <EyeOff />}
            </button>
            <button onClick={() => handleEdit(b)}>
              <Edit2 />
            </button>
            <button onClick={() => handleDelete(b.id)}>
              <Trash2 />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
