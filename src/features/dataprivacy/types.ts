// Union Types
export type ConsentStatus = 'pending' | 'accepted' | 'rejected' | 'revoked' | 'withdrawn' | 'expired';
export type ConsentType = 'marketing' | 'analytics' | 'functional' | 'necessary' | 'third-party' | 'profiling' | 'automated_decisions';
export type DataCategory = 'personal' | 'financial' | 'health' | 'biometric' | 'behavioral' | 'location' | 'communications' | 'device';
export type RetentionUnit = 'days' | 'months' | 'years' | 'indefinite';
export type AnonymizationMethod = 'masking' | 'hashing' | 'tokenization' | 'aggregation' | 'pseudonymization' | 'k_anonymity' | 'differential_privacy';
export type AuditEventType = 'data_access' | 'data_modification' | 'data_deletion' | 'consent_change' | 'breach' | 'export' | 'compliance_check' | 'third_party_share';
export type ComplianceFramework = 'gdpr' | 'ccpa' | 'hipaa' | 'pci_dss' | 'sox' | 'iso_27001' | 'gdpr_uk' | 'pipl';
export type RequestStatus = 'submitted' | 'processing' | 'completed' | 'rejected' | 'pending_user_action' | 'expired';
export type RequestType = 'access' | 'deletion' | 'rectification' | 'portability' | 'restrict_processing' | 'object_processing';
export type DataRequestPriority = 'low' | 'medium' | 'high' | 'urgent';
export type AccessLevel = 'none' | 'view' | 'edit' | 'delete' | 'admin';
export type BreachSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ComplianceStatus = 'compliant' | 'partially_compliant' | 'non_compliant' | 'unknown' | 'under_review';

// Core Interfaces
export interface UserConsent {
  id: string;
  userId: string;
  consentType: ConsentType;
  status: ConsentStatus;
  consentedAt: Date;
  expiresAt?: Date;
  revokedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  consentVersion: string;
  documentUrl: string;
  legalBasis: string;
  legitimateInterest?: string;
}

export interface ConsentManagement {
  id: string;
  userId: string;
  totalConsents: number;
  acceptedCount: number;
  rejectedCount: number;
  revokedCount: number;
  lastUpdated: Date;
  consentHistory: UserConsent[];
  preferences: Record<ConsentType, ConsentStatus>;
}

export interface DataRetentionPolicy {
  id: string;
  dataCategory: DataCategory;
  retentionPeriod: number;
  retentionUnit: RetentionUnit;
  deleteAfter: boolean;
  anonymizeAfter?: boolean;
  lastReviewDate: Date;
  nextReviewDate: Date;
  description: string;
  createdBy: string;
}

export interface DataRetention {
  id: string;
  dataId: string;
  dataCategory: DataCategory;
  createdAt: Date;
  expirationDate: Date;
  shouldDelete: boolean;
  shouldAnonymize: boolean;
  status: 'active' | 'flagged_for_deletion' | 'deleted' | 'anonymized';
  deletedAt?: Date;
  anonymizedAt?: Date;
}

export interface AnonymizationRecord {
  id: string;
  dataId: string;
  dataCategory: DataCategory;
  anonymizationMethod: AnonymizationMethod;
  anonymizedAt: Date;
  reversible: boolean;
  methodParameters?: Record<string, any>;
  appliedBy: string;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface DataAccessLog {
  id: string;
  userId: string;
  dataCategory: DataCategory;
  accessType: 'read' | 'write' | 'delete';
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  reason?: string;
  approvedBy?: string;
  duration?: number;
  dataIds: string[];
}

export interface AuditLog {
  id: string;
  eventType: AuditEventType;
  userId: string;
  timestamp: Date;
  description: string;
  dataCategory?: DataCategory;
  affectedRecords: number;
  ipAddress: string;
  userAgent: string;
  complianceFramework: ComplianceFramework[];
  severity: 'info' | 'warning' | 'critical';
}

export interface ConsentTemplate {
  id: string;
  consentType: ConsentType;
  name: string;
  description: string;
  htmlContent: string;
  version: string;
  effectiveDate: Date;
  legalBasis: string;
  dataCategories: DataCategory[];
  thirdParties?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DataProcessor {
  id: string;
  name: string;
  location: string;
  processingActivities: string[];
  dataProcessingAgreement?: string;
  certifications: string[];
  subProcessors: string[];
  lastAuditDate?: Date;
  riskRating: 'low' | 'medium' | 'high';
}

export interface DataSubject {
  id: string;
  userId: string;
  email: string;
  consentPreferences: ConsentManagement;
  dataAccessLog: DataAccessLog[];
  dataRequests: DataSubjectRequest[];
  lastPreferenceUpdate: Date;
  gdprRelated: boolean;
}

export interface DataSubjectRequest {
  id: string;
  dataSubjectId: string;
  requestType: RequestType;
  status: RequestStatus;
  submittedAt: Date;
  deadline: Date;
  completedAt?: Date;
  priority: DataRequestPriority;
  description: string;
  responseFormat?: 'json' | 'csv' | 'pdf';
  dataCategories: DataCategory[];
  estimatedCompletionDate: Date;
}

export interface AccessControl {
  id: string;
  userId: string;
  resource: string;
  dataCategory: DataCategory;
  accessLevel: AccessLevel;
  grantedAt: Date;
  expiresAt?: Date;
  reason?: string;
  approvedBy: string;
  revokedAt?: Date;
}

export interface PrivacyImpactAssessment {
  id: string;
  projectName: string;
  projectDescription: string;
  createdAt: Date;
  lastUpdated: Date;
  completedAt?: Date;
  status: 'draft' | 'in_progress' | 'completed' | 'approved' | 'rejected';
  dataCategories: DataCategory[];
  riskLevel: 'low' | 'medium' | 'high';
  risks: PrivacyRisk[];
  mitigationMeasures: MitigationMeasure[];
  dataFlows: DataFlow[];
  thirdPartyInvolvement: boolean;
  automaticProcessing: boolean;
  largeScaleProcessing: boolean;
  assessedBy: string;
  approvedBy?: string;
}

export interface PrivacyRisk {
  id: string;
  piaId: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  likelihood: 'low' | 'medium' | 'high';
  riskScore: number; // 1-25
  affectedDataCategories: DataCategory[];
}

export interface MitigationMeasure {
  id: string;
  riskId: string;
  description: string;
  implementationDate: Date;
  owner: string;
  status: 'planned' | 'in_progress' | 'completed' | 'verified';
  verificationDate?: Date;
}

export interface DataFlow {
  id: string;
  piaId: string;
  source: string;
  destination: string;
  dataCategories: DataCategory[];
  frequency: string;
  encryptionRequired: boolean;
  retentionPeriod: string;
}

export interface ComplianceFrameworkMapping {
  id: string;
  framework: ComplianceFramework;
  requirements: ComplianceRequirement[];
  status: ComplianceStatus;
  lastAuditDate?: Date;
  nextAuditDate: Date;
  owner: string;
}

export interface ComplianceRequirement {
  id: string;
  frameworkId: string;
  requirementId: string;
  description: string;
  dataCategories: DataCategory[];
  status: ComplianceStatus;
  implementationDate?: Date;
  evidenceDocuments: string[];
  responsibleParty: string;
}

export interface DataBreachNotification {
  id: string;
  breachDate: Date;
  discoveryDate: Date;
  notificationDate: Date;
  severity: BreachSeverity;
  affectedRecords: number;
  affectedDataCategories: DataCategory[];
  description: string;
  rootCause: string;
  remediationSteps: string[];
  affectedUsers: number;
  regulatoryReport: boolean;
  mediaReport: boolean;
  status: 'under_investigation' | 'contained' | 'resolved' | 'closed';
  investigatedBy: string;
}

export interface ThirdPartyCompliance {
  id: string;
  processorId: string;
  complianceFramework: ComplianceFramework;
  certificationValid: boolean;
  certificationExpiryDate: Date;
  lastAuditScore: number; // 0-100
  dataProcessingAgreement: string;
  dpaSignedDate: Date;
  nextAuditDate: Date;
  riskRating: 'low' | 'medium' | 'high';
}

export interface PrivacyDashboard {
  totalConsents: number;
  acceptanceRate: number; // 0-100
  pendingRequests: number;
  openBreaches: number;
  complianceScore: number; // 0-100
  frameworksTracked: number;
  processorsAudited: number;
  recentBreaches: DataBreachNotification[];
  pendingDataRequests: DataSubjectRequest[];
  complianceStatus: Record<ComplianceFramework, ComplianceStatus>;
}

export interface DataPrivacyMetrics {
  period: { start: Date; end: Date };
  consentsProcessed: number;
  requestsCompleted: number;
  averageResponseTime: number; // days
  complianceViolations: number;
  breachesDetected: number;
  recordsAnonymized: number;
  recordsDeleted: number;
  auditLogsCount: number;
  thirdPartiesAudited: number;
}

export interface ResponseDataPrivacy {
  status: 'success' | 'error';
  code: number;
  message: string;
  data?: any;
  timestamp: Date;
}
