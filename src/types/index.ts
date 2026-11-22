// ============================================================
// STIOOS GLOBAL — Core Type System
// ============================================================

export type ID = string;

export type EntityStatus = "active" | "disabled";
export type ServiceStatus = "draft" | "published" | "archived";
export type UserStatus = "active" | "inactive" | "suspended";
export type InquiryStatus = "new" | "in_progress" | "contacted" | "closed";
export type InquiryType = "quote" | "service_request" | "contact" | "consultation";
export type DeliveryType =
  | "project"
  | "subscription"
  | "retainer"
  | "on_demand"
  | "self_serve";

// ---------- Marketplace ----------

export interface Subcategory {
  id: ID;
  name: string;
  slug: string;
  categoryId: ID;
  description: string;
  status: EntityStatus;
  createdAt: string;
}

export interface Category {
  id: ID;
  name: string;
  slug: string;
  icon: string; // lucide icon key
  tagline: string;
  description: string;
  status: EntityStatus;
  featured: boolean;
  createdAt: string;
}

export interface ServiceProcessStep {
  title: string;
  description: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  id: ID;
  name: string;
  slug: string;
  categoryId: ID;
  subcategoryId: ID;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  industries: string[];
  deliveryType: DeliveryType;
  timeline: string;
  rating: number;
  reviews: number;
  popularity: number;
  featured: boolean;
  status: ServiceStatus;
  accent: string; // tailwind gradient classes for visual
  icon: string; // lucide icon key
  problemsSolved: string[];
  capabilities: string[];
  deliverables: string[];
  process: ServiceProcessStep[];
  technologies: string[];
  faqs: ServiceFaq[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// ---------- People ----------

export interface User {
  id: ID;
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  status: UserStatus;
  role: "buyer" | "member";
  inquiriesCount: number;
  createdAt: string;
  lastActive: string;
  /** demo-only password for marketplace sign-in (frontend-only app) */
  password?: string;
  // ---- buyer registration (serious-buyer capture form) ----
  /** registration track chosen at signup: individual professional vs organization */
  registrationType?: "professional" | "company";
  /** organization classification chosen at registration (Startup / Enterprise / …) */
  accountType?: string;
  /** professional/individual buyers: role or job title (e.g. "Product Manager") */
  profession?: string;
  /** company/organization buyers: declared team size (e.g. "11–50 people") */
  companySize?: string;
  /** dial code captured with the mobile number (e.g. "+91") */
  phoneCountry?: string;
  /** declared buying intent from the qualification step */
  intent?: string;
  /** declared expected project start */
  intentTimeline?: string;
  /** which surface captured the registration (signup-page / lead-modal / …) */
  registrationSource?: string;
}

export interface AdminUser {
  id: ID;
  name: string;
  email: string;
  phone: string;
  roleId: ID;
  status: UserStatus;
  title: string;
  lastActive: string;
  createdAt: string;
  avatarInitials?: string;
}

export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "publish"
  | "manage";

export type ModuleKey =
  | "dashboard"
  | "marketplace"
  | "services"
  | "categories"
  | "subcategories"
  | "featured"
  | "orders"
  | "homepage"
  | "pages"
  | "industries"
  | "insights"
  | "resources"
  | "faqs"
  | "users"
  | "admins"
  | "roles"
  | "permissions"
  | "inquiries"
  | "notifications"
  | "activity"
  | "settings"
  | "branding"
  | "navigation";

export type PermissionMatrix = Record<ModuleKey, PermissionAction[]>;

export interface Role {
  id: ID;
  name: string;
  slug: string;
  description: string;
  permissions: PermissionMatrix;
  isSystem: boolean;
  createdAt: string;
}

// ---------- Engagement ----------

export interface Inquiry {
  id: ID;
  name: string;
  email: string;
  company: string;
  phone: string;
  type: InquiryType;
  serviceId?: ID;
  serviceName?: string;
  requirements: string;
  budgetRange: string;
  timeline: string;
  status: InquiryStatus;
  createdAt: string;
}

export type NotificationType =
  | "service_request"
  | "contact_inquiry"
  | "admin_created"
  | "service_published"
  | "content_updated"
  | "system";

export interface AppNotification {
  id: ID;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: ID;
  actor: string;
  action: string;
  module: string;
  target: string;
  description: string;
  createdAt: string;
}

// ---------- Content ----------

export interface Industry {
  id: ID;
  name: string;
  slug: string;
  icon: string;
  description: string;
  servicesCount: number;
  status: EntityStatus;
}

export interface Insight {
  id: ID;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
  publishedAt: string;
  status: "published" | "draft";
  accent: string;
}

export interface Resource {
  id: ID;
  title: string;
  slug: string;
  type: "guide" | "whitepaper" | "checklist" | "case_study" | "template";
  description: string;
  fileFormat: string;
  size: string;
  downloads: number;
  publishedAt: string;
  status: "published" | "draft";
  accent: string;
}

export interface FaqItem {
  id: ID;
  question: string;
  answer: string;
  category: string;
  status: "published" | "draft";
  order: number;
}

export interface HomepageContent {
  heroBadge: string;
  heroTitleTop: string;
  heroTitleBottom: string;
  heroSubtitle: string;
  primaryCta: string;
  secondaryCta: string;
  stats: { value: string; label: string }[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

export interface BrandSettings {
  siteName: string;
  tagline: string;
  supportEmail: string;
  salesEmail: string;
  phone: string;
  address: string;
}

export interface MarketplaceSettings {
  status: "live" | "maintenance";
  defaultSort: string;
  autoApproveServices: boolean;
  featuredSlots: number;
  // ---- service-page CTA labels (admin-editable, Task 47) ----
  /** hero primary button — opens the quote lead flow */
  heroCtaPrimary: string;
  /** hero secondary button — opens the consultation lead flow */
  heroCtaSecondary: string;
  /** engagement-card primary button — opens the service-request flow */
  cardCtaPrimary: string;
  /** engagement-card secondary button — opens the contact lead flow */
  cardCtaSecondary: string;
  /** when on, every conversion CTA first captures the visitor as a registered buyer */
  requireLeadRegistration: boolean;
}

// ---------- Search ----------

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  group: "Services" | "Categories" | "Industries" | "Insights" | "Resources" | "Pages";
  href: string;
  icon?: string;
}

// ---------- Marketplace (buyer ↔ STIOOS delivery team) ----------

export type MarketOrderStatus =
  | "pending"
  | "in_progress"
  | "delivered"
  | "completed"
  | "cancelled";

/**
 * Full buyer ↔ super-admin lifecycle:
 *   open → in_review → quoted → approved → ordered → paid → delivered → closed
 * Side exits: rejected (declined), closed-from-fulfilled (legacy/short-circuit).
 */
export type MarketRequestStatus =
  | "open"
  | "in_review"
  | "quoted"
  | "approved"
  | "ordered"
  | "paid"
  | "in_progress"
  | "delivered"
  | "fulfilled"
  | "rejected"
  | "closed";

/** The five buyer-side talent offerings plus generic marketplace service requests. */
export type RequestKind =
  | "service"
  | "train-to-hire"
  | "hire-to-train"
  | "talent-sourcing"
  | "end-to-end-staffing"
  | "post-a-job";

/** One entry in a request's tracking timeline. */
export interface RequestStatusEvent {
  status: MarketRequestStatus;
  note?: string;
  at: string;
  by: string;
}

export interface MarketOrder {
  id: ID;
  serviceId: ID;
  serviceSlug: string;
  serviceName: string;
  serviceIcon: string;
  buyerId: ID;
  buyerName: string;
  buyerCompany: string;
  amount: number;
  status: MarketOrderStatus;
  deliveryType: DeliveryType;
  placedAt: string;
  updatedAt: string;
  requirements?: string;
}

export interface MarketRequest {
  id: ID;
  buyerId: ID;
  buyerName: string;
  buyerCompany: string;
  categoryId: ID;
  categoryName: string;
  title: string;
  details: string;
  budgetRange: string;
  timeline: string;
  status: MarketRequestStatus;
  createdAt: string;
  /** Which offering produced this request — defaults to a generic marketplace service request. */
  kind?: RequestKind;
  /** Human-friendly tracking reference, e.g. REQ-8F3K2. */
  reference?: string;
  /** Structured answers captured by the kind-specific request form. */
  meta?: Record<string, string>;
  /** Full tracking timeline (submission + every admin action). */
  statusHistory?: RequestStatusEvent[];
  /** Quoted amount set by the platform when converting the request into an order. */
  quotedAmount?: number;
  /** Set once the request is converted into a marketplace order. */
  orderId?: ID | null;
  /** Reference to the Quote issued by the super-admin in response to this request. */
  quoteId?: ID | null;
  /** Reference to the Invoice generated when the order was created. */
  invoiceId?: ID | null;
  /** Reason captured when a buyer or admin declines a quote / request. */
  declineReason?: string;
}

// ---------- Quote / Invoice / Transaction (lifecycle billing entities) ----------

export interface QuoteItem {
  id: ID;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export type QuoteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "declined"
  | "expired";

export interface Quote {
  id: ID;
  /** Human-friendly reference, e.g. QUO-7H2KP. */
  reference: string;
  requestId: ID;
  requestReference?: string;
  buyerId: ID;
  buyerName: string;
  buyerCompany: string;
  /** Admin who issued the quote. */
  issuedById: ID;
  issuedByName: string;
  issuedAt: string;
  items: QuoteItem[];
  subtotal: number;
  /** Percentage applied to subtotal, e.g. 18. */
  taxRate: number;
  taxAmount: number;
  /** Flat discount applied after tax, if any. */
  discount: number;
  total: number;
  /** Number of days the quote is valid for after issuing. */
  validityDays: number;
  /** ISO date the quote expires on (issuedAt + validityDays). */
  validUntil: string;
  notes?: string;
  status: QuoteStatus;
  /** Free-text reason captured if the buyer declines. */
  declineReason?: string;
  declinedAt?: string;
  acceptedAt?: string;
}

export interface InvoiceItem {
  id: ID;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export type InvoiceStatus =
  | "draft"
  | "issued"
  | "paid"
  | "void"
  | "refunded";

export interface Invoice {
  id: ID;
  /** Human-friendly reference, e.g. INV-9K4QM. */
  reference: string;
  orderId: ID;
  requestId?: ID | null;
  quoteId?: ID | null;
  buyerId: ID;
  buyerName: string;
  buyerCompany: string;
  issuedById: ID;
  issuedByName: string;
  issuedAt: string;
  /** ISO date the payment is due. */
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  paidAt?: string;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
}

export type TransactionType =
  | "payment"
  | "refund"
  | "credit"
  | "debit"
  | "adjustment";

export type TransactionStatus =
  | "pending"
  | "success"
  | "failed"
  | "refunded";

export type PaymentMethod =
  | "card"
  | "bank_transfer"
  | "upi"
  | "wallet"
  | "manual";

export interface Transaction {
  id: ID;
  /** Human-friendly reference, e.g. TXN-3M8QF. */
  reference: string;
  type: TransactionType;
  invoiceId?: ID | null;
  orderId?: ID | null;
  requestId?: ID | null;
  quoteId?: ID | null;
  buyerId: ID;
  buyerName: string;
  buyerCompany: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: TransactionStatus;
  createdAt: string;
  description: string;
  initiatedById: ID;
  initiatedByName: string;
  /** Optional receipt / payment-gateway reference number. */
  gatewayReference?: string;
  meta?: Record<string, string>;
}

export interface MarketMessage {
  id: ID;
  threadId: ID;
  senderId: ID;
  senderName: string;
  senderRole: "buyer" | "team";
  body: string;
  sentAt: string;
}

export interface MarketThread {
  id: ID;
  serviceId: ID;
  serviceSlug: string;
  serviceName: string;
  serviceIcon: string;
  buyerId: ID;
  buyerName: string;
  teamId: ID;
  teamName: string;
  createdAt: string;
  lastMessageAt: string;
  messages: MarketMessage[];
}
