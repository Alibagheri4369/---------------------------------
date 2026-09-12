export interface PricingCategory {
  id: string;
  name: string;
  color: string;
  projectId?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface UserPreferences {
  userId: string;
  themeMode: ThemeMode;
  colorTheme: ColorTheme;
  language: AppLanguage;
  timezone: string;
  dateFormat: DateFormatPreference;
  density: InterfaceDensity;
  updatedAt: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorTheme = 'default' | 'blue' | 'emerald' | 'purple' | 'teal' | 'orange';
export type AppLanguage = 'fa' | 'en' | 'de';
export type DateFormatPreference = 'jalali' | 'gregorian';
export type InterfaceDensity = 'comfortable' | 'compact';

// ============================================================================
// CORE DOMAIN TYPES - MATCHED TO SUPABASE SCHEMA
// ============================================================================

export interface User {
  id: string; // UUID from auth.users
  name: string; // display_name in user_profiles
  email: string;
  role: string;
  avatarColor: string; // avatar_color in user_profiles
  createdAt: string; // created_at
  photoUrl?: string; // photo_url
  lastLoginAt?: string; // last_login_at
}

export interface Project {
  id: string; // TEXT PRIMARY KEY
  userId: string; // user_id UUID
  title: string;
  clientName: string; // client_name
  projectType: string; // project_type
  projectTypes: string[]; // project_types TEXT[]
  businessModel: BusinessModel; // business_model
  complexity: ProjectComplexity;
  budget?: string;
  deadline?: string;
  currentPhaseId: number; // current_phase_id INTEGER
  selectedModules: string[]; // selected_modules TEXT[]
  techStack: TechStackConfig; // tech_stack JSONB
  userRoles: string[]; // user_roles TEXT[]
  services: any[]; // services JSONB
  ownerships: any[]; // ownerships JSONB
  completedTasks: Record<string, boolean>; // completed_tasks JSONB
  customTasks: Record<string, CustomTask[]>; // custom_tasks JSONB
  phaseNotes: Record<string, string>; // phase_notes JSONB
  createdAt: string; // created_at TIMESTAMPTZ
  updatedAt: string; // updated_at TIMESTAMPTZ
}

export interface Phase {
  id: number;
  number: number;
  title: string;
  titleEn: string;
  shortDesc?: string;
  category: string;
  color?: string;
  icon: string;
  description: string;
  deliverables: string[];
  tasks: Task[];
  estimatedDuration: string;
  dependencies?: number[];
  prerequisites?: string[];
  tips?: string[];
  groups?: TaskGroup[];
}

export interface TaskGroup {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  text?: string; // Display text
  title?: string; // Alternative to text
  description?: string;
  priority?: 'must' | 'should' | 'nice-to-have';
  estimatedTime?: string;
  dependencies?: string[];
  deliverables?: string[];
}

export interface CustomTask {
  id: string;
  phaseId: number;
  text?: string; // Display text
  title?: string; // Alternative to text
  description?: string;
  priority?: 'must' | 'should' | 'nice-to-have';
  completed: boolean;
  isDone?: boolean; // alias for completed
  createdAt: string;
}

export interface DbTask {
  id: string; // TEXT PRIMARY KEY
  userId: string; // user_id UUID
  projectId?: string; // project_id TEXT (nullable)
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string; // assigned_to UUID (nullable)
  dueDate?: string; // due_date TIMESTAMPTZ (nullable)
  completedAt?: string; // completed_at TIMESTAMPTZ (nullable)
  createdAt: string; // created_at TIMESTAMPTZ
  updatedAt: string; // updated_at TIMESTAMPTZ
}

export interface Client {
  id: string; // TEXT PRIMARY KEY
  userId: string; // user_id UUID
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  notes?: string;
  createdAt: string; // created_at TIMESTAMPTZ
  updatedAt: string; // updated_at TIMESTAMPTZ
}

export interface TechStackConfig {
  frontend?: string;
  backend?: string;
  database?: string;
  hosting?: string;
  cache?: string;
  storage?: string;
  api?: string;
  auth?: string;
  infrastructure?: string;
  cdn?: string;
  authMethod?: string;
  cssFramework?: string;
}

export type BusinessModel = 'B2C' | 'B2B' | 'SaaS' | 'E-commerce' | 'Marketplace' | 'Internal Tool';
export type ProjectComplexity = 'Simple' | 'Medium' | 'Complex' | 'Enterprise';
export type ModuleCategoryType = 'core' | 'auth' | 'panels' | 'commerce' | 'booking' | 'communication' | 'content' | 'data' | 'ai' | 'security' | 'devops';

export interface ModuleCategory {
  id: string;
  name: string;
  modules: Module[];
}

export interface ModuleTask {
  phaseId: number;
  groupId: string;
  groupTitle: string;
  taskId: string;
  taskText: string;
}

export interface Module {
  id: string;
  name?: string;
  nameFa?: string; // Alias for name
  nameEn?: string;
  description?: string;
  icon?: string;
  iconName?: string;
  applicable?: string[];
  phases?: number[];
  complexity?: number;
  category?: string;
  defaultTasks?: ModuleTask[];
}

// Alias for backward compatibility
export type ModuleDef = Module;

export interface ExternalServiceAccount {
  id: string;
  serviceName: string;
  service: string;
  serviceCategory: string;
  accountEmail: string;
  accessLevel: string;
  notes: string;
  owner: string;
  status: 'pending' | 'Pending' | 'Pending Client' | 'Transferred' | 'Verified by Client' | 'Verified' | 'Configured' | 'Handed Over';
  setupPhase?: number;
}

export interface OwnershipHandoverItem {
  id: string;
  category: string;
  item: string;
  title: string;
  status: 'pending' | 'in-progress' | 'done' | 'Pending' | 'Transferred' | 'Verified by Client';
  deadline: string;
  notes: string;
}

export interface Activity {
  id: string; // UUID
  userId: string; // user_id UUID
  projectId?: string; // project_id TEXT (nullable)
  action: string;
  description?: string;
  metadata?: Record<string, any>; // metadata JSONB
  createdAt: string; // created_at TIMESTAMPTZ
}

export interface AppNotification {
  id: string; // UUID
  userId: string; // user_id UUID
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: string; // created_at TIMESTAMPTZ
}

export interface Invoice {
  id: string; // TEXT PRIMARY KEY
  userId: string; // user_id UUID
  projectId?: string; // project_id TEXT (nullable)
  clientId?: string; // client_id TEXT (nullable)
  invoiceNumber: string; // invoice_number
  title: string;
  status: 'draft' | 'pending' | 'paid' | 'cancelled';
  totalAmount: number; // total_amount DECIMAL
  currency: string;
  dueDate?: string; // due_date TIMESTAMPTZ (nullable)
  paidAt?: string; // paid_at TIMESTAMPTZ (nullable)
  notes?: string;
  createdAt: string; // created_at TIMESTAMPTZ
  updatedAt: string; // updated_at TIMESTAMPTZ
}

export interface InvoiceItem {
  id: string; // UUID
  invoiceId: string; // invoice_id TEXT
  description: string;
  quantity: number; // DECIMAL
  unitPrice: number; // unit_price DECIMAL
  total: number; // DECIMAL
  createdAt: string; // created_at TIMESTAMPTZ
}

export interface Attachment {
  id: string; // UUID
  userId: string; // user_id UUID
  projectId?: string; // project_id TEXT (nullable)
  taskId?: string; // task_id TEXT (nullable)
  fileName: string; // file_name
  fileType?: string; // file_type
  fileSize?: number; // file_size BIGINT
  storagePath: string; // storage_path
  publicUrl?: string; // public_url
  createdAt: string; // created_at TIMESTAMPTZ
}


// Service Ownership for roadmap phases
export interface ServiceOwnership {
  service: string;
  owner: string;
  status: string;
  setupPhase?: number;
}
