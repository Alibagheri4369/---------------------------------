import { useState } from 'react';
  import { 
    X, 
    Database, 
    CheckCircle2, 
    AlertTriangle, 
    Copy, 
    Check, 
    ExternalLink, 
    RefreshCw, 
    ShieldCheck, 
    Key, 
    Globe, 
    Server
  } from 'lucide-react';
  import { 
    getSupabaseConfig, 
    saveCustomSupabaseConfig, 
    clearCustomSupabaseConfig, 
    testSupabaseConnection 
  } from '../services/supabaseClient';
  import { User } from '../types';
  import { useI18n } from '../i18n/I18nProvider';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User | null;
  supabaseConnected?: boolean;
  onStatusChange?: () => void;
  onConnectionChange?: () => void;
}

export function CloudSyncModal({
  isOpen,
  onClose,
  currentUser,
  supabaseConnected = false,
  onStatusChange,
  onConnectionChange,
}: CloudSyncModalProps) {
  const { t } = useI18n();
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [isTesting, setIsTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(supabaseConnected);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const notifyChange = () => {
    onStatusChange?.();
    onConnectionChange?.();
  };

  const handleSaveAndTest = async () => {
    setIsTesting(true);
    setStatusMessage(null);
    try {
      saveCustomSupabaseConfig(url, anonKey);
      const res = await testSupabaseConnection();
      setIsSuccess(res.ok);
      setStatusMessage(res.message);
      notifyChange();
    } catch (e: any) {
      setIsSuccess(false);
      setStatusMessage(e?.message || t('cloudSyncConnectionError'));
    } finally {
      setIsTesting(false);
    }
  };

  const handleClear = () => {
    clearCustomSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setIsSuccess(false);
    setStatusMessage(t('cloudSyncClearSuccess'));
    notifyChange();
  };

  const sqlSchemaScript = `-- Supabase Schema & RLS for WebDev Roadmap
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  project_type TEXT NOT NULL,
  project_types JSONB DEFAULT '[]'::jsonb,
  business_model TEXT DEFAULT 'B2C',
  complexity TEXT DEFAULT 'Medium',
  budget TEXT,
  deadline TEXT,
  current_phase_id INTEGER DEFAULT 0,
  selected_modules JSONB DEFAULT '[]'::jsonb,
  tech_stack JSONB DEFAULT '{}'::jsonb,
  user_roles JSONB DEFAULT '[]'::jsonb,
  services JSONB DEFAULT '[]'::jsonb,
  ownerships JSONB DEFAULT '[]'::jsonb,
  completed_tasks JSONB DEFAULT '{}'::jsonb,
  custom_tasks JSONB DEFAULT '{}'::jsonb,
  phase_notes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.user_activities (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activities" ON public.user_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activities" ON public.user_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.user_notifications (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.user_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications"
  ON public.user_notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);
`;
  const copySql = () => {
    navigator.clipboard.writeText(sqlSchemaScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in text-right">
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{t('cloudSyncTitle')}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  supabaseConnected
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {supabaseConnected ? t('cloudSyncConnected') : t('cloudSyncIsolated')}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('cloudSyncDataIsolation')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={t('cloudSyncCloseButton')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="py-4 space-y-4 overflow-y-auto pr-0.5 text-xs">
          {/* User Account Info */}
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">{t('cloudSyncActiveAccount')}</span>
              <strong className="text-white font-mono">{currentUser ? currentUser.email : t('cloudSyncGuestUser')}</strong>
            </div>
            {currentUser && (
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>{t('cloudSyncUserId')}:</span>
                <span className="font-mono text-cyan-400 text-[10px]">{currentUser.id}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] pt-1 border-t border-slate-850">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{t('cloudSyncDataIsolation')}</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                <span>{t('cloudSyncUrlLabel')}</span>
                <span className="text-[10px] text-slate-500 font-mono">{t('cloudSyncUrlPlaceholder')}</span>
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  dir="ltr"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pr-9 pl-3 py-2.5 text-xs text-white font-mono outline-none min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                <span>{t('cloudSyncAnonKeyLabel')}</span>
                <span className="text-[10px] text-slate-500 font-mono">{t('cloudSyncAnonKeyPlaceholder')}</span>
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                  dir="ltr"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pr-9 pl-3 py-2.5 text-xs text-white font-mono outline-none min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3 rounded-xl border flex items-start gap-2 ${
              isSuccess 
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' 
                : 'bg-amber-950/60 border-amber-800 text-amber-300'
            }`}>
              {isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span className="text-xs">{statusMessage}</span>
            </div>
          )}

          {/* SQL Schema Copy Box */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>{t('cloudSyncSqlTitle')}</span>
              </div>
              <button
                onClick={copySql}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/30 transition-colors text-[11px] font-semibold cursor-pointer min-h-[34px]"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? t('cloudSyncSqlCopied') : t('cloudSyncCopySql')}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t('cloudSyncSqlDescription')}
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={handleClear}
            className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-slate-800 text-xs transition-colors cursor-pointer min-h-[44px]"
          >
            {t('cloudSyncClearButton')}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs transition-colors cursor-pointer min-h-[44px]"
            >
              {t('cloudSyncCloseButton')}
            </button>
            <button
              onClick={handleSaveAndTest}
              disabled={isTesting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer min-h-[44px] disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'در حال تست...' : 'ذخیره و تست اتصال'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
