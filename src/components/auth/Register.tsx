import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { UserPlus } from 'lucide-react';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export function Register({ onSwitchToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    businessName: '',
    gstNumber: '',
    panNumber: ''
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (formData.mobileNumber.length !== 10) {
      setError('Mobile number must be 10 digits');
      return false;
    }
    if (!formData.businessName.trim()) {
      setError('Business name is required');
      return false;
    }
    if (formData.gstNumber.length !== 15) {
      setError('GST number must be 15 characters');
      return false;
    }
    if (formData.panNumber.length !== 10) {
      setError('PAN number must be 10 characters');
      return false;
    }
    return true;
  };

  const sendOTP = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('mobile_number', formData.mobileNumber)
        .maybeSingle();

      if (existingUser) {
        setError('Mobile number already registered');
        setLoading(false);
        return;
      }

      const { data: existingGST } = await supabase
        .from('dealer_profiles')
        .select('id')
        .eq('gst_number', formData.gstNumber.toUpperCase())
        .maybeSingle();

      if (existingGST) {
        setError('GST number already registered');
        setLoading(false);
        return;
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { error: otpError } = await supabase
        .from('otp_logs')
        .insert({
          mobile_number: formData.mobileNumber,
          otp_code: otpCode,
          expires_at: expiresAt,
          is_verified: false
        });

      if (otpError) throw otpError;

      console.log('OTP for testing:', otpCode);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndRegister = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: otpLog, error: otpError } = await supabase
        .from('otp_logs')
        .select('*')
        .eq('mobile_number', formData.mobileNumber)
        .eq('otp_code', otp)
        .eq('is_verified', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (otpError) throw otpError;

      if (!otpLog) {
        setError('Invalid or expired OTP');
        setLoading(false);
        return;
      }

      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          mobile_number: formData.mobileNumber,
          role: 'dealer',
          is_active: false
        })
        .select()
        .single();

      if (userError) throw userError;

      const { error: profileError } = await supabase
        .from('dealer_profiles')
        .insert({
          user_id: newUser.id,
          business_name: formData.businessName,
          gst_number: formData.gstNumber.toUpperCase(),
          pan_number: formData.panNumber.toUpperCase(),
          approval_status: 'pending',
          credit_limit: 0,
          credit_used: 0
        });

      if (profileError) throw profileError;

      await supabase
        .from('otp_logs')
        .update({ is_verified: true })
        .eq('id', otpLog.id);

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
          <p className="text-slate-600 mb-6">
            Your application has been submitted for admin approval. You will be notified once your account is approved.
          </p>
          <button
            onClick={onSwitchToLogin}
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Register</h1>
          <p className="text-slate-600">Create your dealer account</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {!otpSent ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                maxLength={10}
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '') })}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Your business name"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                GST Number
              </label>
              <input
                type="text"
                maxLength={15}
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                placeholder="15-character GST number"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                PAN Number
              </label>
              <input
                type="text"
                maxLength={10}
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                placeholder="10-character PAN number"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <div className="text-center">
              <button
                onClick={onSwitchToLogin}
                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                Already registered? Login here
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-slate-500 mt-2">OTP sent to {formData.mobileNumber}</p>
            </div>

            <button
              onClick={verifyAndRegister}
              disabled={loading}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Register'}
            </button>

            <button
              onClick={() => {
                setOtpSent(false);
                setOtp('');
                setError('');
              }}
              className="w-full text-slate-600 hover:text-slate-800 text-sm"
            >
              Change details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
