import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { SupportTicket, TicketResponse, User } from '../../types';
import { MessageSquare, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function SupportTicketManager() {
  const [tickets, setTickets] = useState<(SupportTicket & { user?: User })[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  useEffect(() => {
    if (selectedTicket) {
      fetchResponses(selectedTicket.id);
    }
  }, [selectedTicket]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('support_tickets')
        .select(`
          *,
          user:users(id, mobile_number)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTickets(data || []);
    } catch (error: unknown) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResponses = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_responses')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setResponses(data || []);
    } catch (error: unknown) {
      console.error('Error fetching responses:', error);
    }
  };

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', ticketId);

      if (error) throw error;

      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus as SupportTicket['status'] });
      }
      fetchTickets();
    } catch (error: unknown) {
      console.error('Error updating status:', error);
      alert('Failed to update ticket status');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      const { error } = await supabase
        .from('ticket_responses')
        .insert([{
          ticket_id: selectedTicket.id,
          user_id: userId,
          message: newMessage,
          is_staff_response: true
        }]);

      if (error) throw error;

      if (selectedTicket.status === 'open') {
        await handleStatusUpdate(selectedTicket.id, 'in_progress');
      }

      setNewMessage('');
      fetchResponses(selectedTicket.id);
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'in_progress':
        return <MessageSquare className="w-5 h-5 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'closed':
        return <XCircle className="w-5 h-5 text-slate-500" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-slate-100 text-slate-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (selectedTicket) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedTicket(null)}
          className="mb-4 text-slate-600 hover:text-slate-800"
        >
          ← Back to Tickets
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800">{selectedTicket.subject}</h2>
              <p className="text-slate-600 mt-2">{selectedTicket.description}</p>
            </div>
            <div className="ml-4">
              <select
                value={selectedTicket.status}
                onChange={(e) => handleStatusUpdate(selectedTicket.id, e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 text-sm">
            <span className={`px-3 py-1 rounded-full ${getPriorityBadge(selectedTicket.priority)}`}>
              {selectedTicket.priority.toUpperCase()}
            </span>
            <span className="text-slate-500">
              Created {new Date(selectedTicket.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Conversation</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
            {responses.map((response) => (
              <div
                key={response.id}
                className={`p-4 rounded-lg ${
                  response.is_staff_response
                    ? 'bg-blue-50 ml-8'
                    : 'bg-slate-50 mr-8'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-slate-800">
                    {response.is_staff_response ? 'Support Team (You)' : 'Customer'}
                  </span>
                  <span className="text-sm text-slate-500">
                    {new Date(response.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-700">{response.message}</p>
              </div>
            ))}
          </div>

          {selectedTicket.status !== 'closed' && (
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your response..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                required
              />
              <button
                type="submit"
                className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Support Tickets</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-200 text-slate-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('open')}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === 'open'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === 'in_progress'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === 'resolved'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => setSelectedTicket(ticket)}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {ticket.priority === 'high' && <AlertCircle className="w-5 h-5 text-red-500" />}
                  <h3 className="text-lg font-semibold text-slate-800">{ticket.subject}</h3>
                </div>
                <p className="text-slate-600 mb-2 line-clamp-2">{ticket.description}</p>
                <p className="text-sm text-slate-500">
                  User: {ticket.user?.mobile_number || 'Unknown'}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {getStatusIcon(ticket.status)}
                <span className="text-sm capitalize">{ticket.status.replace('_', ' ')}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className={`text-xs px-3 py-1 rounded-full ${getPriorityBadge(ticket.priority)}`}>
                {ticket.priority.toUpperCase()}
              </span>
              <span className="text-sm text-slate-500">
                {new Date(ticket.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {tickets.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-slate-500">No support tickets found</p>
        </div>
      )}
    </div>
  );
}
