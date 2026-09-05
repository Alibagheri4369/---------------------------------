export type AppLanguage = 'fa' | 'en' | 'de';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ColorTheme = 'default' | 'blue' | 'indigo' | 'purple' | 'emerald' | 'teal' | 'orange' | 'rose' | 'slate';

export type DateFormatPreference = 'jalali' | 'gregorian';

export type InterfaceDensity = 'comfortable' | 'compact';

export interface TranslationKeys {
  // Global
  appName: string;
  appDescription: string;
  
  // Navigation
  whereAmI: string;
  roadmap: string;
  checklist: string;
  architecture: string;
  modules: string;
  qaSecurity: string;
  ownership: string;
  pricing: string;
  aiAssistant: string;
  templates: string;
  profile: string;
  
  // Auth
  login: string;
  register: string;
  logout: string;
  guestMode: string;
  loginToSave: string;
  editProfile: string;
  
  // Profile sections
  accountInfo: string;
  settings: string;
  themeAppearance: string;
  productGuide: string;
  about: string;
  socials: string;
  
  // Account
  developerName: string;
  email: string;
  role: string;
  memberSince: string;
  projectsCount: string;
  completedTasks: string;
  noProjects: string;
  createFirstProject: string;
  dataSecurity: string;
  dataSecurityDesc: string;
  
  // Settings
  settingsTitle: string;
  settingsDesc: string;
  languageLabel: string;
  timezoneLabel: string;
  dateFormatLabel: string;
  densityLabel: string;
  saveSettings: string;
  saving: string;
  saved: string;
  
  // Language options
  languageFA: string;
  languageEN: string;
  languageDE: string;
  
  // Date formats
  jalali: string;
  gregorian: string;
  
  // Density
  comfortable: string;
  compact: string;
  
  // Timezones
  timezoneTehran: string;
  timezoneDubai: string;
  timezoneLondon: string;
  timezoneNewYork: string;
  timezoneUTC: string;
  
  // Theme
  themeTitle: string;
  themeDesc: string;
  themeModeLabel: string;
  colorThemeLabel: string;
  themeDark: string;
  themeLight: string;
  themeSystem: string;
  applyTheme: string;
  livePreview: string;
  primaryButton: string;
  activeBadge: string;
  progressBar: string;
  
  // Color themes
  colorDefault: string;
  colorBlue: string;
  colorEmerald: string;
  colorPurple: string;
  colorTeal: string;
  colorOrange: string;
  
  // Product Guide
  guideTitle: string;
  guideDesc: string;
  searchPlaceholder: string;
  whatIsIt: string;
  whatItDoes: string;
  whenToUse: string;
  steps: string;
  keyTips: string;
  
  // About
  aboutTitle: string;
  aboutSubtitle: string;
  aboutDescription: string;
  targetAudience: string;
  problemsSolved: string;
  modulesTitle: string;
  
  // Socials
  socialsTitle: string;
  officialChannels: string;
  
  // Footer
  connectedToSupabase: string;
  isolatedDatabase: string;
  officialTime: string;
  jalaliDate: string;
  
  // Modals
  newProject: string;
  cloudSync: string;
  authTitle: string;
  authLogin: string;
  authRegister: string;
  
  // AuthModal
  authNameRequired: string;
  authEmailRequired: string;
  authEmailValid: string;
  authPasswordMinLength: string;
  authRegisterSuccess: string;
  authRegisterError: string;
  authLoginSuccess: string;
  authLoginError: string;
  authProfileNameRequired: string;
  authProfileUpdateSuccess: string;
  authGenericError: string;
  authLoginTitle: string;
  authRegisterTitle: string;
  authProfileTitle: string;
  authLoginDescription: string;
  authRegisterDescription: string;
  authProfileDescription: string;
  authLoginWithPassword: string;
  authNewRegistration: string;
  authFullName: string;
  authEnterFullName: string;
  authEmailAddress: string;
  authEmailPlaceholder: string;
  authRoleExpertise: string;
  authLoginPassword: string;
  authPasswordPlaceholder: string;
  authChangePasswordOptional: string;
  authPasswordLeaveEmpty: string;
  authProcessing: string;
  authLoginButton: string;
  authRegisterButton: string;
  authSaveProfileButton: string;
  authLogoutButton: string;
  
  // CloudSyncModal
  cloudSyncTitle: string;
  cloudSyncSubtitle: string;
  cloudSyncActiveAccount: string;
  cloudSyncUserId: string;
  cloudSyncGuestUser: string;
  cloudSyncDataIsolation: string;
  cloudSyncUrlLabel: string;
  cloudSyncUrlPlaceholder: string;
  cloudSyncAnonKeyLabel: string;
  cloudSyncAnonKeyPlaceholder: string;
  cloudSyncStatusSuccess: string;
  cloudSyncStatusError: string;
  cloudSyncClearSettings: string;
  cloudSyncSqlTitle: string;
  cloudSyncSqlDescription: string;
  cloudSyncCopySql: string;
  cloudSyncSqlCopied: string;
  cloudSyncClearButton: string;
  cloudSyncCloseButton: string;
  cloudSyncSaveTestButton: string;
  cloudSyncTestingButton: string;
  cloudSyncConnected: string;
  cloudSyncIsolated: string;
  cloudSyncClearSuccess: string;
  cloudSyncConnectionError: string;
  
  // NewProjectModal
  newProjectTitle: string;
  newProjectSubtitle: string;
  newProjectStep1: string;
  newProjectStep2: string;
  newProjectStep3: string;
  newProjectStep4: string;
  newProjectProjectTitle: string;
  newProjectClientName: string;
  newProjectBudget: string;
  newProjectDeadline: string;
  newProjectProjectTypeSelection: string;
  newProjectSelectedTypesCount: string;
  newProjectSearchPlaceholder: string;
  newProjectBusinessModel: string;
  newProjectComplexity: string;
  newProjectTechStack: string;
  newProjectReviewSummary: string;
  newProjectProjectTitleSummary: string;
  newProjectClientNameSummary: string;
  newProjectBusinessModelSummary: string;
  newProjectComplexitySummary: string;
  newProjectPreviousStep: string;
  newProjectNextStep: string;
  newProjectCreateProject: string;
  newProjectCancel: string;
  newProjectTitleRequired: string;
  newProjectClientNameRequired: string;
  newProjectStepper: string;
  newProjectProjectTypeRequired: string;
  
  // Toast / Notifications
  syncInProgress: string;
  saveError: string;
  retry: string;
  copied: string;
  
  // Common
  loading: string;
  error: string;
  success: string;
  cancel: string;
  confirm: string;
  close: string;
  search: string;
  filter: string;
  sort: string;
  date: string;
  status: string;
  actions: string;
  
  // Projects
  projectTitle: string;
  clientName: string;
  projectType: string;
  deadline: string;
  budget: string;
  currentPhase: string;
  createProject: string;
  
  // Tasks
  task: string;
  completed: string;
  pending: string;
  addTask: string;
  deleteTask: string;
  
  // Profile specific
  profileTitle: string;
  profileSubtitle: string;
  personalInfo: string;
  technicalInfo: string;
  preferences: string;
  languageAndTime: string;
  visualTheme: string;
  whiteYellowBlack: string;
  comprehensiveGuide: string;
  aboutProduct: string;
  introduction: string;
  officialSocials: string;
  channelAndPage: string;
  accountSettings: string;
  configureLanguageCalendarTimezone: string;
  uiAppearance: string;
  densityDisplay: string;
  persistentSettings: string;
  isolatedDatabaseSettings: string;
  officialTimeSettings: string;
  jalaliDateSettings: string;
  
  // WhereAmIWidget
  whereAmIZeroStateSystem: string;
  whereAmIZeroStateNoProject: string;
  whereAmIZeroStateDescription: string;
  whereAmIZeroStateButton: string;
  whereAmIMetricsProjects: string;
  whereAmIMetricsProjectsCount: string;
  whereAmIMetricsCompletedTasks: string;
  whereAmIMetricsPendingTasks: string;
  whereAmIMetricsAverageProgress: string;
  whereAmIMetricsRealProgress: string;
  whereAmIChartProgressTitle: string;
  whereAmIChartNoData: string;
  whereAmIChartDistributionTitle: string;
  whereAmIChartNoClassification: string;
  whereAmIChartDescription: string;
  whereAmICompassGPS: string;
  whereAmINowIn: string;
  whereAmIPhaseWord: string;
  whereAmIPhaseColon: string;
  whereAmIProjectLabel: string;
  whereAmIClientLabel: string;
  whereAmITypeLabel: string;
  whereAmIModulesCount: string;
  whereAmIPhaseProgress: string;
  whereAmITasksDone: string;
  whereAmICompleted: string;
  whereAmITotalRoadmapProgress: string;
  whereAmITotalTasksDone: string;
  whereAmIPrevPhase: string;
  whereAmINextPhase: string;
  whereAmIEnterChecklist: string;
  whereAmIWhatToDoNow: string;
  whereAmIPendingTasks: string;
  whereAmIPriorityTasks: string;
  whereAmIPhaseCompleted: string;
  whereAmIReadyForNextPhase: string;
  whereAmIEnterNextPhase: string;
  whereAmINextPhaseTeaser: string;
  whereAmINextPhase: string;
  whereAmILifecycleEnd: string;
  whereAmINextPhaseTitle: string;
  whereAmINextPhaseDelivery: string;
  whereAmINextPhaseTip: string;
  whereAmILastPhase: string;
  whereAmIGoldenLaw: string;
  whereAmIGoldenLawDescription: string;

  // PhaseDetailView
  phaseDetailViewNoProject: string;
  phaseDetailViewNoProjectDescription: string;
  phaseDetailViewCreateFirstProject: string;
  phaseDetailViewJumpToPhase: string;
  phaseDetailViewPreviousPhase: string;
  phaseDetailViewNextPhase: string;
  phaseDetailViewSetCurrentPhase: string;
  phaseDetailViewCopyReportToClient: string;
  phaseDetailViewReportCopied: string;
  phaseDetailViewYourLocation: string;
  phaseDetailViewGoldenTips: string;
  phaseDetailViewTaskList: string;
  phaseDetailViewTouchTask: string;
  phaseDetailViewFilterAll: string;
  phaseDetailViewFilterRemaining: string;
  phaseDetailViewFilterCompleted: string;
  phaseDetailViewCustomTasksTitle: string;
  phaseDetailViewAddCustomTaskPlaceholder: string;
  phaseDetailViewAddCustomTaskButton: string;
  phaseDetailViewDeveloperNotesTitle: string;
  phaseDetailViewNoteSaved: string;
  phaseDetailViewNotePlaceholder: string;
  phaseDetailViewSaveNoteButton: string;

  // ArchitectureView
  architectureViewNoProject: string;
  architectureViewNoProjectDescription: string;
  architectureViewCreateFirstProject: string;
  architectureViewTitle: string;
  architectureViewSubtitle: string;
  architectureViewRole: string;
  architectureViewPresetsTitle: string;
  architectureViewPresetsDescription: string;
  architectureViewDiagramTitle: string;
  architectureViewDiagramLiveView: string;
  architectureViewLayer1Title: string;
  architectureViewLayer1CdnWaf: string;
  architectureViewLayer1Frontend: string;
  architectureViewLayer1SsgSsr: string;
  architectureViewLayer2Title: string;
  architectureViewLayer2Backend: string;
  architectureViewLayer2Auth: string;
  architectureViewLayer2AuthGuard: string;
  architectureViewLayer3Title: string;
  architectureViewLayer3Database: string;
  architectureViewLayer3Cache: string;
  architectureViewLayer3TransactionSpeed: string;
  architectureViewLayer4Title: string;
  architectureViewLayer4Storage: string;
  architectureViewLayer4Environment: string;
  architectureViewLayer4Containers: string;
  architectureViewCustomizeStackTitle: string;
  architectureViewFrontendLabel: string;
  architectureViewBackendLabel: string;
  architectureViewDatabaseLabel: string;
  architectureViewCacheLabel: string;
  architectureViewStorageLabel: string;
  architectureViewInfrastructureLabel: string;
  architectureViewCdnLabel: string;
  architectureViewAuthMethodLabel: string;
  architectureViewCssFrameworkLabel: string;
  architectureViewRolesTitle: string;
  architectureViewRolesDescription: string;
  architectureViewAddRolePlaceholder: string;
  architectureViewAddRoleButton: string;
  architectureViewCopyButton: string;
  architectureViewRemoveRoleTitle: string;

// TemplatesView
templatesViewTitle: string;
templatesViewDescription: string;
templatesViewRepoStructure: string;
templatesViewMasterChecklist: string;
templatesViewProjectRequirements: string;
templatesViewScopeOfWork: string;
templatesViewArchitecture: string;
templatesViewSlaMaintenance: string;
}

export type TranslationNamespace = keyof TranslationKeys;

export interface LocaleMessages {
  [key: string]: string;
}