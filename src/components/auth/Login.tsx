import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export function Login({ onSwitchToRegister }: LoginProps) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOTP = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('mobile_number', mobileNumber)
        .maybeSingle();

      if (userError) throw userError;

      if (!user) {
        setError('Mobile number not registered. Please register first.');
        setLoading(false);
        return;
      }

      if (!user.is_active) {
        setError('Your account is pending approval. Please wait for admin approval.');
        setLoading(false);
        return;
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { error: otpError } = await supabase
        .from('otp_logs')
        .insert({
          mobile_number: mobileNumber,
          otp_code: otpCode,
          expires_at: expiresAt,
          is_verified: false
        });

      if (otpError) throw otpError;

      console.log('OTP for testing:', otpCode);
      setOtpSent(true);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
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
        .eq('mobile_number', mobileNumber)
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

      await supabase
        .from('otp_logs')
        .update({ is_verified: true })
        .eq('id', otpLog.id);

      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('mobile_number', mobileNumber)
        .single();

      if (user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: `${mobileNumber}@spchains.internal`,
          password: mobileNumber
        });

        if (signInError) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: `${mobileNumber}@spchains.internal`,
            password: mobileNumber,
            options: {
              data: {
                mobile_number: mobileNumber,
                user_id: user.id
              }
            }
          });

          if (signUpError) throw signUpError;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">SP Chains</h1>
          <p className="text-slate-600">B2B Silver Trading Platform</p>
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
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 10-digit mobile number"
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
                onClick={onSwitchToRegister}
                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                New dealer? Register here
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
              <p className="text-xs text-slate-500 mt-2">OTP sent to {mobileNumber}</p>
            </div>

            <button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              onClick={() => {
                setOtpSent(false);
                setOtp('');
                setError('');
              }}
              className="w-full text-slate-600 hover:text-slate-800 text-sm"
            >
              Change mobile number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
