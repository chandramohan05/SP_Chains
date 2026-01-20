import { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/app';
import { SupportTicket, TicketResponse } from '../../types';
import { Plus, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high';

export default function SupportTickets() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState<{
    subject: string;
    description: string;
    priority: TicketPriority;
  }>({
    subject: '',
    description: '',
    priority: 'medium'
  });

  /* ---------------- FETCH TICKETS ---------------- */

  useEffect(() => {
    if (user) fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get<SupportTicket[]>('/support-tickets');
      setTickets(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH RESPONSES ---------------- */

  useEffect(() => {
    if (selectedTicket) fetchResponses(selectedTicket.id);
  }, [selectedTicket]);

  const fetchResponses = async (ticketId: string) => {
    try {
      const res = await api.get<TicketResponse[]>(
        `/support-tickets/${ticketId}/responses`
      );
      setResponses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [responses]);

  /* ---------------- CREATE TICKET ---------------- */

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/support-tickets', {
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority
      });

      setShowForm(false);
      setFormData({ subject: '', description: '', priority: 'medium' });
      fetchTickets();
    } catch (err) {
      console.error(err);
      setError('Failed to create ticket');
    }
  };

  /* ---------------- SEND MESSAGE ---------------- */

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim() || sendingMessage) return;

    setSendingMessage(true);
    setError('');

    try {
      await api.post(
        `/support-tickets/${selectedTicket.id}/responses`,
        { message: newMessage }
      );

      setNewMessage('');
      fetchResponses(selectedTicket.id);
    } catch (err) {
      console.error(err);
      setError('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  /* ---------------- HELPERS ---------------- */

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 'open': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'in_progress': return <MessageSquare className="w-5 h-5 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'closed': return <XCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getPriorityBadge = (priority: TicketPriority) => ({
    low: 'bg-slate-100 text-slate-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700'
  })[priority];

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800" />
      </div>
    );
  }

  /* ---------------- SINGLE TICKET ---------------- */

  if (selectedTicket) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedTicket(null)}
          className="mb-4 text-slate-600 hover:text-slate-800"
        >
          ← Back to Tickets
        </button>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-bold">{selectedTicket.subject}</h2>
              <p className="text-slate-600 mt-2">{selectedTicket.description}</p>
            </div>
            {getStatusIcon(selectedTicket.status as TicketStatus)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
            {responses.map(r => (
              <div
                key={r.id}
                className={`p-3 rounded-lg ${
                  r.is_staff_response ? 'bg-blue-50 ml-8' : 'bg-slate-100 mr-8'
                }`}
              >
                <p className="text-sm">{r.message}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(r.created_at).toLocaleString()}
                </p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {selectedTicket.status !== 'closed' && (
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                disabled={sendingMessage}
                className="bg-slate-800 text-white px-6 py-2 rounded-lg"
              >
                Send
              </button>
            </form>
          )}

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  /* ---------------- LIST VIEW ---------------- */

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Support Tickets</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus className="w-5 h-5" /> New Ticket
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <input
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={4}
              required
            />
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value as TicketPriority })
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <button className="bg-slate-800 text-white px-6 py-2 rounded-lg">
              Create Ticket
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {tickets.map(ticket => (
          <div
            key={ticket.id}
            onClick={() => setSelectedTicket(ticket)}
            className="bg-white p-5 rounded-lg shadow hover:shadow-md cursor-pointer"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">{ticket.subject}</h3>
              {getStatusIcon(ticket.status as TicketStatus)}
            </div>
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
              {ticket.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
