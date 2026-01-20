import { useEffect, useState } from 'react'
import { DealerProfile, User } from '../../types'
import { CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react'

const API_BASE = 'http://localhost:5000/api'

type DealerWithUser = DealerProfile & { user: User }

export function DealerApprovalManager() {
  const [dealers, setDealers] = useState<DealerWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchDealers()
  }, [filter])

  /* ---------------- FETCH DEALERS ---------------- */
  const fetchDealers = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/dealers?status=${filter}`)
      const data = await res.json()
      setDealers(data)
    } catch (err) {
      console.error(err)
      alert('Failed to fetch dealers')
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- APPROVE ---------------- */
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

  /* ---------------- REJECT ---------------- */
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

  /* ---------------- CREDIT LIMIT ---------------- */
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
        <div className="bg-white p-10 rounded text-center">
          <p>No dealers found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {dealers.map(d => (
            <DealerCard
              key={d.id}
              dealer={d}
              processing={processingId === d.id}
              onApprove={approveDealer}
              onReject={rejectDealer}
              onUpdateCredit={updateCreditLimit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ===================================================== */

interface DealerCardProps {
  dealer: DealerWithUser
  processing: boolean
  onApprove: (id: string, limit: number) => void
  onReject: (id: string, reason: string) => void
  onUpdateCredit: (id: string, limit: number) => void
}

function DealerCard({
  dealer,
  processing,
  onApprove,
  onReject,
  onUpdateCredit
}: DealerCardProps) {
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
            <p className="text-sm text-slate-500">{dealer.user.mobile_number}</p>
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

      {dealer.approval_status === 'approved' && (
        <>
          {mode === 'credit' ? (
            <div className="flex gap-2">
              <input
                type="number"
                value={creditLimit}
                onChange={e => setCreditLimit(Number(e.target.value))}
                className="border px-3 py-2 rounded w-full"
              />
              <button
                onClick={() => {
                  onUpdateCredit(dealer.id, creditLimit)
                  setMode('none')
                }}
                disabled={processing}
                className="bg-blue-600 text-white px-4 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setMode('credit')}
              className="bg-blue-600 text-white w-full py-2 rounded"
            >
              <DollarSign className="inline w-4 h-4 mr-2" />
              Manage Credit
            </button>
          )}
        </>
      )}

      {dealer.approval_status === 'pending' && (
        <>
          {mode === 'approve' && (
            <button
              onClick={() => onApprove(dealer.id, creditLimit)}
              disabled={processing}
              className="bg-green-600 text-white w-full py-2 rounded"
            >
              Confirm Approval
            </button>
          )}

          {mode === 'reject' && (
            <>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="border w-full p-2 rounded mb-2"
                placeholder="Reason..."
              />
              <button
                onClick={() => onReject(dealer.id, rejectReason)}
                disabled={!rejectReason}
                className="bg-red-600 text-white w-full py-2 rounded"
              >
                Confirm Rejection
              </button>
            </>
          )}

          {mode === 'none' && (
            <div className="flex gap-2">
              <button onClick={() => setMode('approve')} className="bg-green-600 text-white flex-1 py-2 rounded">
                Approve
              </button>
              <button onClick={() => setMode('reject')} className="bg-red-600 text-white flex-1 py-2 rounded">
                Reject
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
