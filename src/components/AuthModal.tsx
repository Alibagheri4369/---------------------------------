import { useState, FormEvent } from 'react';
  import { X, User as UserIcon, Mail, Lock, Briefcase, Check, Sparkles, LogOut } from 'lucide-react';
  import { User } from '../types';
  import { useI18n } from '../i18n/I18nProvider';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register' | 'profile';
  currentUser: User | null;
  onClose: () => void;
  onLogin: (email: string, pass: string) => boolean | Promise<boolean>;
  onRegister: (name: string, email: string, pass: string, role: string) => boolean | Promise<boolean>;
  onUpdateProfile: (name: string, role: string, newPassword?: string) => void | Promise<void>;
  onLogout: () => void;
}

export function AuthModal({
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
  const [mode, setMode] = useState<'login' | 'register' | 'profile'>(initialMode);
  
  // Form states
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [role, setRole] = useState(currentUser?.role || 'Full-Stack Developer');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
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
        if (password.length < 4) {
          setErrorMsg(t('authPasswordMinLength'));
          setIsSubmitting(false);
          return;
        }
        const ok = await onRegister(name.trim(), email.trim(), password, role);
        if (ok) {
          setSuccessMsg(t('authRegisterSuccess'));
          setTimeout(() => onClose(), 800);
        } else {
          setErrorMsg(t('authRegisterError'));
        }
      } else if (mode === 'login') {
        if (!email.trim() || !password) {
          setErrorMsg(t('authEmailRequired'));
          setIsSubmitting(false);
          return;
        }
        const ok = await onLogin(email.trim(), password);
        if (ok) {
          setSuccessMsg(t('authLoginSuccess'));
          setTimeout(() => onClose(), 700);
        } else {
          setErrorMsg(t('authLoginError'));
        }
      } else if (mode === 'profile') {
        if (!name.trim()) {
          setErrorMsg(t('authProfileNameRequired'));
          setIsSubmitting(false);
          return;
        }
        await onUpdateProfile(name.trim(), role, newPassword || undefined);
        setSuccessMsg(t('authProfileUpdateSuccess'));
        setTimeout(() => onClose(), 900);
      }
    } catch (err: any) {
      setErrorMsg(t('authGenericError'));
    } finally {
      setIsSubmitting(false);
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
        {mode !== 'profile' && (
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl mb-5 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessMsg('');
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
          <div className="mb-4 p-2.5 rounded-lg bg-red-950/70 border border-red-800/80 text-red-300 text-xs text-right">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-xs text-right flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
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
                {t('authLoginPassword')}
              </label>
              <div className="relative">
                <input
                  type="password"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('authPasswordPlaceholder')}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors text-left"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
              </div>
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
                </>
              )}
            </button>

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
