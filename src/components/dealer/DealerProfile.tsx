import { DealerProfile as DealerProfileType } from '../../types';
import { Building2, CreditCard, CheckCircle, Clock, XCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DealerProfileProps {
  profile: DealerProfileType;
}

export function DealerProfile({ profile }: DealerProfileProps) {
  const { signOut } = useAuth();
  const getStatusIcon = () => {
    switch (profile.approval_status) {
      case 'approved':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'pending':
        return <Clock className="w-8 h-8 text-amber-600" />;
      case 'rejected':
        return <XCircle className="w-8 h-8 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (profile.approval_status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Profile</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2.5 bg-amber-100 rounded-lg flex-shrink-0">
            <Building2 className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-900 truncate">{profile.business_name}</h3>
            <div className="flex items-center mt-2 gap-2">
              <div className="flex-shrink-0">{getStatusIcon()}</div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                {profile.approval_status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {profile.rejected_reason && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700">
              <span className="font-medium">Rejection Reason: </span>
              {profile.rejected_reason}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <label className="block text-xs font-medium text-slate-700 mb-1">GST Number</label>
            <p className="text-sm font-semibold text-slate-900">{profile.gst_number}</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-3">
            <label className="block text-xs font-medium text-slate-700 mb-1">PAN Number</label>
            <p className="text-sm font-semibold text-slate-900">{profile.pan_number}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <label className="block text-xs font-medium text-slate-700 mb-1">Registered</label>
              <p className="text-xs font-semibold text-slate-900">
                {new Date(profile.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>

            {profile.approved_at && (
              <div className="bg-slate-50 rounded-lg p-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">Approved</label>
                <p className="text-xs font-semibold text-slate-900">
                  {new Date(profile.approved_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {profile.approval_status === 'approved' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 bg-green-100 rounded-lg flex-shrink-0">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-slate-900">Credit Info</h3>
              <p className="text-xs text-slate-500 mt-0.5">Your dealer credit</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <label className="block text-xs font-medium text-slate-700 mb-1">Limit</label>
              <p className="text-base font-bold text-slate-900">₹{(profile.credit_limit / 1000).toFixed(0)}k</p>
            </div>

            <div className="p-3 bg-red-50 rounded-lg text-center">
              <label className="block text-xs font-medium text-slate-700 mb-1">Used</label>
              <p className="text-base font-bold text-red-600">₹{(profile.credit_used / 1000).toFixed(0)}k</p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg text-center">
              <label className="block text-xs font-medium text-slate-700 mb-1">Available</label>
              <p className="text-base font-bold text-green-600">
                ₹{((profile.credit_limit - profile.credit_used) / 1000).toFixed(0)}k
              </p>
            </div>
          </div>

          <div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, ((profile.credit_limit - profile.credit_used) / profile.credit_limit) * 100)}%`
                }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              {((profile.credit_limit - profile.credit_used) / profile.credit_limit * 100).toFixed(1)}% available
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
