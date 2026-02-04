import { useState, useEffect } from 'react'
import { MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react'

interface SupportTicket {
  id: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  mobile_number?: string
}

interface TicketResponse {
  id: string
  message: string
  is_staff_response: boolean
  created_at: string
}

const API_BASE = import.meta.env.VITE_API_BASE_URL

export default function SupportTicketManager() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [responses, setResponses] = useState<TicketResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<'all' | SupportTicket['status']>('all')

  // ================= FETCH TICKETS =================
  const fetchTickets = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `${API_BASE}/admin/support-tickets?status=${statusFilter}`,
        { credentials: 'include' }
      )

      const rawData = await res.json()

      const normalizedData: SupportTicket[] = rawData.map((t: any) => ({
        id: t.id,
        subject: t.subject,
        description: t.description,
        status: t.status,
        priority: t.priority,
        created_at: t.created_at,
        mobile_number: t.mobile_number
      }))

      setTickets(normalizedData)
    } catch (err) {
      console.error('Failed to fetch tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  // ================= FETCH RESPONSES =================
  const fetchResponses = async (ticketId: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/admin/support-tickets/${ticketId}/responses`,
        { credentials: 'include' }
      )
      const data: TicketResponse[] = await res.json()
      setResponses(data)
    } catch (err) {
      console.error('Failed to fetch responses:', err)
    }
  }

  // ================= UPDATE STATUS =================
  const updateStatus = async (
    ticketId: string,
    status: SupportTicket['status']
  ) => {
    try {
      await fetch(`${API_BASE}/admin/support-tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      })

      fetchTickets()

      setSelectedTicket(prev =>
        prev && prev.id === ticketId ? { ...prev, status } : prev
      )
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  // ================= SEND MESSAGE =================
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket || !newMessage.trim()) return

    try {
      await fetch(
        `${API_BASE}/admin/support-tickets/${selectedTicket.id}/response`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ message: newMessage })
        }
      )

      setNewMessage('')
      fetchResponses(selectedTicket.id)

      if (selectedTicket.status === 'open') {
        updateStatus(selectedTicket.id, 'in_progress')
      }
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  // ================= UI HELPERS =================
  const getStatusIcon = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'in_progress':
        return <MessageSquare className="w-5 h-5 text-yellow-500" />
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'closed':
        return <XCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const priorityBadge = (priority: SupportTicket['priority']) =>
    ({
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    }[priority])

  useEffect(() => {
    fetchTickets()
  }, [statusFilter])

  useEffect(() => {
    if (selectedTicket) fetchResponses(selectedTicket.id)
  }, [selectedTicket])

  if (loading) {
    return (
      <div className="h-64 flex justify-center items-center">Loading...</div>
    )
  }

  // ================= LIST VIEW =================
  if (!selectedTicket) {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        {/* ===== RESPONSIVE HEADER ===== */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Support Tickets</h2>

          <div className="flex flex-wrap gap-2">
            {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map(
              s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded capitalize ${
                    statusFilter === s
                      ? s === 'open'
                        ? 'bg-blue-600 text-white'
                        : s === 'in_progress'
                        ? 'bg-yellow-600 text-white'
                        : s === 'resolved'
                        ? 'bg-green-600 text-white'
                        : s === 'closed'
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-800 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              )
            )}
          </div>
        </div>

        <div className="grid gap-3">
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold">{ticket.subject}</h3>
                {getStatusIcon(ticket.status)}
              </div>
              <p className="text-gray-600">{ticket.description}</p>
              <span
                className={`px-2 py-1 text-xs rounded ${priorityBadge(
                  ticket.priority
                )}`}
              >
                {ticket.priority.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-12 bg-white rounded shadow">
            No tickets found
          </div>
        )}
      </div>
    )
  }

  // ================= SINGLE TICKET VIEW =================
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <button
        onClick={() => setSelectedTicket(null)}
        className="text-blue-600 hover:underline"
      >
        ← Back to Tickets
      </button>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-2xl font-bold">{selectedTicket.subject}</h2>
            <p className="text-gray-700 mt-1">
              {selectedTicket.description}
            </p>
          </div>
          <select
            value={selectedTicket.status}
            onChange={e =>
              updateStatus(
                selectedTicket.id,
                e.target.value as SupportTicket['status']
              )
            }
            className="border px-3 py-2 rounded"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
    </div>
  )
}
