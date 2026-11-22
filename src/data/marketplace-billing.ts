import type {
  Invoice,
  MarketOrder,
  MarketRequest,
  MarketRequestStatus,
  Quote,
  RequestStatusEvent,
  Transaction,
} from "@/types";

// ============================================================
// MARKETPLACE BILLING SEED — Quotes, Invoices, Transactions
// and a lifecycle-rich set of Service Requests for the demo
// buyer (Daniel Osei, usr-001 — Vertex Build Group) so the
// buyer dashboard surfaces realistic data on every page.
// 100% frontend mock data hydrated into the zustand store.
// ============================================================

const ADM_ID = "adm-001";
const ADM_NAME = "Aarav Mehta";
const BUYER_ID = "usr-001";
const BUYER_NAME = "Daniel Osei";
const BUYER_COMPANY = "Vertex Build Group";

const iso = (d: string) => new Date(d).toISOString();
const daysFrom = (base: string, days: number) => {
  const t = new Date(base).getTime();
  return new Date(t + days * 86_400_000).toISOString();
};

// ---- Helper: build a request status timeline quickly ----
function timeline(
  created: string,
  events: Array<{
    status: MarketRequestStatus;
    at: string;
    by?: string;
    note?: string;
  }>
): RequestStatusEvent[] {
  return [
    {
      status: "open",
      at: created,
      by: BUYER_NAME,
      note: "Service request submitted",
    },
    ...events.map((e) => ({
      status: e.status,
      at: e.at,
      by: e.by ?? ADM_NAME,
      note: e.note,
    })),
  ];
}

// ============================================================
// LIFECYCLE SERVICE REQUESTS (one per stage, all owned by usr-001)
// ============================================================

export const LIFECYCLE_REQUESTS: MarketRequest[] = [
  // 1. OPEN — just submitted, awaiting admin review
  {
    id: "mr-lc-01",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    categoryId: "cat-ai-automation",
    categoryName: "AI & Automation",
    title: "Automated invoice processing pipeline",
    details:
      "Replace manual AP entry with an AI pipeline that reads invoices from a shared mailbox, validates against POs, and posts to NetSuite. ~1,200 invoices/month.",
    budgetRange: "$5,000 – $10,000",
    timeline: "4–6 weeks",
    status: "open",
    kind: "service",
    reference: "REQ-LC01A",
    statusHistory: timeline("2026-09-08T09:30:00.000Z", []),
    createdAt: "2026-09-08T09:30:00.000Z",
    orderId: null,
  },
  // 2. IN REVIEW — admin is reviewing
  {
    id: "mr-lc-02",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    categoryId: "cat-data-bi",
    categoryName: "Data & Business Intelligence",
    title: "Real-time fleet utilization dashboard",
    details:
      "Live dashboard showing equipment utilization across 14 sites. Pull from IoT gateway + SAP PM. Refresh ≤ 60s, role-based views.",
    budgetRange: "$10,000 – $25,000",
    timeline: "6–8 weeks",
    status: "in_review",
    kind: "service",
    reference: "REQ-LC02B",
    statusHistory: timeline("2026-09-05T14:00:00.000Z", [
      {
        status: "in_review",
        at: "2026-09-06T10:00:00.000Z",
        note: "Architecture review underway with the BI pod",
      },
    ]),
    createdAt: "2026-09-05T14:00:00.000Z",
    orderId: null,
  },
  // 3. QUOTED — admin has issued a quote, awaiting buyer decision
  {
    id: "mr-lc-03",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    categoryId: "cat-tech-programming",
    categoryName: "Technology & Programming",
    title: "Customer portal rebuild (Next.js + Auth0)",
    details:
      "Rebuild the legacy customer portal on Next.js with SSO via Auth0, role-based access, and self-service order tracking. ~3,000 active users.",
    budgetRange: "$15,000 – $30,000",
    timeline: "8–10 weeks",
    status: "quoted",
    kind: "service",
    reference: "REQ-LC03C",
    quoteId: "quo-lc-03",
    statusHistory: timeline("2026-08-28T11:15:00.000Z", [
      {
        status: "in_review",
        at: "2026-08-29T09:00:00.000Z",
        note: "Scope walkthrough completed with engineering lead",
      },
      {
        status: "quoted",
        at: "2026-09-02T15:30:00.000Z",
        note: "Quote QUO-LC03C issued — valid for 14 days",
      },
    ]),
    createdAt: "2026-08-28T11:15:00.000Z",
    orderId: null,
  },
  // 4. APPROVED — buyer accepted the quote, awaiting admin to create order
  {
    id: "mr-lc-04",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    categoryId: "cat-marketing",
    categoryName: "Digital Sales & Marketing",
    title: "Lead scoring model + CRM enrichment",
    details:
      "Train a lead scoring model on 18 months of HubSpot data; enrich incoming leads with firmographics and intent signals. Score range 0–100, refreshed nightly.",
    budgetRange: "$5,000 – $10,000",
    timeline: "4–5 weeks",
    status: "approved",
    kind: "service",
    reference: "REQ-LC04D",
    quoteId: "quo-lc-04",
    statusHistory: timeline("2026-08-22T08:45:00.000Z", [
      {
        status: "in_review",
        at: "2026-08-23T10:30:00.000Z",
        note: "Data audit completed — training set is viable",
      },
      {
        status: "quoted",
        at: "2026-08-26T13:00:00.000Z",
        note: "Quote QUO-LC04D issued — valid for 14 days",
      },
      {
        status: "approved",
        at: "2026-09-04T09:15:00.000Z",
        by: BUYER_NAME,
        note: "Quote accepted — proceeding to order creation",
      },
    ]),
    createdAt: "2026-08-22T08:45:00.000Z",
    orderId: null,
  },
  // 5. ORDERED — admin created order + invoice, awaiting buyer payment
  {
    id: "mr-lc-05",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    categoryId: "cat-ai-agents",
    categoryName: "AI Automation & Agentic Solutions",
    title: "Field-service triage agent (multi-site)",
    details:
      "Agentic layer that triages incoming field-service requests, dispatches to the right crew, and writes back to ServiceNow. 4 sites initially.",
    budgetRange: "$15,000 – $30,000",
    timeline: "8–10 weeks",
    status: "ordered",
    kind: "service",
    reference: "REQ-LC05E",
    quoteId: "quo-lc-05",
    invoiceId: "inv-lc-05",
    orderId: "mo-lc-05",
    quotedAmount: 22800,
    statusHistory: timeline("2026-08-15T13:20:00.000Z", [
      {
        status: "in_review",
        at: "2026-08-16T09:00:00.000Z",
        note: "Scope call with field ops lead",
      },
      {
        status: "quoted",
        at: "2026-08-19T11:00:00.000Z",
        note: "Quote QUO-LC05E issued — valid for 14 days",
      },
      {
        status: "approved",
        at: "2026-08-25T10:00:00.000Z",
        by: BUYER_NAME,
        note: "Quote accepted — internal approval secured",
      },
      {
        status: "ordered",
        at: "2026-08-27T15:45:00.000Z",
        note: "Order mo-lc-05 created; invoice INV-LC05E issued — payment due in 7 days",
      },
    ]),
    createdAt: "2026-08-15T13:20:00.000Z",
  },
  // 6. PAID — buyer paid, work in progress (admin has not yet delivered)
  {
    id: "mr-lc-06",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    categoryId: "cat-tech-programming",
    categoryName: "Technology & Programming",
    title: "API gateway migration (Kong + rate-limiting)",
    details:
      "Migrate 47 internal services behind a Kong gateway with JWT auth, per-consumer rate limits, and request tracing. Zero-downtime cutover.",
    budgetRange: "$10,000 – $25,000",
    timeline: "6–8 weeks",
    status: "paid",
    kind: "service",
    reference: "REQ-LC06F",
    quoteId: "quo-lc-06",
    invoiceId: "inv-lc-06",
    orderId: "mo-lc-06",
    quotedAmount: 18900,
    statusHistory: timeline("2026-07-18T10:00:00.000Z", [
      {
        status: "in_review",
        at: "2026-07-19T09:30:00.000Z",
        note: "Service inventory + auth audit scheduled",
      },
      {
        status: "quoted",
        at: "2026-07-22T12:00:00.000Z",
        note: "Quote QUO-LC06F issued — valid for 14 days",
      },
      {
        status: "approved",
        at: "2026-07-28T09:00:00.000Z",
        by: BUYER_NAME,
        note: "Quote accepted",
      },
      {
        status: "ordered",
        at: "2026-07-30T11:00:00.000Z",
        note: "Order mo-lc-06 created; invoice INV-LC06F issued",
      },
      {
        status: "paid",
        at: "2026-08-04T16:20:00.000Z",
        by: BUYER_NAME,
        note: "Payment received via card — TXN-LC06F ($18,900)",
      },
    ]),
    createdAt: "2026-07-18T10:00:00.000Z",
  },
  // 7. DELIVERED — admin marked delivered, awaiting buyer acceptance
  {
    id: "mr-lc-07",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    categoryId: "cat-data-bi",
    categoryName: "Data & Business Intelligence",
    title: "Predictive maintenance model (fleet generators)",
    details:
      "Predictive maintenance model for 220 diesel generators — failure prediction 72h ahead with ≥ 85% precision. Outputs integrated into the CMMS.",
    budgetRange: "$15,000 – $30,000",
    timeline: "8–10 weeks",
    status: "delivered",
    kind: "service",
    reference: "REQ-LC07G",
    quoteId: "quo-lc-07",
    invoiceId: "inv-lc-07",
    orderId: "mo-lc-07",
    quotedAmount: 26400,
    statusHistory: timeline("2026-06-10T08:00:00.000Z", [
      {
        status: "in_review",
        at: "2026-06-11T10:00:00.000Z",
        note: "Sensor data audit completed",
      },
      {
        status: "quoted",
        at: "2026-06-15T13:00:00.000Z",
        note: "Quote QUO-LC07G issued — valid for 14 days",
      },
      {
        status: "approved",
        at: "2026-06-22T09:30:00.000Z",
        by: BUYER_NAME,
        note: "Quote accepted",
      },
      {
        status: "ordered",
        at: "2026-06-24T11:15:00.000Z",
        note: "Order mo-lc-07 created; invoice INV-LC07G issued",
      },
      {
        status: "paid",
        at: "2026-06-29T14:00:00.000Z",
        by: BUYER_NAME,
        note: "Payment received via bank transfer — TXN-LC07G ($26,400)",
      },
      {
        status: "delivered",
        at: "2026-09-03T16:30:00.000Z",
        note: "Delivery handed off — UAT env live, model in production",
      },
    ]),
    createdAt: "2026-06-10T08:00:00.000Z",
  },
  // 8. CLOSED — buyer accepted delivery, order completed
  {
    id: "mr-lc-08",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    categoryId: "cat-ai-automation",
    categoryName: "AI & Automation",
    title: "RFP response automation workflow",
    details:
      "Workflow that ingests an RFP PDF, drafts responses from a curated answer library, and routes for SME review. Cut response time from 5 days to 36 hours.",
    budgetRange: "$5,000 – $10,000",
    timeline: "4–6 weeks",
    status: "closed",
    kind: "service",
    reference: "REQ-LC08H",
    quoteId: "quo-lc-08",
    invoiceId: "inv-lc-08",
    orderId: "mo-lc-08",
    quotedAmount: 9200,
    statusHistory: timeline("2026-05-05T09:00:00.000Z", [
      {
        status: "in_review",
        at: "2026-05-06T10:30:00.000Z",
        note: "Workflow audit completed",
      },
      {
        status: "quoted",
        at: "2026-05-09T14:00:00.000Z",
        note: "Quote QUO-LC08H issued — valid for 14 days",
      },
      {
        status: "approved",
        at: "2026-05-14T09:00:00.000Z",
        by: BUYER_NAME,
        note: "Quote accepted",
      },
      {
        status: "ordered",
        at: "2026-05-16T11:00:00.000Z",
        note: "Order mo-lc-08 created; invoice INV-LC08H issued",
      },
      {
        status: "paid",
        at: "2026-05-20T13:45:00.000Z",
        by: BUYER_NAME,
        note: "Payment received via card — TXN-LC08H ($9,200)",
      },
      {
        status: "delivered",
        at: "2026-06-22T16:00:00.000Z",
        note: "Delivery handed off — workflow in production",
      },
      {
        status: "closed",
        at: "2026-06-28T10:15:00.000Z",
        by: BUYER_NAME,
        note: "Delivery accepted — order closed",
      },
    ]),
    createdAt: "2026-05-05T09:00:00.000Z",
  },
  // 9. TALENT — train-to-hire (currently quoted)
  {
    id: "mr-lc-09",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    categoryId: "cat-talent",
    categoryName: "Talent Solutions",
    title: "Train to Hire — 4 React/frontend engineers",
    details:
      "Hire for aptitude, train on our React + TypeScript + Next.js stack. Hybrid from our Austin hub. Certify in 8 weeks, deploy to product squads.",
    budgetRange: "$25,000+",
    timeline: "8–12 weeks",
    status: "quoted",
    kind: "train-to-hire",
    reference: "REQ-LC09I",
    quoteId: "quo-lc-09",
    meta: {
      headcount: "4",
      skills: "React, TypeScript, Next.js",
      workMode: "Hybrid",
      startDate: "Q4 2026",
    },
    statusHistory: timeline("2026-09-01T10:30:00.000Z", [
      {
        status: "in_review",
        at: "2026-09-02T09:00:00.000Z",
        note: "Cohort scorecard drafted",
      },
      {
        status: "quoted",
        at: "2026-09-05T15:00:00.000Z",
        note: "Quote QUO-LC09I issued — 4-cohort training + placement plan",
      },
    ]),
    createdAt: "2026-09-01T10:30:00.000Z",
    orderId: null,
  },
  // 10. REJECTED — buyer declined the quote
  {
    id: "mr-lc-10",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    categoryId: "cat-multimedia",
    categoryName: "Multimedia AI & Graphics",
    title: "Brand video series (4 episodes)",
    details:
      "Scripted brand video series for the launch of the new construction-tech division. Needs motion polish + drone footage.",
    budgetRange: "$3,000 – $6,000",
    timeline: "4 weeks",
    status: "rejected",
    kind: "service",
    reference: "REQ-LC10J",
    quoteId: "quo-lc-10",
    declineReason: "Budget exceeded our cap for this fiscal year — will revisit in Q1 2027.",
    statusHistory: timeline("2026-08-18T14:00:00.000Z", [
      {
        status: "in_review",
        at: "2026-08-19T10:00:00.000Z",
        note: "Creative brief reviewed",
      },
      {
        status: "quoted",
        at: "2026-08-22T13:30:00.000Z",
        note: "Quote QUO-LC10J issued",
      },
      {
        status: "rejected",
        at: "2026-08-25T11:00:00.000Z",
        by: BUYER_NAME,
        note: "Quote declined — budget exceeded fiscal cap",
      },
    ]),
    createdAt: "2026-08-18T14:00:00.000Z",
    orderId: null,
  },
];

// ============================================================
// ORDERS created from lifecycle requests (for the buyer's My Orders page)
// ============================================================

export const LIFECYCLE_ORDERS: MarketOrder[] = [
  {
    id: "mo-lc-05",
    serviceId: "cat-ai-agents",
    serviceSlug: "field-service-triage-agent",
    serviceName: "Field-service triage agent (multi-site)",
    serviceIcon: "Bot",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    amount: 22800,
    status: "pending",
    deliveryType: "project",
    placedAt: "2026-08-27T15:45:00.000Z",
    updatedAt: "2026-08-27T15:45:00.000Z",
    requirements:
      "Agentic layer that triages incoming field-service requests, dispatches to the right crew, and writes back to ServiceNow. 4 sites initially.",
  },
  {
    id: "mo-lc-06",
    serviceId: "cat-tech-programming",
    serviceSlug: "api-gateway-migration",
    serviceName: "API gateway migration (Kong + rate-limiting)",
    serviceIcon: "Network",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    amount: 18900,
    status: "in_progress",
    deliveryType: "project",
    placedAt: "2026-07-30T11:00:00.000Z",
    updatedAt: "2026-08-04T16:20:00.000Z",
    requirements:
      "Migrate 47 internal services behind a Kong gateway with JWT auth, per-consumer rate limits, and request tracing. Zero-downtime cutover.",
  },
  {
    id: "mo-lc-07",
    serviceId: "cat-data-bi",
    serviceSlug: "predictive-maintenance-model",
    serviceName: "Predictive maintenance model (fleet generators)",
    serviceIcon: "Activity",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    amount: 26400,
    status: "delivered",
    deliveryType: "project",
    placedAt: "2026-06-24T11:15:00.000Z",
    updatedAt: "2026-09-03T16:30:00.000Z",
    requirements:
      "Predictive maintenance model for 220 diesel generators — failure prediction 72h ahead with ≥ 85% precision. Outputs integrated into the CMMS.",
  },
  {
    id: "mo-lc-08",
    serviceId: "cat-ai-automation",
    serviceSlug: "rfp-response-automation",
    serviceName: "RFP response automation workflow",
    serviceIcon: "Workflow",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    amount: 9200,
    status: "completed",
    deliveryType: "project",
    placedAt: "2026-05-16T11:00:00.000Z",
    updatedAt: "2026-06-28T10:15:00.000Z",
    requirements:
      "Workflow that ingests an RFP PDF, drafts responses from a curated answer library, and routes for SME review.",
  },
];

// ============================================================
// QUOTES
// ============================================================

const quoteItems = (
  rows: Array<[string, number, number]>
): Quote["items"] =>
  rows.map(([description, quantity, unitPrice], idx) => ({
    id: `qi-${Math.random().toString(36).slice(2, 7)}-${idx}`,
    description,
    quantity,
    unitPrice,
    amount: quantity * unitPrice,
  }));

const computeTotals = (
  items: Quote["items"],
  taxRate: number,
  discount = 0
) => {
  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
  const total = Math.round((subtotal + taxAmount - discount) * 100) / 100;
  return { subtotal, taxAmount, total };
};

function buildQuote(
  id: string,
  reference: string,
  requestId: string,
  requestReference: string,
  issuedAt: string,
  validityDays: number,
  items: Array<[string, number, number]>,
  taxRate: number,
  status: Quote["status"],
  notes?: string,
  declineReason?: string,
  acceptedAt?: string
): Quote {
  const its = quoteItems(items);
  const totals = computeTotals(its, taxRate);
  return {
    id,
    reference,
    requestId,
    requestReference,
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    issuedById: ADM_ID,
    issuedByName: ADM_NAME,
    issuedAt: iso(issuedAt),
    items: its,
    subtotal: totals.subtotal,
    taxRate,
    taxAmount: totals.taxAmount,
    discount: 0,
    total: totals.total,
    validityDays,
    validUntil: daysFrom(issuedAt, validityDays),
    notes,
    status,
    declineReason,
    declinedAt:
      status === "declined" ? iso(daysFrom(issuedAt, 3)) : undefined,
    acceptedAt: acceptedAt ? iso(acceptedAt) : undefined,
  };
}

export const LIFECYCLE_QUOTES: Quote[] = [
  buildQuote(
    "quo-lc-03",
    "QUO-LC03C",
    "mr-lc-03",
    "REQ-LC03C",
    "2026-09-02T15:30:00",
    14,
    [
      ["Portal rebuild — Next.js + Auth0 SSO", 1, 18500],
      ["Design system migration", 1, 4200],
      ["User migration (3,000 accounts)", 1, 2800],
    ],
    0,
    "sent",
    "Scope assumes existing Auth0 tenant. Annual support not included; available as a separate retainer."
  ),
  buildQuote(
    "quo-lc-04",
    "QUO-LC04D",
    "mr-lc-04",
    "REQ-LC04D",
    "2026-08-26T13:00:00",
    14,
    [
      ["Lead scoring model — training + evaluation", 1, 6500],
      ["CRM enrichment pipeline (HubSpot)", 1, 2400],
    ],
    0,
    "accepted",
    "Model refresh cadence: nightly. Precision target: ≥ 80% on the top decile.",
    undefined,
    "2026-09-04T09:15:00"
  ),
  buildQuote(
    "quo-lc-05",
    "QUO-LC05E",
    "mr-lc-05",
    "REQ-LC05E",
    "2026-08-19T11:00:00",
    14,
    [
      ["Field-service triage agent — build + integration", 1, 19000],
      ["ServiceNow writeback adapter", 1, 2600],
      ["4-site rollout + UAT", 1, 1200],
    ],
    0,
    "accepted",
    "Quote accepted 2026-08-25; SOW attached as addendum.",
    undefined,
    "2026-08-25T10:00:00"
  ),
  buildQuote(
    "quo-lc-06",
    "QUO-LC06F",
    "mr-lc-06",
    "REQ-LC06F",
    "2026-07-22T12:00:00",
    14,
    [
      ["Kong gateway deployment + 4 consumer tiers", 1, 14500],
      ["JWT auth + per-consumer rate limits", 1, 3200],
      ["47-service cutover (zero-downtime)", 1, 1200],
    ],
    0,
    "accepted",
    undefined,
    undefined,
    "2026-07-28T09:00:00"
  ),
  buildQuote(
    "quo-lc-07",
    "QUO-LC07G",
    "mr-lc-07",
    "REQ-LC07G",
    "2026-06-15T13:00:00",
    14,
    [
      ["Predictive maintenance model — training", 1, 19000],
      ["CMMS integration + alerting", 1, 5200],
      ["72-hour SLA tuning + UAT", 1, 2200],
    ],
    0,
    "accepted",
    undefined,
    undefined,
    "2026-06-22T09:30:00"
  ),
  buildQuote(
    "quo-lc-08",
    "QUO-LC08H",
    "mr-lc-08",
    "REQ-LC08H",
    "2026-05-09T14:00:00",
    14,
    [
      ["RFP ingestion + answer library", 1, 5600],
      ["SME review routing + draft export", 1, 3600],
    ],
    0,
    "accepted",
    undefined,
    undefined,
    "2026-05-14T09:00:00"
  ),
  buildQuote(
    "quo-lc-09",
    "QUO-LC09I",
    "mr-lc-09",
    "REQ-LC09I",
    "2026-09-05T15:00:00",
    21,
    [
      ["Train-to-hire cohort — 4 engineers (8 weeks)", 4, 6800],
      ["Curriculum design + lab environment", 1, 4200],
      ["Certification + placement handoff", 4, 800],
    ],
    0,
    "sent",
    "Includes 90-day replacement guarantee. Travel costs not included."
  ),
  buildQuote(
    "quo-lc-10",
    "QUO-LC10J",
    "mr-lc-10",
    "REQ-LC10J",
    "2026-08-22T13:30:00",
    14,
    [
      ["Brand video series — 4 episodes", 4, 2400],
      ["Drone footage + motion polish", 1, 1800],
    ],
    0,
    "declined",
    undefined,
    "Budget exceeded our cap for this fiscal year — will revisit in Q1 2027."
  ),
];

// ============================================================
// INVOICES (one per order; issued when admin creates the order)
// ============================================================

function buildInvoice(
  id: string,
  reference: string,
  orderId: string,
  requestId: string | null,
  quoteId: string | null,
  issuedAt: string,
  dueDays: number,
  items: Array<[string, number, number]>,
  taxRate: number,
  status: Invoice["status"],
  paidAt?: string,
  paymentMethod?: string,
  paymentReference?: string
): Invoice {
  const its = quoteItems(items);
  const totals = computeTotals(its, taxRate);
  return {
    id,
    reference,
    orderId,
    requestId,
    quoteId,
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    issuedById: ADM_ID,
    issuedByName: ADM_NAME,
    issuedAt: iso(issuedAt),
    dueDate: daysFrom(issuedAt, dueDays),
    items: its,
    subtotal: totals.subtotal,
    taxRate,
    taxAmount: totals.taxAmount,
    discount: 0,
    total: totals.total,
    status,
    paidAt: paidAt ? iso(paidAt) : undefined,
    paymentMethod,
    paymentReference,
    notes:
      "Payment due net 7 days. Make payable to STIOOS Global. Late payments subject to 1.5%/month finance charge.",
  };
}

export const LIFECYCLE_INVOICES: Invoice[] = [
  buildInvoice(
    "inv-lc-05",
    "INV-LC05E",
    "mo-lc-05",
    "mr-lc-05",
    "quo-lc-05",
    "2026-08-27T15:45:00",
    7,
    [
      ["Field-service triage agent — build + integration", 1, 19000],
      ["ServiceNow writeback adapter", 1, 2600],
      ["4-site rollout + UAT", 1, 1200],
    ],
    0,
    "issued"
  ),
  buildInvoice(
    "inv-lc-06",
    "INV-LC06F",
    "mo-lc-06",
    "mr-lc-06",
    "quo-lc-06",
    "2026-07-30T11:00:00",
    7,
    [
      ["Kong gateway deployment + 4 consumer tiers", 1, 14500],
      ["JWT auth + per-consumer rate limits", 1, 3200],
      ["47-service cutover (zero-downtime)", 1, 1200],
    ],
    0,
    "paid",
    "2026-08-04T16:20:00",
    "card",
    "TXN-LC06F"
  ),
  buildInvoice(
    "inv-lc-07",
    "INV-LC07G",
    "mo-lc-07",
    "mr-lc-07",
    "quo-lc-07",
    "2026-06-24T11:15:00",
    7,
    [
      ["Predictive maintenance model — training", 1, 19000],
      ["CMMS integration + alerting", 1, 5200],
      ["72-hour SLA tuning + UAT", 1, 2200],
    ],
    0,
    "paid",
    "2026-06-29T14:00:00",
    "bank_transfer",
    "TXN-LC07G"
  ),
  buildInvoice(
    "inv-lc-08",
    "INV-LC08H",
    "mo-lc-08",
    "mr-lc-08",
    "quo-lc-08",
    "2026-05-16T11:00:00",
    7,
    [
      ["RFP ingestion + answer library", 1, 5600],
      ["SME review routing + draft export", 1, 3600],
    ],
    0,
    "paid",
    "2026-05-20T13:45:00",
    "card",
    "TXN-LC08H"
  ),
];

// ============================================================
// TRANSACTIONS (one per payment; one refund for variety)
// ============================================================

export const LIFECYCLE_TRANSACTIONS: Transaction[] = [
  {
    id: "txn-lc-06",
    reference: "TXN-LC06F",
    type: "payment",
    invoiceId: "inv-lc-06",
    orderId: "mo-lc-06",
    requestId: "mr-lc-06",
    quoteId: "quo-lc-06",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    amount: 18900,
    currency: "USD",
    method: "card",
    status: "success",
    createdAt: "2026-08-04T16:20:00.000Z",
    description: "Payment for invoice INV-LC06F — API gateway migration",
    initiatedById: BUYER_ID,
    initiatedByName: BUYER_NAME,
    gatewayReference: "ch_3OzQkL9p2xY4mN1q",
    meta: { last4: "4242", brand: "Visa" },
  },
  {
    id: "txn-lc-07",
    reference: "TXN-LC07G",
    type: "payment",
    invoiceId: "inv-lc-07",
    orderId: "mo-lc-07",
    requestId: "mr-lc-07",
    quoteId: "quo-lc-07",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    amount: 26400,
    currency: "USD",
    method: "bank_transfer",
    status: "success",
    createdAt: "2026-06-29T14:00:00.000Z",
    description: "Payment for invoice INV-LC07G — Predictive maintenance model",
    initiatedById: BUYER_ID,
    initiatedByName: BUYER_NAME,
    gatewayReference: "WIRE-NL-INGB-0001982",
    meta: { bank: "ING Bank", account: "••••7821" },
  },
  {
    id: "txn-lc-08",
    reference: "TXN-LC08H",
    type: "payment",
    invoiceId: "inv-lc-08",
    orderId: "mo-lc-08",
    requestId: "mr-lc-08",
    quoteId: "quo-lc-08",
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    amount: 9200,
    currency: "USD",
    method: "card",
    status: "success",
    createdAt: "2026-05-20T13:45:00.000Z",
    description: "Payment for invoice INV-LC08H — RFP response automation",
    initiatedById: BUYER_ID,
    initiatedByName: BUYER_NAME,
    gatewayReference: "ch_3OzPkM2q8wX5nB9r",
    meta: { last4: "4242", brand: "Visa" },
  },
  // A historical refund — from a different buyer (legacy data) for variety
  {
    id: "txn-lc-refund-01",
    reference: "TXN-LCRF01",
    type: "refund",
    invoiceId: null,
    orderId: null,
    requestId: null,
    quoteId: null,
    buyerId: BUYER_ID,
    buyerName: BUYER_NAME,
    buyerCompany: BUYER_COMPANY,
    amount: -1200,
    currency: "USD",
    method: "card",
    status: "refunded",
    createdAt: "2026-04-12T11:00:00.000Z",
    description: "Partial refund — unused hours on the asset digitization engagement",
    initiatedById: ADM_ID,
    initiatedByName: ADM_NAME,
    gatewayReference: "re_3OqRsT4u9xY1nM7s",
    meta: { originalInvoice: "INV-LAG-04421" },
  },
];
