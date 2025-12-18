import { useState } from 'react';
import { DealerProfile, User } from '../../types';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

type DealerWithUser = DealerProfile & { user: User };

const mockDealers: DealerWithUser[] = [
  {
    id: '1',
    user_id: 'user1',
    business_name: 'Silver Star Jewellers',
    gst_number: '27AABCU9603R1ZX',
    pan_number: 'AABCU9603R',
    approval_status: 'pending',
    credit_limit: 0,
    credit_used: 0,
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: 'user1',
      mobile_number: '9876543210',
      role: 'dealer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: '2',
    user_id: 'user2',
    business_name: 'Gold House Jewellery',
    gst_number: '29AABCU9604R2ZY',
    pan_number: 'AABCU9604S',
    approval_status: 'approved',
    credit_limit: 150000,
    credit_used: 25000,
    approved_by: 'admin1',
    approved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    rejected_reason: null,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      id: 'user2',
      mobile_number: '9876543211',
      role: 'dealer',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  }
];

export function DealerApprovalManager() {
  const [dealers, setDealers] = useState<DealerWithUser[]>(mockDealers);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const approveDealer = (dealerId: string, creditLimit: number) => {
    setProcessingId(dealerId);
    setTimeout(() => {
      setDealers(dealers.map(d =>
        d.id === dealerId ? { ...d, approval_status: 'approved' as const, credit_limit: creditLimit } : d
      ));
      setProcessingId(null);
    }, 500);
  };

  const rejectDealer = (dealerId: string, reason: string) => {
    setProcessingId(dealerId);
    setTimeout(() => {
      setDealers(dealers.map(d =>
        d.id === dealerId ? { ...d, approval_status: 'rejected' as const, rejected_reason: reason } : d
      ));
      setProcessingId(null);
    }, 500);
  };

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
  onApprove: (dealerId: string, userId: string, creditLimit: number) => void;
  onReject: (dealerId: string, userId: string, reason: string) => void;
  processing: boolean;
}

function DealerCard({ dealer, onApprove, onReject, processing }: DealerCardProps) {
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [creditLimit, setCreditLimit] = useState(50000);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    onApprove(dealer.id, dealer.user_id, creditLimit);
    setShowApproveForm(false);
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(dealer.id, dealer.user_id, rejectionReason);
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
