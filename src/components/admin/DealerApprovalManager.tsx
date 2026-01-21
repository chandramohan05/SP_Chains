import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react'

const API_BASE = 'http://localhost:5000/api'

type Dealer = {
  dealer_id: string
  user_id: string
  mobile_number: string
  business_name: string
  gst_number: string
  pan_number: string
  approval_status: 'pending' | 'approved' | 'rejected'
  credit_limit: number
  created_at: string
}

export function DealerApprovalManager() {
  const [dealers, setDealers] = useState<Dealer[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchDealers()
  }, [filter])

  const fetchDealers = async () => {
  try {
    setLoading(true)

    const res = await fetch(`${API_BASE}/dealers?status=${filter}`, {
      cache: 'no-store'   // ✅ ADD THIS LINE
    })

    const data = await res.json()
    setDealers(Array.isArray(data) ? data : [])
  } catch (err) {
    console.error(err)
    alert('Failed to fetch dealers')
  } finally {
    setLoading(false)
  }
}


  const approveDealer = async (dealerId: string, creditLimit: number) => {
    setProcessingId(dealerId)
    try {
      await fetch(`${API_BASE}/dealers/${dealerId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credit_limit: creditLimit })
      })
      fetchDealers()
    } catch {
      alert('Failed to approve dealer')
    } finally {
      setProcessingId(null)
    }
  }

  const rejectDealer = async (dealerId: string, reason: string) => {
    setProcessingId(dealerId)
    try {
      await fetch(`${API_BASE}/dealers/${dealerId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })
      fetchDealers()
    } catch {
      alert('Failed to reject dealer')
    } finally {
      setProcessingId(null)
    }
  }

  const updateCreditLimit = async (dealerId: string, creditLimit: number) => {
    setProcessingId(dealerId)
    try {
      await fetch(`${API_BASE}/dealers/${dealerId}/credit-limit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credit_limit: creditLimit })
      })
      fetchDealers()
    } catch {
      alert('Failed to update credit limit')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center h-64">
        <div className="animate-spin h-10 w-10 border-b-2 border-slate-800 rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dealer Management</h2>
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded capitalize ${
                filter === s ? 'bg-amber-600 text-white' : 'border'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {dealers.length === 0 ? (
        <div className="bg-white p-10 rounded text-center">No dealers found</div>
      ) : (
        dealers.map(d => (
          <DealerCard
            key={d.dealer_id}
            dealer={d}
            processing={processingId === d.dealer_id}
            onApprove={approveDealer}
            onReject={rejectDealer}
            onUpdateCredit={updateCreditLimit}
          />
        ))
      )}
    </div>
  )
}

/* ================= DEALER CARD ================= */

function DealerCard({
  dealer,
  processing,
  onApprove,
  onReject,
  onUpdateCredit
}: {
  dealer: Dealer
  processing: boolean
  onApprove: (id: string, limit: number) => void
  onReject: (id: string, reason: string) => void
  onUpdateCredit: (id: string, limit: number) => void
}) {
  const [creditLimit, setCreditLimit] = useState(dealer.credit_limit)
  const [rejectReason, setRejectReason] = useState('')
  const [mode, setMode] = useState<'none' | 'approve' | 'reject' | 'credit'>('none')

  const statusIcon = {
    approved: <CheckCircle className="text-green-600 w-5 h-5" />,
    pending: <Clock className="text-amber-600 w-5 h-5" />,
    rejected: <XCircle className="text-red-600 w-5 h-5" />
  }[dealer.approval_status]

  return (
    <div className="bg-white p-6 rounded border">
      <div className="flex justify-between mb-3">
        <div className="flex gap-2 items-center">
          {statusIcon}
          <div>
            <h3 className="font-bold">{dealer.business_name}</h3>
            <p className="text-sm text-slate-500">{dealer.mobile_number}</p>
          </div>
        </div>
        <span className="text-xs uppercase">{dealer.approval_status}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
        <div><b>GST</b><br />{dealer.gst_number}</div>
        <div><b>PAN</b><br />{dealer.pan_number}</div>
        <div><b>Credit</b><br />₹{dealer.credit_limit}</div>
        <div><b>Joined</b><br />{new Date(dealer.created_at).toLocaleDateString('en-IN')}</div>
      </div>

      {dealer.approval_status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => onApprove(dealer.dealer_id, creditLimit)}
            disabled={processing}
            className="bg-green-600 text-white flex-1 py-2 rounded"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(dealer.dealer_id, 'Rejected by admin')}
            disabled={processing}
            className="bg-red-600 text-white flex-1 py-2 rounded"
          >
            Reject
          </button>
        </div>
      )}

      {dealer.approval_status === 'approved' && (
        <button
          onClick={() => onUpdateCredit(dealer.dealer_id, creditLimit)}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          <DollarSign className="inline w-4 h-4 mr-2" />
          Update Credit
        </button>
      )}
    </div>
  )
}
