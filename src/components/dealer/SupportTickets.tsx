import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { SupportTicket, TicketResponse } from '../../types';
import { Plus, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SupportTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  useEffect(() => {
    if (selectedTicket) {
      fetchResponses(selectedTicket.id);
    }
  }, [selectedTicket]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert([{
          user_id: user?.id,
          ...formData
        }]);

      if (error) throw error;

      alert('Ticket created successfully');
      setFormData({ subject: '', description: '', priority: 'medium' });
      setShowForm(false);
      fetchTickets();
    } catch (error: unknown) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('ticket_responses')
        .insert([{
          ticket_id: selectedTicket.id,
          user_id: user?.id,
          message: newMessage,
          is_staff_response: false
        }]);

      if (error) throw error;

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
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{selectedTicket.subject}</h2>
              <p className="text-slate-600 mt-2">{selectedTicket.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(selectedTicket.status)}
              <span className="capitalize">{selectedTicket.status.replace('_', ' ')}</span>
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
                    {response.is_staff_response ? 'Support Team' : 'You'}
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
                placeholder="Type your message..."
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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Support Tickets</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
        >
          <Plus className="w-5 h-5" />
          New Ticket
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Create New Ticket</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700"
              >
                Create Ticket
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-200 text-slate-800 px-6 py-2 rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => setSelectedTicket(ticket)}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-slate-800">{ticket.subject}</h3>
              <div className="flex items-center gap-2">
                {getStatusIcon(ticket.status)}
                <span className="text-sm capitalize">{ticket.status.replace('_', ' ')}</span>
              </div>
            </div>
            <p className="text-slate-600 mb-3 line-clamp-2">{ticket.description}</p>
            <div className="flex justify-between items-center">
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
          <p className="text-slate-500">No support tickets yet</p>
        </div>
      )}
    </div>
  );
}
