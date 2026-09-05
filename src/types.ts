export interface PricingCategory {
  id: string;
  name: string;
  color: string;
}

export interface PricingFeature {
  id: string;
  name: string;
  description: string;
  price: number; // in Millions of Tomans
  isEnabled: boolean;
  category: 'development' | 'setup' | 'integrations' | 'ongoing';
}

export interface PricingItem {
  id: string;
  category: 'development' | 'setup' | 'integrations' | 'ongoing';
  name: string;
  price: number;
  isEnabled: boolean;
  quantity: number;
  unit: 'تومان' | 'مورد' | 'روزانه' | 'ماهانه';
  description: string;
}

export interface ProjectPricing {
  projectId: string;
  categoryTotals: Record<string, number>;
  developmentTotal: number;
  setupTotal: number;
  integrationsTotal: number;
  ongoingTotal: number;
  grandTotal: number;
  currency: string;
}

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

export interface FeatureLibrary {
  features: PricingFeature[];
  categories: PricingCategory[];
  globalFeatures: PricingFeature[];
}