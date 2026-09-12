import { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Users, 
  AlertOctagon, 
  CheckCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus,
  Trash2,
  Lock,
  Globe,
  Server,
  CreditCard,
  MessageSquare,
  BarChart,
  Code
} from 'lucide-react';
import { Project, ExternalServiceAccount, OwnershipHandoverItem } from '../types';

interface AccountOwnershipViewProps {
  currentProject: Project | null;
  onUpdateServices: (services: ExternalServiceAccount[]) => void;
  onUpdateOwnerships: (ownerships: OwnershipHandoverItem[]) => void;
  onOpenNewProjectModal?: () => void;
}

export default function AccountOwnershipView({
  currentProject,
  onUpdateServices,
  onUpdateOwnerships,
  onOpenNewProjectModal,
}: AccountOwnershipViewProps) {
  const [activeTab, setActiveTab] = useState<'project_services' | 'handover_checklist' | 'guidelines'>('project_services');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New service modal state
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Hosting / Cloud');

  if (!currentProject) {
    return (
      <div className="p-8 sm:p-14 text-center bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 text-right animate-fade-in">
        <ShieldCheck className="w-14 h-14 text-cyan-400 mx-auto" />
        <h2 className="text-lg sm:text-xl font-bold text-white text-center">
          هیچ پروژه‌ای برای مدیریت مالکیت اکانت‌ها انتخاب نشده است
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto text-center leading-relaxed">
          برای تفکیک مالکیت دامنه، هاست، درگاه پرداخت و چک‌لیست قانونی تحویل سورس، لطفاً یک پروژه ایجاد کنید.
        </p>
        {onOpenNewProjectModal && (
          <div className="pt-2 text-center">
            <button
              onClick={onOpenNewProjectModal}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer min-h-[44px]"
            >
              + ایجاد اولین پروژه
            </button>
          </div>
        )}
      </div>
    );
  }
  const [newServiceOwner, setNewServiceOwner] = useState<'Client' | 'Developer' | 'Shared' | 'Third Party'>('Client');
  const [newAccessLevel, setNewAccessLevel] = useState('Developer / Invite');
  const [newAccountEmail, setNewAccountEmail] = useState('');

  const services: ExternalServiceAccount[] = currentProject.services || [];
  const ownerships: OwnershipHandoverItem[] = currentProject.ownerships || [];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleAddService = () => {
    if (!newServiceName.trim()) return;
    const newService: ExternalServiceAccount = {
      id: `srv_${Date.now()}`,
      serviceName: newServiceName.trim(),
      service: newServiceName.trim(),
      serviceCategory: newServiceCategory,
      owner: newServiceOwner,
      accessLevel: newAccessLevel,
      accountEmail: newAccountEmail.trim() || 'owner@clientdomain.ir',
      notes: '',
      status: 'Pending Client',
      setupPhase: 0,
    };
    onUpdateServices([...services, newService]);
    setNewServiceName('');
    setNewAccountEmail('');
    setIsAddServiceOpen(false);
  };

  const handleRemoveService = (serviceId: string) => {
    onUpdateServices(services.filter((s) => s.id !== serviceId));
  };

  const handleToggleServiceStatus = (serviceId: string) => {
    onUpdateServices(
      services.map((s) => {
        if (s.id !== serviceId) return s;
        const nextStatus: ExternalServiceAccount['status'] =
          s.status === 'Pending Client'
            ? 'Configured'
            : s.status === 'Configured'
            ? 'Verified'
            : s.status === 'Verified'
            ? 'Handed Over'
            : 'Pending Client';
        return { ...s, status: nextStatus };
      })
    );
  };

  const handleToggleHandoverStatus = (itemId: string) => {
    onUpdateOwnerships(
      ownerships.map((o) => {
        if (o.id !== itemId) return o;
        const nextStatus: OwnershipHandoverItem['status'] =
          o.status === 'Pending' ? 'Transferred' : o.status === 'Transferred' ? 'Verified by Client' : 'Pending';
        return { ...o, status: nextStatus };
      })
    );
  };

  const getStatusLabel = (status: ExternalServiceAccount['status']) => {
    switch (status) {
      case 'Pending Client':
        return 'در انتظار اقدام کارفرما';
      case 'Configured':
        return 'کانفیگ شده';
      case 'Verified':
        return 'تایید و تست شده ✓';
      case 'Handed Over':
        return 'تحویل قطعی شده ✓';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-right">
      {/* Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/40 p-4 sm:p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>ماتریس مالکیت حساب‌ها، سرویس‌ها و تحویل دارایی‌ها</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
              مدیریت حساب‌های خارجی و وضعیت انتقال مالکیت
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              اصل اساسی: <strong className="text-amber-300">Client = Owner</strong> و <strong className="text-cyan-300">Developer = Admin Access</strong>. مدیریت شفاف حساب‌های دامنه، هاست، درگاه، پیامک و تحویل نهایی برای «{currentProject.title}».
            </p>
          </div>

          <div className="w-full md:w-auto p-3.5 sm:p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-1 shrink-0">
            <div className="text-slate-400 font-medium">سیاست امنیت اطلاعات دولوپر:</div>
            <div className="text-emerald-400 font-semibold">✓ بدون ثبت پسورد خام کارفرما</div>
            <div className="text-slate-400 text-[11px]">فقط ثبت ایمیل مالک، نقش و وضعیت دسترسی</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Touch-friendly scrollable bar on mobile) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('project_services')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'project_services'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          سرویس‌ها و حساب‌ها ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('handover_checklist')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'handover_checklist'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          چک‌لیست تحویل دارایی‌ها ({ownerships.length})
        </button>
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'guidelines'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          معماری استاندارد اکانت‌ها
        </button>
      </div>

      {/* Tab 1: Project Services */}
      {activeTab === 'project_services' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-400" />
              <span>سرویس‌های خارجی ثبت‌شده برای پروژه</span>
            </h2>
            <button
              onClick={() => setIsAddServiceOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-amber-600/20 min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت سرویس جدید</span>
            </button>
          </div>

          {/* Add Service Inline / Mobile Form */}
          {isAddServiceOpen && (
            <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 sm:p-5 space-y-3 animate-fade-in">
              <h3 className="text-xs font-bold text-white">ثبت سرویس یا اکانت جدید پروژه</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">نام سرویس (مثلاً درگاه سداد، کاوه‌نگار)</label>
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none min-h-[44px]"
                    placeholder="نام سرویس..."
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">دسته‌بندی</label>
                  <select
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none min-h-[44px]"
                  >
                    <option value="Domain">دامنه اینترنتی (Domain)</option>
                    <option value="Hosting / Cloud">هاست و سرور ابری (Hosting)</option>
                    <option value="Payment">درگاه بانکی (Payment)</option>
                    <option value="SMS Gateway">سامانه پیامک (SMS)</option>
                    <option value="Analytics">آنالیتیکس و سئو (Analytics)</option>
                    <option value="Email">سرویس ایمیل (Email)</option>
                    <option value="AI API">کلید هوش مصنوعی (AI API)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">مالک قانونی</label>
                  <select
                    value={newServiceOwner}
                    onChange={(e) => setNewServiceOwner(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none min-h-[44px]"
                  >
                    <option value="Client">کارفرما (Client - استاندارد)</option>
                    <option value="Developer">توسعه‌دهنده (Developer)</option>
                    <option value="Shared">اشتراکی (Shared)</option>
                    <option value="Third Party">شخص ثالث (Third Party)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">ایمیل ثبت‌شده اکانت</label>
                  <input
                    type="text"
                    value={newAccountEmail}
                    onChange={(e) => setNewAccountEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none min-h-[44px]"
                    placeholder="owner@company.ir"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAddServiceOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white min-h-[44px]"
                >
                  انصراف
                </button>
                <button
                  onClick={handleAddService}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl min-h-[44px]"
                >
                  ذخیره سرویس
                </button>
              </div>
            </div>
          )}

          {/* =======================================================
              MOBILE VIEW: TOUCH SERVICE CARDS (< md screens)
              ======================================================= */}
          <div className="md:hidden space-y-3">
            {services.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-400 text-xs">
                هنوز سرویسی ثبت نشده است. روی «ثبت سرویس جدید» کلیک کنید.
              </div>
            ) : (
              services.map((srv) => (
                <div 
                  key={srv.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md text-xs text-right"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div>
                      <div className="font-bold text-white text-sm">{srv.serviceName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{srv.serviceCategory}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveService(srv.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                      title="حذف سرویس"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block mb-0.5">مالک قانونی:</span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-semibold ${
                          srv.owner === 'Client'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        }`}
                      >
                        {srv.owner === 'Client' ? 'کارفرما' : srv.owner}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">دسترسی دولوپر:</span>
                      <span className="text-slate-300 font-mono">{srv.accessLevel}</span>
                    </div>
                  </div>

                  {/* Email with copy button */}
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 flex items-center justify-between gap-2">
                    <div className="text-slate-300 font-mono text-[11px] truncate" dir="ltr">
                      {srv.accountEmail}
                    </div>
                    <button
                      onClick={() => handleCopy(srv.accountEmail, srv.id)}
                      className="text-slate-400 hover:text-cyan-300 p-1 cursor-pointer shrink-0"
                      title="کپی ایمیل"
                    >
                      {copiedId === srv.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Full-width status switcher */}
                  <button
                    onClick={() => handleToggleServiceStatus(srv.id)}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 ${
                      srv.status === 'Verified' || srv.status === 'Handed Over'
                        ? 'bg-emerald-600 text-white'
                        : srv.status === 'Configured'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-800 text-amber-300 border border-amber-800/40'
                    }`}
                  >
                    <span>وضعیت: {getStatusLabel(srv.status)}</span>
                    <span className="text-[10px] opacity-75">(لمس برای تغییر)</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* =======================================================
              DESKTOP VIEW: FULL TABLE (>= md screens)
              ======================================================= */}
          <div className="hidden md:block bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
            {services.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                هنوز سرویسی برای این پروژه ثبت نشده است. روی «ثبت سرویس جدید» کلیک کنید.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="p-3.5">سرویس و دسته</th>
                      <th className="p-3.5">مالک قانونی</th>
                      <th className="p-3.5">سطح دسترسی دولوپر</th>
                      <th className="p-3.5">ایمیل ثبت‌شده</th>
                      <th className="p-3.5">وضعیت راه‌اندازی</th>
                      <th className="p-3.5 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {services.map((srv) => (
                      <tr key={srv.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{srv.serviceName}</div>
                          <div className="text-[10px] text-slate-400">{srv.serviceCategory}</div>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              srv.owner === 'Client'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                                : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                            }`}
                          >
                            {srv.owner === 'Client' ? 'کارفرما (استاندارد)' : srv.owner}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-300 font-mono text-[11px]">{srv.accessLevel}</td>
                        <td className="p-3.5 text-slate-300 font-mono text-[11px]" dir="ltr">
                          {srv.accountEmail}
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => handleToggleServiceStatus(srv.id)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer min-h-[36px] ${
                              srv.status === 'Verified' || srv.status === 'Handed Over'
                                ? 'bg-emerald-600 text-white'
                                : srv.status === 'Configured'
                                ? 'bg-cyan-600 text-white'
                                : 'bg-slate-800 text-amber-300 border border-amber-800/40'
                            }`}
                            title="برای تغییر وضعیت کلیک کنید"
                          >
                            {getStatusLabel(srv.status)}
                          </button>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => handleRemoveService(srv.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-2 rounded-lg"
                            title="حذف سرویس"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Handover Checklist */}
      {activeTab === 'handover_checklist' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>چک‌لیست رسمی انتقال دارایی‌ها و سورس‌کد به کارفرما</span>
            </h2>
            <span className="text-xs text-slate-400">
              با لمس هر آیتم، وضعیت انتقال آن تغییر می‌کند
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ownerships.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleHandoverStatus(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[64px] select-none ${
                  item.status === 'Transferred' || item.status === 'Verified by Client'
                    ? 'bg-slate-900 border-emerald-500/60 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  {item.notes && <p className="text-[11px] text-slate-400 mt-1">{item.notes}</p>}
                </div>

                <div
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold shrink-0 ${
                    item.status === 'Verified by Client'
                      ? 'bg-emerald-600 text-white'
                      : item.status === 'Transferred'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.status === 'Pending' && 'در انتظار تحویل'}
                  {item.status === 'Transferred' && 'منتقل شده'}
                  {item.status === 'Verified by Client' && 'تایید کارفرما ✓'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Guidelines */}
      {activeTab === 'guidelines' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>معماری استاندارد اکانت‌های پروژه (Owner Account Pattern)</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            پیشنهاد استاندارد برای پروژه‌های شرکتی و استارتاپی، ایجاد ۳ آدرس ایمیل رسمی روی دامنه خود کارفرماست:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="font-mono text-cyan-400 font-bold" dir="ltr">owner@clientdomain.ir</div>
              <div className="font-bold text-white">مالک ارشد (Master Owner)</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">ثبت دامنه، هاستینگ و اکانت‌های بانکی با این ایمیل انجام می‌شود.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="font-mono text-emerald-400 font-bold" dir="ltr">dev@clientdomain.ir</div>
              <div className="font-bold text-white">دسترسی توسعه (Developer)</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">دسترسی دولوپر از طریق Invite به این ایمیل متصل می‌شود بدون افشای رمز عبور شخصی.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="font-mono text-amber-400 font-bold" dir="ltr">services@clientdomain.ir</div>
              <div className="font-bold text-white">سرویس‌ها و اعلان‌ها</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">دریافت وب‌هوک‌های مالی، پیامک‌های خطا و گزارش‌های مانیتورینگ آپ‌تایم.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
