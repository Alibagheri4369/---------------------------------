import { useState, useEffect, FormEvent } from 'react';
import {
  Calculator, Check, Copy, DollarSign, Layers, Plus, Trash2, FileText,
  Sparkles, Package, Search, Filter, ChevronDown, ChevronUp, AlertTriangle,
  Download, Printer, Save, X, Edit3, Hash
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Project } from '../types';
import {
  PricingCategory, ProjectPricingItem, FeatureLibrary, Invoice,
  PRICE_SCALE_PRESETS, DEFAULT_PRICE_SCALE,
  calculateRealPrice, calculateGrandTotal, generateInvoiceNumber,
  getPricingCategories, savePricingCategory, deletePricingCategory,
  getProjectPricingItems, savePricingItem, deletePricingItem,
  getFeatureLibrary, saveFeatureLibraryItem, saveInvoice, getProjectInvoices
} from '../services/pricingService';

// ==================== UTILITY ====================
function formatToman(amount: number): string {
  return amount.toLocaleString('fa-IR');
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Default categories
const DEFAULT_CATEGORIES: Omit<PricingCategory, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'توسعه و کدنویسی', color: 'text-cyan-400', projectId: '', userId: '', },
  { name: 'راه‌اندازی و زیرساخت', color: 'text-emerald-400', projectId: '', userId: '' },
  { name: 'اتصالات و سرویس‌ها', color: 'text-amber-400', projectId: '', userId: '' },
  { name: 'خدمات مستمر ماهانه', color: 'text-purple-400', projectId: '', userId: '' },
];

// Default feature library items
const DEFAULT_FEATURES: Omit<FeatureLibrary, 'id' | 'isGlobal' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'احراز هویت', description: 'سیستم لاگین و ثبت‌نام', price: 500, category: 'development' },
  { name: 'پنل ادمین', description: 'داشبورد مدیریت اختصاصی', price: 800, category: 'development' },
  { name: 'درگاه پرداخت', description: 'اتصال به درگاه بانکی', price: 400, category: 'integrations' },
  { name: 'سئو', description: 'بهینه‌سازی موتورهای جستجو', price: 300, category: 'setup' },
  { name: 'پشتیبانی فنی', description: 'خدمات پشتیبانی ماهانه', price: 200, category: 'ongoing' },
  { name: 'نقشه و موقعیت‌یاب', description: 'سرویس نقشه و GPS', price: 250, category: 'integrations' },
];

// ==================== MAIN COMPONENT ====================
interface PricingViewProps {
  currentProject: Project | null;
}

export default function PricingView({ currentProject }: PricingViewProps) {
  const { user: currentUser } = useAuth();
  const effectiveUserId = currentUser ? currentUser.id : 'guest_anonymous';

  // Project context
  const project = currentProject;
  const [projectName, setProjectName] = useState(project?.title ?? '');
  const [projectClient, setProjectClient] = useState(project?.clientName ?? '');
  const [projectCreatedAt, setProjectCreatedAt] = useState(project?.createdAt ?? '');

  // Keep project fields in sync when currentProject changes
  useEffect(() => {
    if (project) {
      setProjectName(project.title);
      setProjectClient(project.clientName);
      setProjectCreatedAt(project.createdAt);
    }
  }, [project?.id, project?.title, project?.clientName]);

  // Price Scale
  const [priceScale, setPriceScale] = useState<number>(DEFAULT_PRICE_SCALE);
  const [scaleLabel, setScaleLabel] = useState('1 = 1,000 تومان');

  // Categories
  const [categories, setCategories] = useState<PricingCategory[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showDeleteWarning, setShowDeleteWarning] = useState<string | null>(null);

  // Feature Library
  const [featureLibrary, setFeatureLibrary] = useState<FeatureLibrary[]>([]);
  const [showAddFeature, setShowAddFeature] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');
  const [newFeatureCat, setNewFeatureCat] = useState('development');
  const [newFeaturePrice, setNewFeaturePrice] = useState<number>(0);
  const [showFeatureSearch, setShowFeatureSearch] = useState(false);
  const [featureSearchQuery, setFeatureSearchQuery] = useState('');

  // Pricing Items (Project-specific)
  const [pricingItems, setPricingItems] = useState<ProjectPricingItem[]>([]);

  // Discount and Tax
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);

  // Invoice
  const [showInvoice, setShowInvoice] = useState(false);
  const [generatedInvoices, setGeneratedInvoices] = useState<Invoice[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<'pricing' | 'categories' | 'library' | 'invoice'>('pricing');
  const [copied, setCopied] = useState(false);

  // ==================== INITIALIZATION ====================
  useEffect(() => {
    if (!project) return;

    // Load categories for this project
    const savedCategories = getPricingCategories(effectiveUserId, project.id);
    if (savedCategories.length > 0) {
      setCategories(savedCategories);
    } else {
      // Create default categories for this project
      const defaultCats: PricingCategory[] = DEFAULT_CATEGORIES.map((cat) => ({
        ...cat,
        id: generateId(),
        projectId: project.id,
        userId: effectiveUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      defaultCats.forEach((cat) => savePricingCategory(effectiveUserId, cat));
      setCategories(defaultCats);
    }

    // Load feature library
    const lib = getFeatureLibrary(effectiveUserId);
    if (lib.length > 0) {
      setFeatureLibrary(lib);
    } else {
      // Seed default features
      DEFAULT_FEATURES.forEach((feat) => {
        saveFeatureLibraryItem(effectiveUserId, {
          ...feat,
          id: generateId(),
          isGlobal: true,
          userId: effectiveUserId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
      setFeatureLibrary(getFeatureLibrary(effectiveUserId));
    }

    // Load pricing items for this project
    const items = getProjectPricingItems(effectiveUserId, project.id);
    setPricingItems(items);

    // Load invoices
    const invoices = getProjectInvoices(effectiveUserId, project.id);
    setGeneratedInvoices(invoices);

    // Set project info
    setProjectName(project.title);
    setProjectClient(project.clientName);
    setProjectCreatedAt(project.createdAt);
  }, [effectiveUserId, project]);

  // ==================== CATEGORY MANAGEMENT ====================
  const handleAddCategory = (e: FormEvent) => {
    e.preventDefault();
    if (!project || !newCategoryName.trim()) return;

    const newCat: PricingCategory = {
      id: generateId(),
      name: newCategoryName.trim(),
      color: `text-${['cyan', 'emerald', 'amber', 'purple', 'rose', 'teal'][Math.floor(Math.random() * 6)]}-400`,
      projectId: project.id,
      userId: effectiveUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    savePricingCategory(effectiveUserId, newCat);
    setCategories([...categories, newCat]);
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    if (!project) return;

    // Check if category has pricing items
    const itemsInCat = pricingItems.filter((item) => item.categoryId === catId && item.projectId === project?.id);
    if (itemsInCat.length > 0) {
      setShowDeleteWarning(catId);
      return;
    }

    const result = deletePricingCategory(effectiveUserId, catId, project.id);
    if (result.success) {
      setCategories(categories.filter((c) => c.id !== catId));
    } else {
      alert(result.warning);
    }
  };

  const handleConfirmDeleteCategory = (catId: string) => {
    if (!project) return;
    const result = deletePricingCategory(effectiveUserId, catId, project.id);
    if (result.success) {
      setCategories(categories.filter((c) => c.id !== catId));
    }
    setShowDeleteWarning(null);
  };

  // ==================== FEATURE SELECTION ====================
  const selectedFeatures = pricingItems.filter((item) => item.isEnabled);

  const addFeatureToPricing = (feature: FeatureLibrary, categoryId?: string) => {
    if (!project) return;

    // Check if feature already added to this project
    const exists = pricingItems.find(
      (item) => item.featureId === feature.id && item.projectId === project.id
    );
    if (exists) return;

    const catId = categoryId ?? categories[0]?.id ?? generateId();
    // Price starts empty (0) - user must enter value manually
    const realPrice = 0;

    const newItem: ProjectPricingItem = {
      id: generateId(),
      projectId: project.id,
      categoryId: catId,
      featureId: feature.id,
      name: feature.name,
      price: realPrice,
      quantity: 1,
      unit: 'مورد',
      description: feature.description,
      isEnabled: true,
      userId: effectiveUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    savePricingItem(effectiveUserId, newItem);
    setPricingItems([...pricingItems, newItem]);
    setShowFeatureSearch(false);
    setFeatureSearchQuery('');
  };

  const removeFeatureFromPricing = (itemId: string) => {
    if (!project) return;
    deletePricingItem(effectiveUserId, itemId);
    setPricingItems(pricingItems.filter((item) => item.id !== itemId));
  };

  const toggleItemEnabled = (itemId: string) => {
    const updated = pricingItems.map((item) =>
      item.id === itemId ? { ...item, isEnabled: !item.isEnabled } : item
    );
    setPricingItems(updated);
    updated.forEach((item) => {
      if (item.id === itemId) savePricingItem(effectiveUserId, item);
    });
  };

  const updateItemPrice = (itemId: string, inputValue: number) => {
    const realPrice = calculateRealPrice(inputValue, priceScale);
    const updated = pricingItems.map((item) =>
      item.id === itemId ? { ...item, price: realPrice } : item
    );
    setPricingItems(updated);
    const changedItem = updated.find((i) => i.id === itemId);
    if (changedItem) savePricingItem(effectiveUserId, changedItem);
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    const updated = pricingItems.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    setPricingItems(updated);
    const changedItem = updated.find((i) => i.id === itemId);
    if (changedItem) savePricingItem(effectiveUserId, changedItem);
  };

  // Custom feature creation
  const handleAddCustomFeature = (e: FormEvent) => {
    e.preventDefault();
    if (!newFeatureName.trim()) return;

    const realPrice = calculateRealPrice(newFeaturePrice, priceScale);
    const newFeature: FeatureLibrary = {
      id: generateId(),
      name: newFeatureName.trim(),
      description: newFeatureDesc.trim(),
      price: realPrice,
      category: newFeatureCat,
      isGlobal: false,
      userId: effectiveUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveFeatureLibraryItem(effectiveUserId, newFeature);
    setFeatureLibrary([...featureLibrary, newFeature]);

    // Auto-add to pricing
    const catId = categories.find((c) => c.name === newFeatureCat)?.id ?? categories[0]?.id ?? generateId();
    const newItem: ProjectPricingItem = {
      id: generateId(),
      projectId: project!.id,
      categoryId: catId,
      featureId: newFeature.id,
      name: newFeature.name,
      price: realPrice,
      quantity: 1,
      unit: 'مورد',
      description: newFeature.description,
      isEnabled: true,
      userId: effectiveUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    savePricingItem(effectiveUserId, newItem);
    setPricingItems([...pricingItems, newItem]);

    // Reset form
    setNewFeatureName('');
    setNewFeatureDesc('');
    setNewFeaturePrice(0);
    setShowAddFeature(false);
  };

  // ==================== CALCULATIONS ====================
  const getItemsByCategory = (catId: string) => {
    return pricingItems.filter((item) => item.categoryId === catId && item.projectId === project?.id);
  };

  const getCategoryTotal = (catId: string) => {
    const items = getItemsByCategory(catId);
    return items
      .filter((item) => item.isEnabled)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getCategoryItemCount = (catId: string) => {
    return getItemsByCategory(catId).length;
  };

  const totals = calculateGrandTotal(
    getItemsByCategory(categories.find((c) => c.name?.includes('توسعه') || c.name?.includes('Development'))?.id ?? ''),
    getItemsByCategory(categories.find((c) => c.name?.includes('راه‌اندازی') || c.name?.includes('Setup'))?.id ?? ''),
    getItemsByCategory(categories.find((c) => c.name?.includes('اتصال') || c.name?.includes('integrations'))?.id ?? ''),
    getItemsByCategory(categories.find((c) => c.name?.includes('خدمات') || c.name?.includes('ongoing'))?.id ?? '')
  );

  const grandTotal = calculateGrandTotal(
    pricingItems.filter((i) => i.isEnabled && i.projectId === project?.id),
    pricingItems.filter((i) => i.isEnabled && i.projectId === project?.id),
    pricingItems.filter((i) => i.isEnabled && i.projectId === project?.id),
    pricingItems.filter((i) => i.isEnabled && i.projectId === project?.id),
    discountPercent,
    taxPercent
  );

  const grandTotalValue = (() => {
    const devTotal = getItemsByCategory(categories.find((c) => c.name?.includes('توسعه'))?.id ?? '').filter(i => i.isEnabled).reduce((s, i) => s + i.price * i.quantity, 0);
    const setupTotal = getItemsByCategory(categories.find((c) => c.name?.includes('راه‌اندازی'))?.id ?? '').filter(i => i.isEnabled).reduce((s, i) => s + i.price * i.quantity, 0);
    const intTotal = getItemsByCategory(categories.find((c) => c.name?.includes('اتصال') || c.name?.includes('integrations'))?.id ?? '').filter(i => i.isEnabled).reduce((s, i) => s + i.price * i.quantity, 0);
    const ongTotal = getItemsByCategory(categories.find((c) => c.name?.includes('خدمات') || c.name?.includes('ongoing'))?.id ?? '').filter(i => i.isEnabled).reduce((s, i) => s + i.price * i.quantity, 0);
    const sub = devTotal + setupTotal + intTotal + ongTotal;
    const disc = sub * (discountPercent / 100);
    const tx = (sub - disc) * (taxPercent / 100);
    return { subTotal: sub, discount: disc, tax: tx, grand: sub - disc + tx, devTotal, setupTotal, intTotal, ongTotal };
  })();

  // ==================== INVOICE ====================
  const generateInvoice = () => {
    if (!project) return;

    const invoiceNumber = generateInvoiceNumber();
    const items = pricingItems.filter((item) => item.projectId === project.id && item.isEnabled);
    const invoice: Invoice = {
      invoice_id: generateId(),
      project_id: project.id,
      user_id: effectiveUserId,
      invoice_number: invoiceNumber,
      issue_date: new Date().toISOString(),
      subtotal: grandTotalValue.subTotal,
      discount: grandTotalValue.discount,
      tax: grandTotalValue.tax,
      grand_total: grandTotalValue.grand,
      status: 'draft',
      items: items.map((item) => ({
        project_pricing_item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
      })),
      created_at: new Date().toISOString(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    saveInvoice(effectiveUserId, invoice);
    setGeneratedInvoices([...generatedInvoices, invoice]);
    setShowInvoice(true);
  };

  const downloadPDF = () => {
    // Generate printable invoice content
    const invoiceContent = generatedInvoices.length > 0
      ? generatedInvoices[generatedInvoices.length - 1]
      : null;

    if (!invoiceContent) return;

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <title>فاکتور - ${invoiceContent.invoice_number}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap');
          body { font-family: 'Vazirmatn', sans-serif; padding: 40px; direction: rtl; background: #fff; color: #000; }
          .header { text-align: center; border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { font-size: 28px; margin: 0; }
          .header p { color: #666; margin: 5px 0 0; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
          .info-item { padding: 8px; }
          .info-label { font-weight: bold; color: #333; font-size: 13px; }
          .info-value { color: #555; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: right; font-size: 13px; }
          th { background: #f0f0f0; font-weight: bold; }
          .totals { text-align: left; margin-top: 20px; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #ccc; }
          .total-row.final { font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 12px; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 11px; border-top: 1px solid #eee; padding-top: 15px; }
          .print-btn { position: fixed; top: 20px; right: 20px; padding: 10px 20px; background: #007bff; color: #fff; border: none; cursor: pointer; font-size: 14px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">پرینت فاکتور</button>
        <div class="header">
          <h1>EDX CRM WEB FOV</h1>
          <p>صورت‌حساب پروژه</p>
        </div>
        <div class="info-grid">
          <div class="info-item"><div class="info-label">نام پروژه</div><div class="info-value">${project.title}</div></div>
          <div class="info-item"><div class="info-label">نام مشتری</div><div class="info-value">${project.clientName}</div></div>
          <div class="info-item"><div class="info-label">شماره فاکتور</div><div class="info-value">${invoiceContent.invoice_number}</div></div>
          <div class="info-item"><div class="info-label">تاریخ صدور</div><div class="info-value">${new Date(invoiceContent.issue_date).toLocaleDateString('fa-IR')}</div></div>
          <div class="info-item"><div class="info-label">تاریخ ایجاد پروژه</div><div class="info-value">${new Date(project.createdAt).toLocaleDateString('fa-IR')}</div></div>
          <div class="info-item"><div class="info-label">وضعیت</div><div class="info-value">${invoiceContent.status === 'draft' ? 'پیش‌نویس' : 'فعال'}</div></div>
        </div>
        <table>
          <thead>
            <tr><th>دسته‌بندی</th><th>قابلیت</th><th>توضیحات</th><th>تعداد</th><th>قیمت واحد</th><th>مجموع</th></tr>
          </thead>
          <tbody>
            ${invoiceContent.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td></td>
                <td></td>
                <td>${item.quantity}</td>
                <td>${formatToman(item.price)} تومان</td>
                <td>${formatToman(item.price * item.quantity)} تومان</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="totals">
          <div class="total-row"><span>جمع توسعه</span><span>${formatToman(grandTotalValue.devTotal)} تومان</span></div>
          <div class="total-row"><span>جمع راه‌اندازی</span><span>${formatToman(grandTotalValue.setupTotal)} تومان</span></div>
          <div class="total-row"><span>جمع اتصالات</span><span>${formatToman(grandTotalValue.intTotal)} تومان</span></div>
          <div class="total-row"><span>جمع خدمات ماهانه</span><span>${formatToman(grandTotalValue.ongTotal)} تومان</span></div>
          <div class="total-row"><span>تخفیف</span><span>${formatToman(grandTotalValue.discount)} تومان</span></div>
          <div class="total-row"><span>مالیات</span><span>${formatToman(grandTotalValue.tax)} تومان</span></div>
          <div class="total-row final"><span>مبلغ نهایی</span><span>${formatToman(grandTotalValue.grand)} تومان</span></div>
        </div>
        <div class="footer">
          <p>این فاکتور تولیدشده توسط EDX CRM WEB FOV است.</p>
          <p>شماره فاکتور: ${invoiceContent.invoice_number}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${invoiceContent.invoice_number}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printInvoice = () => {
    window.print();
  };

  // ==================== RENDER ====================
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <Package className="w-16 h-16 text-slate-600" />
        <h2 className="text-xl font-bold text-slate-300">پروژه‌ای انتخاب نشده است</h2>
        <p className="text-sm text-slate-500">لطفاً ابتدا یک پروژه را انتخاب کنید تا بتوانید قیمت‌گذاری انجام دهید.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right dir-[rtl]" dir="rtl">
      {/* ==================== PROJECT HEADER ==================== */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">نام پروژه</label>
            <div className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold">
              {projectName || project.title}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">نام مشتری</label>
            <div className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white">
              {projectClient || project.clientName}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">تاریخ ایجاد</label>
            <div className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white">
              {projectCreatedAt ? new Date(projectCreatedAt).toLocaleDateString('fa-IR') : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== PRICE SCALE SELECTOR ==================== */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-white">مقیاس قیمت</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PRICE_SCALE_PRESETS.map((preset) => (
              <button
                key={preset.unit}
                onClick={() => { setPriceScale(preset.unit); setScaleLabel(preset.label); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] cursor-pointer ${
                  priceScale === preset.unit
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-slate-950 border border-slate-700 text-slate-300 hover:border-amber-500'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-400 bg-slate-950 px-3 py-2 rounded-lg border border-slate-700">
            {scaleLabel && `هر واحد ورودی = ${scaleLabel.split('=')[1].trim()}`}
          </div>
        </div>
      </div>

      {/* ==================== NAVIGATION TABS ==================== */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'pricing', label: 'پنل قیمت‌گذاری' },
          { key: 'categories', label: 'مدیریت دسته‌بندی‌ها' },
          { key: 'library', label: 'کتابخانه قابلیت‌ها' },
          { key: 'invoice', label: 'فاکتورها' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] cursor-pointer ${
              activeTab === tab.key
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== TAB: PRICING ==================== */}
      {activeTab === 'pricing' && (
        <div className="space-y-4">
          {/* Big Total */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-black text-white mb-3">خلاصه قیمت‌گذاری</h3>
                <div className="space-y-2">
                  {[
                    { label: 'هزینه توسعه', value: grandTotalValue.devTotal },
                    { label: 'هزینه راه‌اندازی', value: grandTotalValue.setupTotal },
                    { label: 'هزینه اتصالات', value: grandTotalValue.intTotal },
                    { label: 'هزینه خدمات ماهانه', value: grandTotalValue.ongTotal },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="text-white font-mono">{formatToman(item.value)} تومان</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-700 pt-2 flex justify-between text-sm">
                    <span className="text-slate-400">جمع کل</span>
                    <span className="text-white font-mono font-bold">{formatToman(grandTotalValue.subTotal)} تومان</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {/* Discount */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 w-20">تخفیف:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent > 0 ? discountPercent : ''}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white text-center focus:outline-none focus:border-amber-500 min-h-[36px]"
                  />
                  <span className="text-xs text-slate-400">٪</span>
                </div>
                {/* Tax */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 w-20">مالیات:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxPercent > 0 ? taxPercent : ''}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white text-center focus:outline-none focus:border-amber-500 min-h-[36px]"
                  />
                  <span className="text-xs text-slate-400">٪</span>
                </div>
                {/* Grand Total */}
                <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-400">مبلغ نهایی</div>
                  <div className="text-3xl font-black text-amber-400 font-mono">
                    {formatToman(grandTotalValue.grand)} <span className="text-sm text-slate-400">تومان</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Cards with Pricing Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const catItems = pricingItems.filter((item) => item.categoryId === cat.id && item.projectId === project.id);
              const catTotal = getCategoryTotal(cat.id);
              const catItemCount = getCategoryItemCount(cat.id);

              return (
                <div key={cat.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <h3 className={`font-bold text-sm ${cat.color}`}>
                      {cat.name} ({catItemCount} آیتم)
                    </h3>
                    <span className="text-xs font-mono font-bold text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      جمع: {formatToman(catTotal)} تومان
                    </span>
                  </div>

                  {catItems.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-sm">
                      <p>هنوز قابلیتی اضافه نشده است.</p>
                      <p className="text-xs mt-1">از تب «کتابخانه قابلیت‌ها» آیتم اضافه کنید.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {catItems.map((item) => (
                        <div
                          key={item.id}
                          className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-xl border transition-all min-h-[48px] ${
                            item.isEnabled
                              ? 'bg-slate-950 border-slate-800'
                              : 'bg-slate-950/40 border-slate-900 opacity-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="checkbox"
                              checked={item.isEnabled}
                              onChange={() => toggleItemEnabled(item.id)}
                              className="rounded accent-cyan-500 w-5 h-5 cursor-pointer shrink-0"
                            />
                            <div className="flex-1">
                              <div className="text-xs font-medium text-white">{item.name}</div>
                              <div className="text-[10px] text-slate-500">{item.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <input
                              type="number"
                              min="0"
                              value={item.price > 0 ? item.price / priceScale : ''}
                              onChange={(e) => updateItemPrice(item.id, Number(e.target.value))}
                              className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-center disabled:opacity-40 min-h-[36px]"
                            />
                            <span className="text-[10px] text-slate-400">واحد</span>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(item.id, Number(e.target.value))}
                              className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white text-center min-h-[36px]"
                            />
                            <span className="text-[10px] text-slate-400">تعداد</span>
                            <button
                              type="button"
                              onClick={() => removeFeatureFromPricing(item.id)}
                              className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowFeatureSearch(true)}
              className="flex items-center gap-2 px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-cyan-600/20 min-h-[44px] cursor-pointer"
            >
              <Plus className="w-4 h-4" /> افزودن قابلیت از کتابخانه
            </button>
            <button
              onClick={generateInvoice}
              disabled={pricingItems.filter(i => i.isEnabled && i.projectId === project.id).length === 0}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-emerald-600/20 min-h-[44px] cursor-pointer"
            >
              <FileText className="w-4 h-4" /> ایجاد فاکتور
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB: CATEGORY MANAGEMENT ==================== */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white">مدیریت دسته‌بندی‌ها</h3>
            <button
              onClick={() => setShowAddCategory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors min-h-[40px] cursor-pointer"
            >
              <Plus className="w-4 h-4" /> افزودن دسته‌بندی
            </button>
          </div>

          {showAddCategory && (
            <form onSubmit={handleAddCategory} className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="نام دسته‌بندی جدید"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[44px]"
                required
              />
              <button type="submit" className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold min-h-[44px] cursor-pointer">
                افزودن
              </button>
              <button type="button" onClick={() => setShowAddCategory(false)} className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold min-h-[44px] cursor-pointer">
                لغو
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div key={cat.id} className="rounded-xl bg-slate-900 border border-slate-800 p-4 flex items-center justify-between">
                <div>
                  <div className={`font-bold text-sm ${cat.color}`}>{cat.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {pricingItems.filter(i => i.categoryId === cat.id && i.projectId === project.id).length} آیتم
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                    title="حذف دسته‌بندی"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Delete Warning Modal */}
          {showDeleteWarning && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900 border border-red-500 rounded-2xl p-6 max-w-md w-full space-y-4">
                <div className="flex items-center gap-3 text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                  <span className="font-bold">هشدار حذف دسته‌بندی</span>
                </div>
                <p className="text-sm text-slate-300">
                  آیا مطمئن هستید که می‌خواهید این دسته‌بندی را حذف کنید؟ این عمل قابل بازگشت نیست.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleConfirmDeleteCategory(showDeleteWarning)}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold cursor-pointer min-h-[44px]"
                  >
                    بله، حذف کن
                  </button>
                  <button
                    onClick={() => setShowDeleteWarning(null)}
                    className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-bold cursor-pointer min-h-[44px]"
                  >
                    لغو
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB: FEATURE LIBRARY ==================== */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white">کتابخانه قابلیت‌ها</h3>
            <button
              onClick={() => setShowAddFeature(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors min-h-[40px] cursor-pointer"
            >
              <Plus className="w-4 h-4" /> افزودن قابلیت جدید
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={featureSearchQuery}
              onChange={(e) => setFeatureSearchQuery(e.target.value)}
              placeholder="جستجوی قابلیت..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[44px]"
            />
          </div>

          {/* Add Custom Feature Form */}
          {showAddFeature && (
            <form onSubmit={handleAddCustomFeature} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <input
                type="text"
                value={newFeatureName}
                onChange={(e) => setNewFeatureName(e.target.value)}
                placeholder="نام قابلیت"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[44px]"
                required
              />
              <textarea
                value={newFeatureDesc}
                onChange={(e) => setNewFeatureDesc(e.target.value)}
                placeholder="توضیحات"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[44px]"
              />
              <div className="flex flex-wrap gap-3">
                <select
                  value={newFeatureCat}
                  onChange={(e) => setNewFeatureCat(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 min-h-[44px]"
                >
                  <option value="development">توسعه</option>
                  <option value="setup">راه‌اندازی</option>
                  <option value="integrations">اتصالات</option>
                  <option value="ongoing">خدمات ماهانه</option>
                </select>
                <input
                  type="number"
                  min="0"
                  value={newFeaturePrice}
                  onChange={(e) => setNewFeaturePrice(Number(e.target.value))}
                  placeholder="قیمت (در واحد ورودی)"
                  className="flex-1 min-w-[150px] bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white text-center focus:outline-none focus:border-cyan-500 min-h-[44px]"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold min-h-[44px] cursor-pointer">
                  ذخیره و اضافه به قیمت‌گذاری
                </button>
                <button type="button" onClick={() => setShowAddFeature(false)} className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold min-h-[44px] cursor-pointer">
                  لغو
                </button>
              </div>
            </form>
          )}

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featureLibrary
              .filter((f) =>
                f.name.toLowerCase().includes(featureSearchQuery.toLowerCase()) ||
                f.description.toLowerCase().includes(featureSearchQuery.toLowerCase())
              )
              .map((feature) => {
                const alreadyAdded = pricingItems.some(
                  (item) => item.featureId === feature.id && item.projectId === project.id
                );
                const realPrice = feature.price;

                return (
                  <div key={feature.id} className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3">
                    <div>
                      <div className="font-bold text-sm text-white">{feature.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{feature.description}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-400 font-mono">
                        {formatToman(realPrice)} تومان
                      </span>
                      <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded-lg">
                        {feature.category}
                      </span>
                    </div>
                    {!alreadyAdded ? (
                      <button
                        onClick={() => addFeatureToPricing(feature)}
                        className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-colors min-h-[36px] cursor-pointer"
                      >
                        افزودن به پروژه
                      </button>
                    ) : (
                      <div className="w-full py-2 bg-emerald-600/30 text-emerald-400 rounded-lg text-xs font-bold text-center">
                        ✓ اضافه شده
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ==================== TAB: INVOICE ==================== */}
      {activeTab === 'invoice' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-white">فاکتورهای تولیدشده</h3>

          {generatedInvoices.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p>هنوز فاکتوری تولید نشده است.</p>
              <p className="text-xs mt-1">برای تولید فاکتور، از تب «پنل قیمت‌گذاری» اقدام کنید.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {generatedInvoices.map((inv) => (
                <div key={inv.invoice_id} className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-bold text-white">{inv.invoice_number}</span>
                      <span className="text-xs text-slate-500 mr-3">
                        {new Date(inv.issue_date).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      inv.status === 'draft' ? 'bg-slate-700 text-slate-300' :
                      inv.status === 'pending' ? 'bg-amber-900/30 text-amber-300' :
                      'bg-emerald-900/30 text-emerald-300'
                    }`}>
                      {inv.status === 'draft' ? 'پیش‌نویس' : inv.status === 'pending' ? 'در انتظار' : 'تأیید'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">مبلغ نهایی:</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">{formatToman(inv.grand_total)} تومان</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={downloadPDF}
                      className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold min-h-[36px] cursor-pointer"
                    >
                      <Download className="w-3 h-3" /> دانلود
                    </button>
                    <button
                      onClick={printInvoice}
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold min-h-[36px] cursor-pointer"
                    >
                      <Printer className="w-3 h-3" /> چاپ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== FEATURE SEARCH MODAL ==================== */}
      {showFeatureSearch && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">انتخاب قابلیت از کتابخانه</h3>
              <button onClick={() => setShowFeatureSearch(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={featureSearchQuery}
                onChange={(e) => setFeatureSearchQuery(e.target.value)}
                placeholder="جستجو..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[44px]"
              />
            </div>
            <div className="space-y-2">
              {featureLibrary
                .filter((f) =>
                  f.name.toLowerCase().includes(featureSearchQuery.toLowerCase())
                )
                .map((feature) => {
                  const alreadyAdded = pricingItems.some(
                    (item) => item.featureId === feature.id && item.projectId === project.id
                  );
                  return (
                    <div key={feature.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div>
                        <div className="text-sm text-white font-medium">{feature.name}</div>
                        <div className="text-xs text-slate-500">{feature.description}</div>
                      </div>
                      {!alreadyAdded ? (
                        <button
                          onClick={() => addFeatureToPricing(feature)}
                          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold cursor-pointer min-h-[36px]"
                        >
                          افزودن
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-400">✓ اضافه شده</span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}