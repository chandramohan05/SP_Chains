import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { DealerProfile, User } from '../../types';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

type DealerWithUser = DealerProfile & { user: User };

export function DealerApprovalManager() {
  const [dealers, setDealers] = useState<DealerWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDealers();
  }, [filter]);

  const fetchDealers = async () => {
    try {
      setLoading(true);

      let profileQuery = supabase
        .from('dealer_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        profileQuery = profileQuery.eq('approval_status', filter);
      }

      const { data: profiles, error: profileError } = await profileQuery;

      if (profileError) throw profileError;

      if (!profiles || profiles.length === 0) {
        setDealers([]);
        return;
      }

      const userIds = profiles.map(p => p.user_id);
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .in('id', userIds);

      if (usersError) throw usersError;

      const usersMap = new Map(users?.map(u => [u.id, u]) || []);

      const dealersWithUsers = profiles.map(profile => ({
        ...profile,
        user: usersMap.get(profile.user_id) || {
          id: profile.user_id,
          mobile_number: 'Unknown',
          role: 'dealer',
          is_active: false,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        }
      }));

      setDealers(dealersWithUsers);
    } catch (error: unknown) {
      console.error('Error fetching dealers:', error);
      alert('Failed to fetch dealers');
    } finally {
      setLoading(false);
    }
  };

  const approveDealer = async (dealerId: string, creditLimit: number) => {
    setProcessingId(dealerId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const adminId = session?.user?.id || null;

      const { error } = await supabase
        .from('dealer_profiles')
        .update({
          approval_status: 'approved',
          credit_limit: creditLimit,
          approved_by: adminId,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', dealerId);

      if (error) throw error;

      const dealer = dealers.find(d => d.id === dealerId);
      if (dealer) {
        await supabase
          .from('users')
          .update({ is_active: true })
          .eq('id', dealer.user_id);
      }

      alert('Dealer approved successfully');
      fetchDealers();
    } catch (error: unknown) {
      console.error('Error approving dealer:', error);
      alert('Failed to approve dealer');
    } finally {
      setProcessingId(null);
    }
  };

  const rejectDealer = async (dealerId: string, reason: string) => {
    setProcessingId(dealerId);
    try {
      const { error } = await supabase
        .from('dealer_profiles')
        .update({
          approval_status: 'rejected',
          rejected_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', dealerId);

      if (error) throw error;

      alert('Dealer rejected');
      fetchDealers();
    } catch (error: unknown) {
      console.error('Error rejecting dealer:', error);
      alert('Failed to reject dealer');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Dealer Management</h2>
        <div className="flex space-x-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === status
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {dealers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-slate-500 text-lg">No dealers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {dealers.map(dealer => (
            <DealerCard
              key={dealer.id}
              dealer={dealer}
              onApprove={approveDealer}
              onReject={rejectDealer}
              processing={processingId === dealer.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface DealerCardProps {
  dealer: DealerWithUser;
  onApprove: (dealerId: string, creditLimit: number) => void;
  onReject: (dealerId: string, reason: string) => void;
  processing: boolean;
}

function DealerCard({ dealer, onApprove, onReject, processing }: DealerCardProps) {
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [creditLimit, setCreditLimit] = useState(50000);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    onApprove(dealer.id, creditLimit);
    setShowApproveForm(false);
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(dealer.id, rejectionReason);
      setShowRejectForm(false);
      setRejectionReason('');
    }
  };

  const getStatusIcon = () => {
    switch (dealer.approval_status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{dealer.business_name}</h3>
            <p className="text-sm text-slate-500">{dealer.user.mobile_number}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          dealer.approval_status === 'approved' ? 'bg-green-100 text-green-700' :
          dealer.approval_status === 'pending' ? 'bg-amber-100 text-amber-700' :
          'bg-red-100 text-red-700'
        }`}>
          {dealer.approval_status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="text-xs text-slate-500">GST Number</label>
          <p className="font-medium text-slate-900">{dealer.gst_number}</p>
        </div>
        <div>
          <label className="text-xs text-slate-500">PAN Number</label>
          <p className="font-medium text-slate-900">{dealer.pan_number}</p>
        </div>
        <div>
          <label className="text-xs text-slate-500">Credit Limit</label>
          <p className="font-medium text-slate-900">₹{dealer.credit_limit.toFixed(2)}</p>
        </div>
        <div>
          <label className="text-xs text-slate-500">Registered</label>
          <p className="font-medium text-slate-900">
            {new Date(dealer.created_at).toLocaleDateString('en-IN')}
          </p>
        </div>
      </div>

      {dealer.rejected_reason && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            <span className="font-medium">Rejection Reason: </span>
            {dealer.rejected_reason}
          </p>
        </div>
      )}

      {dealer.approval_status === 'pending' && (
        <div className="space-y-3">
          {showApproveForm ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Set Credit Limit (₹)
                </label>
                <input
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                  step="10000"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Confirm Approval
                </button>
                <button
                  onClick={() => setShowApproveForm(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : showRejectForm ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Provide a reason for rejection..."
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleReject}
                  disabled={processing || !rejectionReason.trim()}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => setShowApproveForm(true)}
                disabled={processing}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Approve
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={processing}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 inline mr-2" />
                Reject
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
