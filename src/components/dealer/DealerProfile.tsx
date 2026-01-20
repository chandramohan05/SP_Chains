import { DealerProfile as DealerProfileType } from '../../types'
import {
  Building2,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  LogOut
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface DealerProfileProps {
  profile: DealerProfileType
}

export function DealerProfile({ profile }: DealerProfileProps) {
  const { signOut } = useAuth()

  const getStatusIcon = () => {
    switch (profile.approval_status) {
      case 'approved':
        return <CheckCircle className="w-7 h-7 text-green-600" />
      case 'pending':
        return <Clock className="w-7 h-7 text-amber-600" />
      case 'rejected':
        return <XCircle className="w-7 h-7 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (profile.approval_status) {
      case 'approved':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-amber-100 text-amber-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const availableCredit = profile.credit_limit - profile.credit_used
  const usedPercent =
    profile.credit_limit > 0
      ? (profile.credit_used / profile.credit_limit) * 100
      : 0

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Profile</h2>

      {/* ================= BUSINESS INFO ================= */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex gap-3 mb-4">
          <div className="p-3 bg-amber-100 rounded-lg">
            <Building2 className="w-6 h-6 text-amber-600" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold truncate">{profile.business_name}</h3>
            <div className="flex items-center gap-2 mt-2">
              {getStatusIcon()}
              <span
                className={`px-2.5 py-1 text-xs rounded-full font-medium ${getStatusColor()}`}
              >
                {profile.approval_status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {profile.rejected_reason && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            <strong>Rejection reason:</strong> {profile.rejected_reason}
          </div>
        )}

        <div className="grid gap-3 mt-4">
          <InfoRow label="GST Number" value={profile.gst_number} />
          <InfoRow label="PAN Number" value={profile.pan_number} />

          <div className="grid grid-cols-2 gap-3">
            <InfoRow
              label="Registered"
              value={new Date(profile.created_at).toLocaleDateString('en-IN')}
            />
            {profile.approved_at && (
              <InfoRow
                label="Approved"
                value={new Date(profile.approved_at).toLocaleDateString('en-IN')}
              />
            )}
          </div>
        </div>
      </div>

      {/* ================= CREDIT INFO ================= */}
      {profile.approval_status === 'approved' && (
        <div className="bg-white rounded-xl border p-4">
          <div className="flex gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Dealer Credit</h3>
              <p className="text-xs text-slate-500">Credit usage summary</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <CreditBox label="Limit" value={profile.credit_limit} />
            <CreditBox label="Used" value={profile.credit_used} danger />
            <CreditBox label="Available" value={availableCredit} success />
          </div>

          <div>
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all"
                style={{ width: `${Math.min(100, usedPercent)}%` }}
              />
            </div>
            <p className="text-xs text-center text-slate-500 mt-2">
              {usedPercent.toFixed(1)}% credit used
            </p>
          </div>
        </div>
      )}

      {/* ================= LOGOUT ================= */}
      <div className="bg-white rounded-xl border p-4">
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-lg hover:bg-red-100"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  )
}

/* ================= SMALL COMPONENTS ================= */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs text-slate-600">{label}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  )
}

function CreditBox({
  label,
  value,
  danger,
  success
}: {
  label: string
  value: number
  danger?: boolean
  success?: boolean
}) {
  return (
    <div
      className={`p-3 rounded-lg text-center ${
        danger
          ? 'bg-red-50'
          : success
          ? 'bg-green-50'
          : 'bg-slate-50'
      }`}
    >
      <p className="text-xs text-slate-600">{label}</p>
      <p
        className={`font-bold ${
          danger
            ? 'text-red-600'
            : success
            ? 'text-green-600'
            : 'text-slate-900'
        }`}
      >
        ₹{value.toLocaleString('en-IN')}
      </p>
    </div>
  )
}
