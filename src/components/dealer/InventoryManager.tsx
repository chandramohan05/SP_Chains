// InventoryManager.tsx
import { useState, useEffect } from 'react'
import { api } from '../../lib/app'
import { DealerInventory, Product } from '../../types'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function InventoryManager() {
  const { user } = useAuth()

  const [inventory, setInventory] = useState<
    (DealerInventory & { product?: Product })[]
  >([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<DealerInventory | null>(null)

  const [formData, setFormData] = useState({
    product_id: '',
    size: 4.0,
    weight: 0,
    quantity: 0
  })

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    if (!user?.id) return
    fetchInventory()
    fetchProducts()
  }, [user?.id])

  const fetchInventory = async () => {
  try {
    setLoading(true)

    const res = await api.get<
      (DealerInventory & { product?: Product })[]
    >('/inventory')

    setInventory(res.data)
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}


const fetchProducts = async () => {
  try {
    const res = await api.get<Product[]>('/products/active')
    setProducts(res.data)
  } catch (err) {
    console.error(err)
  }
}


  /* ---------------- SAVE ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    try {
      if (editingItem) {
        await api.put(`/inventory/${editingItem.id}`, formData)
      } else {
        await api.post('/inventory', {
          ...formData
        })
      }

      resetForm()
      fetchInventory()
    } catch (err) {
      console.error(err)
      alert('Save failed')
    }
  }

  /* ---------------- EDIT ---------------- */

  const handleEdit = (item: DealerInventory) => {
    setEditingItem(item)
    setFormData({
      product_id: item.product_id,
      size: item.size,
      weight: item.weight,
      quantity: item.quantity
    })
    setShowForm(true)
  }

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id: string) => {
    if (!confirm('Delete item?')) return

    try {
      await api.delete(`/inventory/${id}`)
      fetchInventory()
    } catch (err) {
      console.error(err)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormData({
      product_id: '',
      size: 4.0,
      weight: 0,
      quantity: 0
    })
  }

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">My Inventory</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded"
        >
          <Plus className="w-4 h-4 inline mr-1" /> Add
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded mb-4">
          <select
            required
            value={formData.product_id}
            onChange={e =>
              setFormData({ ...formData, product_id: e.target.value })
            }
            className="w-full mb-2 border p-2"
            disabled={!!editingItem}
          >
            <option value="">Select product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              step="0.25"
              value={formData.size}
              onChange={e =>
                setFormData({ ...formData, size: +e.target.value })
              }
            />
            <input
              type="number"
              step="0.001"
              value={formData.weight}
              onChange={e =>
                setFormData({ ...formData, weight: +e.target.value })
              }
            />
            <input
              type="number"
              value={formData.quantity}
              onChange={e =>
                setFormData({ ...formData, quantity: +e.target.value })
              }
            />
          </div>

          <div className="mt-3 flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* TABLE */}
      <table className="w-full bg-white rounded">
        <thead>
          <tr className="text-left border-b">
            <th>Product</th>
            <th>Size</th>
            <th>Qty</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id} className="border-b">
              <td>{item.product?.name}</td>
              <td>{item.size}"</td>
              <td>{item.quantity}</td>
              <td className="flex gap-2">
                <button onClick={() => handleEdit(item)}>
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
