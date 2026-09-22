import { useState, FormEvent } from 'react';
import { X, User as UserIcon, Mail, Lock, Briefcase, Check, Sparkles, LogOut, AlertCircle, RefreshCw } from 'lucide-react';
import { User } from '../types';
import { useI18n } from '../i18n/I18nProvider';
import { 
  loginWithGoogle, 
  sendPasswordResetEmail, 
  resendVerificationEmail,
  isEmailVerified 
} from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register' | 'profile' | 'forgot-password';
  currentUser: User | null;
  onClose: () => void;
  onLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  onRegister: (name: string, email: string, pass: string, role: string) => Promise<{ success: boolean; error?: string }>;
  onUpdateProfile: (name: string, role: string, newPassword?: string) => Promise<void>;
  onLogout: () => void;
}

export default function AuthModal({
  isOpen,
  initialMode,
  currentUser,
  onClose,
  onLogin,
  onRegister,
  onUpdateProfile,
  onLogout,
}: AuthModalProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<'login' | 'register' | 'profile' | 'forgot-password'>(initialMode);
  
  // Form states
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [role, setRole] = useState(currentUser?.role || 'Full-Stack Developer');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [warningMsg, setWarningMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);
  const [resendingVerification, setResendingVerification] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setWarningMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        // Validation
        if (!name.trim()) {
          setErrorMsg(t('authNameRequired'));
          setIsSubmitting(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setErrorMsg(t('authEmailValid'));
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg(t('authPasswordMinLengthFull'));
          setIsSubmitting(false);
          return;
        }
        
        // Real registration via Supabase
        const result = await onRegister(name.trim(), email.trim(), password, role);
        
        if (result.success) {
          setSuccessMsg(t('authRegisterSuccess'));
          if (result.error?.includes('verify')) {
            setWarningMsg(t('authCheckEmailVerify'));
            setEmailVerified(false);
          }
          setTimeout(() => onClose(), 2000);
        } else {
          setErrorMsg(result.error || t('authRegisterError'));
        }
        
      } else if (mode === 'login') {
        // Validation
        if (!email.trim() || !password) {
          setErrorMsg(t('authEmailRequired'));
          setIsSubmitting(false);
          return;
        }
        
        // Real login via Supabase
        const result = await onLogin(email.trim(), password);
        
        if (result.success) {
          setSuccessMsg(t('authLoginSuccess'));
          setTimeout(() => onClose(), 700);
        } else {
          if (result.error?.includes('verify') || result.error?.includes('confirmed')) {
            setErrorMsg(t('authVerifyEmail'));
            setEmailVerified(false);
          } else {
            setErrorMsg(result.error || t('authLoginError'));
          }
        }
        
      } else if (mode === 'profile') {
        // Validation
        if (!name.trim()) {
          setErrorMsg(t('authProfileNameRequired'));
          setIsSubmitting(false);
          return;
        }
        
        // Update profile
        await onUpdateProfile(name.trim(), role, newPassword || undefined);
        setSuccessMsg(t('authProfileUpdateSuccess'));
        setTimeout(() => onClose(), 900);
        
      } else if (mode === 'forgot-password') {
        // Password reset
        if (!email.trim() || !email.includes('@')) {
          setErrorMsg(t('authEmailValid'));
          setIsSubmitting(false);
          return;
        }
        
        const result = await sendPasswordResetEmail(email.trim());
        
        if (result.success) {
          setSuccessMsg(t('authPasswordResetSent'));
          setTimeout(() => {
            setMode('login');
            setSuccessMsg('');
          }, 3000);
        } else {
          setErrorMsg(result.error || t('authPasswordResetFailed'));
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(err?.message || t('authGenericError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      const result = await loginWithGoogle();
      if (!result.success) {
        setErrorMsg(result.error || t('authGoogleSignInFailed'));
      }
      // OAuth will redirect, so this won't normally reach here
    } catch (err: any) {
      console.error('Google login error:', err);
      setErrorMsg(err?.message || t('authGoogleSignInFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setResendingVerification(true);
      setErrorMsg('');
      setSuccessMsg('');
      
      const result = await resendVerificationEmail();
      
      if (result.success) {
        setSuccessMsg(t('authVerificationSent'));
      } else {
        setErrorMsg(result.error || t('authResendFailed'));
      }
    } catch (err: any) {
      console.error('Resend verification error:', err);
      setErrorMsg(err?.message || t('authResendFailed'));
    } finally {
      setResendingVerification(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header Accent (Yellow / Amber for EDX CRM WEB FOV) */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="text-right mb-5 pr-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30">
              EDX CRM WEB FOV
            </span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {mode === 'login' && t('authLoginTitle')}
            {mode === 'register' && t('authRegisterTitle')}
            {mode === 'profile' && t('authProfileTitle')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && t('authLoginDescription')}
            {mode === 'register' && t('authRegisterDescription')}
            {mode === 'profile' && t('authProfileDescription')}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'profile' && mode !== 'forgot-password' && (
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl mb-5 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessMsg('');
                setWarningMsg('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('authLoginWithPassword')}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
                setSuccessMsg('');
                setWarningMsg('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('authNewRegistration')}
            </button>
          </div>
        )}

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-950/70 border border-red-800/80 text-red-300 text-xs text-right flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {warningMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-yellow-950/70 border border-yellow-800/80 text-yellow-300 text-xs text-right flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>{warningMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-xs text-right flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Email Verification Warning */}
        {!emailVerified && mode === 'login' && (
          <div className="mb-4 p-3 rounded-lg bg-orange-950/70 border border-orange-800/80 text-right">
            <div className="text-xs text-orange-300 mb-2">
              {t('authCheckEmailVerify')}
            </div>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendingVerification}
              className="text-xs text-orange-400 hover:text-orange-300 underline flex items-center gap-1 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${resendingVerification ? 'animate-spin' : ''}`} />
              {t('authResendVerification')}
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-right">
          {(mode === 'register' || mode === 'profile') && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t('authFullName')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('authEnterFullName')}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
              </div>
            </div>
          )}

          {mode !== 'profile' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t('authEmailAddress')}
              </label>
              <div className="relative">
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('authEmailPlaceholder')}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors text-left"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
              </div>
            </div>
          )}

          {(mode === 'register' || mode === 'profile') && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t('authRoleExpertise')}
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value="Full-Stack Developer">برنامه‌نویس فول‌استک (Full-Stack)</option>
                  <option value="Frontend Specialist">متخصص فرانت‌اند (Frontend)</option>
                  <option value="Backend Specialist">متخصص بک‌اند (Backend)</option>
                  <option value="Technical Lead / PM">مدیر فنی و مدیر پروژه (Tech Lead)</option>
                  <option value="UI/UX & Web Designer">طراح وب و رابط کاربری (UI/UX)</option>
                  <option value="Freelance Webmaster">فریلنسر و وب‌مستر مستقل</option>
                </select>
                <Briefcase className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
              </div>
            </div>
          )}

          {mode !== 'profile' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {mode === 'forgot-password' ? 'Email Address' : t('authLoginPassword')}
              </label>
              <div className="relative">
                {mode === 'forgot-password' ? (
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('authEmailPlaceholder')}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors text-left"
                  />
                ) : (
                  <input
                    type="password"
                    dir="ltr"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('authPasswordPlaceholder')}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors text-left"
                  />
                )}
                {mode === 'forgot-password' ? (
                  <Mail className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
                )}
              </div>
            </div>
          )}

          {/* Forgot Password Link */}
          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setMode('forgot-password');
                  setPassword('');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Back to Login from Forgot Password */}
          {mode === 'forgot-password' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs text-slate-400 hover:text-slate-300"
              >
                ← Back to login
              </button>
            </div>
          )}

          {mode === 'profile' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                تغییر رمز عبور (اختیاری):
              </label>
              <div className="relative">
                <input
                  type="password"
                  dir="ltr"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="اگر نمی‌خواهید تغییر کند خالی بگذارید"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors text-left"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
              </div>
            </div>
          )}

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{t('authProcessing')}</span>
              ) : (
                <>
                  {mode === 'login' && t('authLoginButton')}
                  {mode === 'register' && t('authRegisterButton')}
                  {mode === 'profile' && t('authSaveProfileButton')}
                  {mode === 'forgot-password' && 'Send Reset Email'}
                </>
              )}
            </button>

            {/* Google OAuth Button */}
            {(mode === 'login' || mode === 'register') && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-slate-900 text-slate-400">{t('authOr')}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-white text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            )}

            {mode === 'profile' && currentUser && (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2 px-4 rounded-xl border border-red-800/60 bg-red-950/30 hover:bg-red-900/40 text-red-300 text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                خروج از حساب کاربری
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
