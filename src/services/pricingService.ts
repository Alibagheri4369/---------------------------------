import { userPartitionStorage } from './supabaseClient';

// Pricing Categories
export interface PricingCategory {
  id: string;
  name: string;
  color: string;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Feature Library (Global)
export interface FeatureLibrary {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isGlobal: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Project Pricing Items
export interface ProjectPricingItem {
  id: string;
  projectId: string;
  categoryId: string;
  featureId: string;
  name: string;
  price: number; // in Millions of Tomans (actual value, not scaled)
  quantity: number;
  unit: 'تومان' | 'مورد' | 'روزانه' | 'ماهانه';
  description: string;
  isEnabled: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Invoice
export interface Invoice {
  invoice_id: string;
  project_id: string;
  user_id: string;
  invoice_number: string;
  issue_date: string;
  subtotal: number;
  discount: number;
  tax: number;
  grand_total: number;
  status: 'draft' | 'pending' | 'paid' | 'cancelled';
  items: {
    project_pricing_item_id: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
  }[];
  created_at: string;
  due_date: string;
}

// Price Scale Configuration
export interface PriceScale {
  unit: number; // e.g., 1000 means 1 input = 1000 tomans
  label: string;
}

export const PRICE_SCALE_PRESETS: PriceScale[] = [
  { unit: 1, label: '1 = 1 تومان' },
  { unit: 100, label: '1 = 100 تومان' },
  { unit: 1000, label: '1 = 1,000 تومان' },
  { unit: 10000, label: '1 = 10,000 تومان' },
  { unit: 100000, label: '1 = 100,000 تومان' },
  { unit: 1000000, label: '1 = 1,000,000 تومان' },
];

export const DEFAULT_PRICE_SCALE = 1000;

/**
 * Generate a unique invoice number
 */
export function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EDX-${timestamp}-${random}`;
}

/**
 * Calculate real price from input value and scale
 */
export function calculateRealPrice(inputValue: number, scale: number): number {
  return inputValue * scale;
}

/**
 * Calculate category total
 */
export function calculateCategoryTotal(items: ProjectPricingItem[]): number {
  return items
    .filter((item) => item.isEnabled)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Calculate grand total for a project
 */
export function calculateGrandTotal(
  developmentItems: ProjectPricingItem[],
  setupItems: ProjectPricingItem[],
  integrationItems: ProjectPricingItem[],
  ongoingItems: ProjectPricingItem[],
  discount: number = 0,
  tax: number = 0
): {
  developmentTotal: number;
  setupTotal: number;
  integrationTotal: number;
  ongoingTotal: number;
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
} {
  const developmentTotal = calculateCategoryTotal(developmentItems);
  const setupTotal = calculateCategoryTotal(setupItems);
  const integrationTotal = calculateCategoryTotal(integrationItems);
  const ongoingTotal = calculateCategoryTotal(ongoingItems);

  const subtotal = developmentTotal + setupTotal + integrationTotal + ongoingTotal;
  const discountAmount = subtotal * (discount / 100);
  const taxAmount = (subtotal - discountAmount) * (tax / 100);
  const grandTotal = subtotal - discountAmount + taxAmount;

  return {
    developmentTotal,
    setupTotal,
    integrationTotal,
    ongoingTotal,
    subtotal,
    discount: discountAmount,
    tax: taxAmount,
    grandTotal,
  };
}

/**
 * Get pricing items for a specific project
 */
export function getProjectPricingItems(userId: string, projectId: string): ProjectPricingItem[] {
  const allItems = userPartitionStorage.getItem<ProjectPricingItem[]>(userId, 'pricing_items', []);
  return allItems.filter((item) => item.projectId === projectId);
}

/**
 * Save a pricing item for a project
 */
export function savePricingItem(userId: string, item: ProjectPricingItem): void {
  const allItems = userPartitionStorage.getItem<ProjectPricingItem[]>(userId, 'pricing_items', []);
  const existingIndex = allItems.findIndex((i) => i.id === item.id);

  if (existingIndex >= 0) {
    allItems[existingIndex] = { ...item, updatedAt: new Date().toISOString() };
  } else {
    allItems.push({ ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }

  userPartitionStorage.setItem(userId, 'pricing_items', allItems);
}

/**
 * Delete a pricing item
 */
export function deletePricingItem(userId: string, itemId: string): void {
  const allItems = userPartitionStorage.getItem<ProjectPricingItem[]>(userId, 'pricing_items', []);
  const filtered = allItems.filter((item) => item.id !== itemId);
  userPartitionStorage.setItem(userId, 'pricing_items', filtered);
}

/**
 * Get pricing categories for a project
 */
export function getPricingCategories(userId: string, projectId: string): PricingCategory[] {
  const allCategories = userPartitionStorage.getItem<PricingCategory[]>(userId, 'pricing_categories', []);
  return allCategories.filter((cat) => cat.projectId === projectId);
}

/**
 * Save a pricing category
 */
export function savePricingCategory(userId: string, category: PricingCategory): void {
  const allCategories = userPartitionStorage.getItem<PricingCategory[]>(userId, 'pricing_categories', []);
  const existingIndex = allCategories.findIndex((c) => c.id === category.id);

  if (existingIndex >= 0) {
    allCategories[existingIndex] = { ...category, updatedAt: new Date().toISOString() };
  } else {
    allCategories.push({ ...category, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }

  userPartitionStorage.setItem(userId, 'pricing_categories', allCategories);
}

/**
 * Delete a pricing category (with safety check)
 */
export function deletePricingCategory(userId: string, categoryId: string, projectId: string): { success: boolean; warning?: string } {
  const allCategories = userPartitionStorage.getItem<PricingCategory[]>(userId, 'pricing_categories', []);
  const category = allCategories.find((c) => c.id === categoryId);

  if (!category) {
    return { success: false, warning: 'دسته‌بندی یافت نشد.' };
  }

  // Check if category has pricing items
  const allItems = userPartitionStorage.getItem<ProjectPricingItem[]>(userId, 'pricing_items', []);
  const itemsInCategory = allItems.filter((item) => item.projectId === projectId && item.categoryId === categoryId);

  if (itemsInCategory.length > 0) {
    return {
      success: false,
      warning: `این دسته‌بندی دارای ${itemsInCategory.length} آیتم قیمت‌گذاری است. لطفاً ابتدا آیتم‌ها را حذف کنید.`,
    };
  }

  const filtered = allCategories.filter((c) => c.id !== categoryId);
  userPartitionStorage.setItem(userId, 'pricing_categories', filtered);
  return { success: true };
}

/**
 * Get feature library for a user
 */
export function getFeatureLibrary(userId: string): FeatureLibrary[] {
  return userPartitionStorage.getItem<FeatureLibrary[]>(userId, 'feature_library', []);
}

/**
 * Save a feature to the library
 */
export function saveFeatureLibraryItem(userId: string, feature: FeatureLibrary): void {
  const allFeatures = userPartitionStorage.getItem<FeatureLibrary[]>(userId, 'feature_library', []);
  const existingIndex = allFeatures.findIndex((f) => f.id === feature.id);

  if (existingIndex >= 0) {
    allFeatures[existingIndex] = { ...feature, updatedAt: new Date().toISOString() };
  } else {
    allFeatures.push({ ...feature, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }

  userPartitionStorage.setItem(userId, 'feature_library', allFeatures);
}

/**
 * Save an invoice
 */
export function saveInvoice(userId: string, invoice: Invoice): void {
  const allInvoices = userPartitionStorage.getItem<Invoice[]>(userId, 'invoices', []);
  const existingIndex = allInvoices.findIndex((inv) => inv.invoice_id === invoice.invoice_id);

  if (existingIndex >= 0) {
    allInvoices[existingIndex] = { ...invoice, created_at: new Date().toISOString() };
  } else {
    allInvoices.push({ ...invoice, created_at: new Date().toISOString() });
  }

  userPartitionStorage.setItem(userId, 'invoices', allInvoices);
}

/**
 * Get invoices for a project
 */
export function getProjectInvoices(userId: string, projectId: string): Invoice[] {
  const allInvoices = userPartitionStorage.getItem<Invoice[]>(userId, 'invoices', []);
  return allInvoices.filter((inv) => inv.project_id === projectId);
}