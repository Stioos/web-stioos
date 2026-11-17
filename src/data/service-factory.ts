import type { Service } from "@/types";

export type SrvInput = Partial<Service> & {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  subcategoryId: string;
  shortDescription: string;
};

let seq = 0;
const NOW = "2025-11-20";

// ------------------------------------------------------------
// Shared defaults — hoisted to module scope (and frozen) so the
// 305 makeService calls at module-eval time reuse one instance
// instead of allocating ~15 fresh arrays/objects per service.
// The catalog is treated as read-only everywhere, so sharing is
// safe and cuts several MB of heap churn + GC pressure.
// ------------------------------------------------------------
const DEFAULT_TAGS = Object.freeze(["AI", "Automation"] as string[]);
const DEFAULT_INDUSTRIES = Object.freeze([
  "Technology",
  "Professional Services",
] as string[]);
const DEFAULT_PROBLEMS_SOLVED = Object.freeze([
  "Manual, repetitive work consuming team capacity",
  "Inconsistent execution across teams and tools",
  "Lack of visibility into operational performance",
] as string[]);
const DEFAULT_CAPABILITIES = Object.freeze([
  "Discovery & process assessment",
  "Solution architecture & build",
  "Integration with existing systems",
  "Testing, rollout & team enablement",
] as string[]);
const DEFAULT_DELIVERABLES = Object.freeze([
  "Solution blueprint document",
  "Production-ready implementation",
  "Documentation & runbooks",
  "Training & handover sessions",
] as string[]);
const DEFAULT_PROCESS = Object.freeze([
  { title: "Discover", description: "Deep-dive workshops to map goals, systems, and constraints." },
  { title: "Design", description: "Solution blueprint with architecture, scope, and success metrics." },
  { title: "Build", description: "Agile delivery with weekly demos and continuous feedback." },
  { title: "Deploy & Scale", description: "Production launch, monitoring, and iteration support." },
] as Service["process"]);
const DEFAULT_TECHNOLOGIES = Object.freeze([
  "OpenAI",
  "Node.js",
  "PostgreSQL",
  "Docker",
] as string[]);
const DEFAULT_FAQS = Object.freeze([
  { question: "How do we get started?", answer: "Book a scoping call — we assess your requirements and deliver a proposal within 3 business days." },
  { question: "Do you work with our existing systems?", answer: "Yes. Every engagement starts with an integration assessment of your current stack." },
  { question: "What does support look like after launch?", answer: "All projects include a 30-day stabilization window, with optional managed support plans." },
] as Service["faqs"]);

/**
 * Factory producing fully-populated services. Fields not provided
 * fall back to sensible defaults derived from the input so the
 * detail pages always render complete content.
 */
export const makeService = (input: SrvInput): Service => {
  seq += 1;
  const n = String(seq).padStart(3, "0");
  return {
    fullDescription: input.fullDescription ?? input.shortDescription,
    tags: input.tags ?? DEFAULT_TAGS,
    industries: input.industries ?? DEFAULT_INDUSTRIES,
    deliveryType: input.deliveryType ?? "project",
    timeline: input.timeline ?? "4–8 weeks",
    rating: input.rating ?? 4.8,
    reviews: input.reviews ?? 40 + seq * 3,
    popularity: input.popularity ?? seq * 10,
    featured: input.featured ?? false,
    status: input.status ?? "published",
    accent: input.accent ?? "from-blue-600 to-cyan-500",
    icon: input.icon ?? "Sparkles",
    problemsSolved: input.problemsSolved ?? DEFAULT_PROBLEMS_SOLVED,
    capabilities: input.capabilities ?? DEFAULT_CAPABILITIES,
    deliverables: input.deliverables ?? DEFAULT_DELIVERABLES,
    process: input.process ?? DEFAULT_PROCESS,
    technologies: input.technologies ?? DEFAULT_TECHNOLOGIES,
    faqs: input.faqs ?? DEFAULT_FAQS,
    createdAt: input.createdAt ?? NOW,
    updatedAt: input.updatedAt ?? NOW,
    createdBy: input.createdBy ?? "Aarav Mehta",
    metaTitle: input.metaTitle ?? input.name,
    metaDescription: input.metaDescription ?? input.shortDescription,
    ...input,
  } as Service;
};
