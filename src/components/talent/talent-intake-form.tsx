"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  GraduationCap,
  HelpCircle,
  Layers,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Rocket,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppStore, useCurrentUser } from "@/lib/store";
import {
  getTalentFormSpec,
  type TalentAction,
} from "@/data/talent-form-specs";
import { isHireTalentOption } from "./talent-cta-group";

import { ALL_COUNTRIES, type CountryDial } from "@/data/countries";

export { type CountryDial };
export const COUNTRY_CODES: CountryDial[] = ALL_COUNTRIES;

interface TalentIntakeFormProps {
  optionSlug: string;
  initialAction?: TalentAction;
  onSuccess?: (reference: string) => void;
  onClose?: () => void;
  isStandalonePage?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function TalentIntakeForm({
  optionSlug,
  initialAction = "apply",
  onSuccess,
  onClose,
  isStandalonePage = false,
}: TalentIntakeFormProps) {
  const { toast } = useToast();
  const currentUser = useCurrentUser();
  const addInquiry = useAppStore((s) => s.addInquiry);
  const addMarketRequest = useAppStore((s) => s.addMarketRequest);
  const spec = getTalentFormSpec(optionSlug);
  const isHireTalentTarget =
    isHireTalentOption(optionSlug, spec.groupSlug) ||
    optionSlug === "train-to-hire" ||
    optionSlug.includes("train-to-hire") ||
    spec.groupSlug === "train-to-hire";

  const [action, setAction] = useState<TalentAction>(initialAction);

  // Sync if initialAction changes
  useEffect(() => {
    setAction(initialAction);
  }, [initialAction]);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [companyOrSchool, setCompanyOrSchool] = useState("");
  const [cityLocation, setCityLocation] = useState("");

  const activeCountry =
    COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  // Apply-specific fields (start with empty so dropdown shows "Select..." as default)
  const [selectedTrack, setSelectedTrack] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [learningFormat, setLearningFormat] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [availableStartDate, setAvailableStartDate] = useState("");
  const [statement, setStatement] = useState("");

  // GetStarted-specific fields
  const [scopeOption, setScopeOption] = useState("");
  const [selectedStack, setSelectedStack] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [targetTimeline, setTargetTimeline] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [projectRequirements, setProjectRequirements] = useState("");

  // Consultation-specific fields
  const [consultationFocus, setConsultationFocus] = useState("");
  const [attendeeRole, setAttendeeRole] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState("");
  const [preferredTimezone, setPreferredTimezone] = useState("IST (UTC+5:30)");
  const [meetingPlatform, setMeetingPlatform] = useState("");
  const [discussionQuestions, setDiscussionQuestions] = useState("");

  // Errors & UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);


  // Validation
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!EMAIL_RE.test(email.trim())) {
      errs.email = "Please enter a valid email address";
    }
    if (!phone.trim()) {
      errs.phone = "Phone number is required for verification";
    }
    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }
    if (!confirmPassword) {
      errs.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    if (action === "apply") {
      if (!selectedTrack) errs.selectedTrack = "Please select a technical track";
    } else if (action === "get-started") {
      if (!companyOrSchool.trim()) errs.companyOrSchool = "Company / Organization name is required";
    } else if (action === "consultation") {
      if (!preferredDate) errs.preferredDate = "Please choose a preferred date";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefix =
      action === "apply"
        ? "TAL-APPLY"
        : action === "get-started"
        ? "TAL-START"
        : "TAL-DISC";
    const refCode = `${prefix}-${randomSuffix}`;
    const fullPhone = `${activeCountry.dial} ${phone.trim()}`;

    setTimeout(() => {
      // Build structured payload for store
      let inquiryType: "quote" | "contact" | "service_request" | "consultation" = "service_request";
      let details = "";
      let requestTitle = "";

      if (action === "apply") {
        inquiryType = "service_request";
        requestTitle = `${spec.optionTitle} — ${selectedTrack || "Candidate Application"}`;
        details = `[TALENT APPLICATION - ${spec.optionTitle}]
Track: ${selectedTrack}
Experience Level: ${experienceLevel}
Learning Format: ${learningFormat}
Available Start Date: ${availableStartDate}
Location: ${cityLocation || "Not specified"}
LinkedIn: ${linkedinUrl || "N/A"}
Portfolio/GitHub: ${portfolioUrl || "N/A"}
Statement: ${statement || "N/A"}`;
      } else if (action === "get-started") {
        inquiryType = "quote";
        requestTitle = `${spec.optionTitle} — ${scopeOption || "Deployment Pod"}`;
        details = `[TALENT SCOPING & ENGAGEMENT - ${spec.optionTitle}]
Scope / Capacity: ${scopeOption}
Primary Stack: ${selectedStack}
Company Size: ${companySize}
Timeline: ${targetTimeline}
Budget: ${budgetRange}
Project Notes: ${projectRequirements || "N/A"}`;
      } else {
        inquiryType = "consultation";
        requestTitle = `${spec.optionTitle} — Consultation (${consultationFocus || "Strategy Session"})`;
        details = `[TALENT DISCOVERY CONSULTATION - ${spec.optionTitle}]
Objective: ${consultationFocus}
Attendee Role: ${attendeeRole}
Preferred Date: ${preferredDate}
Preferred Time Window: ${preferredTimeSlot} (${preferredTimezone})
Platform: ${meetingPlatform}
Key Topics: ${discussionQuestions || "N/A"}`;
      }

      // 1. Add to Market Requests so it appears immediately under "Your Talent Transactions" in Buyer Portal
      addMarketRequest({
        buyerId: currentUser?.id || "usr-001",
        categoryId: "cat-talent",
        categoryName: "Talent Solutions",
        title: requestTitle,
        details: details,
        budgetRange: action === "get-started" ? budgetRange : action === "apply" ? "Candidate Track" : "Complimentary Consultation",
        timeline: action === "get-started" ? targetTimeline : (availableStartDate || preferredDate || "Immediate"),
        kind: action === "apply" ? "talent-application" : action === "get-started" ? "end-to-end-staffing" : "talent-consultation",
        status: action === "apply" ? "applied" : "open",
        meta: {
          buyerId: currentUser?.id || "usr-001",
          optionSlug,
          groupSlug: spec.groupSlug,
          action,
          reference: refCode,
          email: email.trim(),
          phone: fullPhone,
          company: companyOrSchool.trim(),
          name: name.trim(),
          status: action === "apply" ? "applied" : "open",
          track: selectedTrack,
          scope: scopeOption,
          focus: consultationFocus,
        },
      });

      // 2. Also register as Inquiry for lead & customer management
      addInquiry({
        name: name.trim(),
        email: email.trim(),
        company: companyOrSchool.trim(),
        phone: fullPhone,
        type: inquiryType,
        serviceName: `${spec.optionTitle} (${spec.groupName})`,
        requirements: details,
        budgetRange: action === "get-started" ? budgetRange : undefined,
        timeline: action === "get-started" ? targetTimeline : preferredDate,
        status: action === "apply" ? "applied" : "open",
        meta: {
          buyerId: currentUser?.id || "usr-001",
          optionSlug,
          groupSlug: spec.groupSlug,
          action,
          reference: refCode,
        },
      } as any);

      setReference(refCode);
      setSubmitting(false);

      toast({
        title: `${spec.optionTitle} — ${
          action === "apply"
            ? "Application Submitted"
            : action === "get-started"
            ? "Engagement Request Received"
            : "Consultation Booked"
        }`,
        description: `Reference ${refCode} has been generated. Our team will contact you within 24 hours.`,
      });

      if (onSuccess) onSuccess(refCode);
    }, 600);
  };

  const copyRef = () => {
    if (!reference) return;
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Reference copied to clipboard" });
  };

  // ─────────────────────────────────────────────────────────────
  // SUCCESS SCREEN
  // ─────────────────────────────────────────────────────────────
  if (reference) {
    const thankYouTitle =
      action === "apply"
        ? "Thank you for applying!"
        : action === "get-started"
        ? "Thank you for getting started!"
        : "Thank you for scheduling!";

    return (
      <div
        data-theme="light"
        style={{ backgroundColor: "#ffffff", color: "#000000" }}
        className="flex flex-col items-center justify-center py-8 px-2 text-center text-black bg-white sm:px-6"
      >
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl shadow-emerald-500/20 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-9 w-9 text-black" />
        </div>

        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          Request Confirmed
        </span>

        <h3 className="mt-3 text-2xl font-bold tracking-tight text-black sm:text-3xl" style={{ color: "#000000" }}>
          {thankYouTitle}
        </h3>

        <p className="mt-2 text-base font-semibold text-amber-700" style={{ color: "#b45309" }}>
          Your request has been received.
        </p>

        <p className="mt-3 max-w-md text-sm text-slate-800 leading-relaxed" style={{ color: "#1e293b" }}>
          {action === "apply"
            ? `Our technical mentors are reviewing your application for ${spec.optionTitle}. You will receive assessment instructions and next steps at ${email || "your email"} within 24 hours.`
            : action === "get-started"
            ? `Our practice team has received your scoping requirements for ${spec.optionTitle}. A calibrated candidate dossier and plan will be delivered within 24 hours.`
            : `Your discovery session for ${spec.optionTitle} has been recorded. A calendar invitation and video link (${meetingPlatform}) have been sent to ${email || "your email"}.`}
        </p>

        {/* Reference Card */}
        <div
          style={{ backgroundColor: "#f8fafc", borderColor: "#cbd5e1", color: "#000000" }}
          className="mt-6 flex w-full max-w-md items-center justify-between gap-4 rounded-xl border p-4 text-left"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600" style={{ color: "#475569" }}>
              Tracking Reference Code
            </p>
            <p className="text-base font-mono font-bold text-black" style={{ color: "#000000" }}>{reference}</p>
          </div>
          <button
            onClick={copyRef}
            type="button"
            style={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#000000" }}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors hover:bg-slate-100"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Copy Code"}
          </button>
        </div>

        {/* SLA Guarantee Pill */}
        <div
          style={{ backgroundColor: "#fffbeb", borderColor: "#fde68a", color: "#78350f" }}
          className="mt-5 flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium"
        >
          <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600" />
          <span>Backed by STIOOS guaranteed response SLA & complete data privacy.</span>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            style={{ backgroundColor: "#0284c7", color: "#ffffff" }}
            className="bg-sky-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-500"
          >
            <Link href={`/dashboard/buyer/talent-solutions?id=${reference.toLowerCase()}`}>
              View in Buyer Portal →
            </Link>
          </Button>

          {onClose ? (
            <Button
              type="button"
              onClick={onClose}
              size="lg"
              variant="outline"
              style={{ backgroundColor: "#f8fafc", color: "#000000", borderColor: "#cbd5e1" }}
              className="border px-6 py-2.5 font-semibold text-black hover:bg-slate-100"
            >
              Close & Return to {spec.optionTitle}
            </Button>
          ) : (
            <Button
              asChild
              size="lg"
              variant="outline"
              style={{ backgroundColor: "#f8fafc", color: "#000000", borderColor: "#cbd5e1" }}
              className="border px-6 py-2.5 font-semibold text-black hover:bg-slate-100"
            >
              <Link href="/talent-solutions">Return to Talent Solutions</Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Active sub-spec for current action
  const activeSubSpec =
    action === "apply"
      ? spec.apply
      : action === "get-started"
      ? spec.getStarted
      : spec.consultation;

  const Icon = spec.icon;

  const inputStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    color: "#000000",
    borderColor: "#cbd5e1",
  };

  const labelStyle: React.CSSProperties = {
    color: "#000000",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    color: "#000000",
  };

  return (
    <div
      data-theme="light"
      style={{ backgroundColor: "#ffffff", color: "#000000" }}
      className={`w-full text-left text-black bg-white ${isStandalonePage ? "mx-auto max-w-4xl" : ""}`}
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. VISUAL HEADER WITH CONTEXT IDENTITY & BADGES */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 pb-5" style={{ borderColor: "#e2e8f0" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/20">
              <Icon className="h-6 w-6 text-black" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700" style={{ color: "#b45309" }}>
                  {spec.groupName}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] font-semibold text-slate-700" style={{ color: "#334155" }}>
                  {spec.side === "candidate" ? "Candidate Pathway" : "Employer Capacity"}
                </span>
              </div>
              <h2 className="text-lg font-bold text-black sm:text-xl md:text-2xl" style={{ color: "#000000" }}>
                {spec.optionTitle}
              </h2>
            </div>
          </div>

          <span
            style={{ backgroundColor: "#fffbeb", borderColor: "#fde68a", color: "#78350f" }}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
          >
            <Sparkles className="h-3 w-3 text-amber-600" />
            {activeSubSpec.badge}
          </span>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 2. DEDICATED SELECTED ACTION HEADER (LOCKED TO USER'S SELECTION) */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          style={{ backgroundColor: "#fffbeb", borderColor: "#fde68a", color: "#000000" }}
          className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold shadow-sm">
              {action === "apply" ? (
                <GraduationCap className="h-5 w-5" />
              ) : action === "get-started" ? (
                <Briefcase className="h-5 w-5" />
              ) : (
                <Calendar className="h-5 w-5" />
              )}
            </span>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800" style={{ color: "#92400e" }}>
                Selected Option
              </div>
              <div className="text-sm font-bold text-black sm:text-base" style={{ color: "#000000" }}>
                {action === "apply"
                  ? isHireTalentTarget
                    ? `Hire Talent — ${spec.optionTitle}`
                    : `Apply Now — ${spec.optionTitle}`
                  : action === "get-started"
                  ? `Get Started — ${spec.optionTitle}`
                  : `Schedule Consultation — ${spec.optionTitle}`}
              </div>
            </div>
          </div>

          <span
            style={{ backgroundColor: "#fef3c7", borderColor: "#fcd34d", color: "#451a03" }}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            {activeSubSpec.badge}
          </span>
        </div>

        <p className="mt-3 text-xs text-slate-800 leading-relaxed sm:text-sm" style={{ color: "#1e293b" }}>
          {activeSubSpec.blurb}
        </p>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. DYNAMIC OPTION-SPECIFIC FORM BODY */}
      {/* ───────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {/* SECTION A: CONTACT DETAILS (Shared across all modes) */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="talent-name" className="text-xs font-semibold text-black" style={labelStyle}>
              Full Name <span className="text-amber-500">*</span>
            </Label>
            <div className="relative mt-1.5">
              <User className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="talent-name"
                value={name}
                style={inputStyle}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder="Enter your full name"
                className={`pl-9 bg-white border-slate-300 text-black placeholder:text-slate-400 focus:bg-white focus:border-amber-500 ${
                  errors.name ? "border-rose-500" : ""
                }`}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="talent-email" className="text-xs font-semibold text-black" style={labelStyle}>
              {action === "get-started" ? "Work Email" : "Email Address"}{" "}
              <span className="text-amber-500">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="talent-email"
                type="email"
                value={email}
                style={inputStyle}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder={action === "get-started" ? "Enter your work email" : "Enter your email address"}
                className={`pl-9 bg-white border-slate-300 text-black placeholder:text-slate-400 focus:bg-white focus:border-amber-500 ${
                  errors.email ? "border-rose-500" : ""
                }`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="talent-phone" className="text-xs font-semibold text-black" style={labelStyle}>
              Phone Number <span className="text-amber-500">*</span>
            </Label>
            <div
              style={inputStyle}
              className={`mt-1.5 flex h-10 w-full items-center rounded-xl border bg-white shadow-2xs transition-all focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 ${
                errors.phone ? "border-rose-500" : "border-slate-300"
              }`}
            >
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger
                  id="talent-country-code"
                  className="h-full border-0 bg-transparent py-0 pl-3 pr-2 shadow-none focus:ring-0 text-black hover:bg-slate-50 rounded-l-xl shrink-0"
                >
                  <span className="flex items-center gap-1.5">
                    <img
                      src={`https://flagcdn.com/w40/${activeCountry.code.toLowerCase()}.png`}
                      alt={activeCountry.name}
                      className="h-3.5 w-5 shrink-0 rounded-xs object-cover border border-slate-200"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                    <span className="text-xs font-semibold text-slate-800">{activeCountry.dial}</span>
                  </span>
                </SelectTrigger>
                <SelectContent
                  data-theme="light"
                  style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }}
                  className="max-h-[300px] w-[280px] sm:w-[320px] !bg-white border-slate-300 !text-black shadow-xl z-50"
                >
                  {COUNTRY_CODES.map((c) => (
                    <SelectItem
                      key={c.code}
                      value={c.code}
                      style={{ color: "#000000", backgroundColor: "#ffffff" }}
                      className="text-xs !text-black hover:!bg-amber-50 focus:!bg-amber-100 focus:!text-black cursor-pointer py-2 px-2.5"
                    >
                      <div className="flex items-center gap-2.5 w-full">
                        <img
                          src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                          alt={c.name}
                          className="h-3.5 w-5 shrink-0 rounded-xs object-cover border border-slate-200"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                        <span className="font-medium text-slate-900 truncate">{c.name}</span>
                        <span className="ml-auto pl-2 text-slate-500 font-mono text-[11px] shrink-0">
                          {c.code} ({c.dial})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Vertical divider */}
              <div className="h-5 w-px bg-slate-200 shrink-0" aria-hidden="true" />

              {/* Phone input */}
              <input
                id="talent-phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder="Enter your phone number"
                className="h-full flex-1 border-0 bg-transparent px-3 text-xs sm:text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="talent-org" className="text-xs font-semibold text-black" style={labelStyle}>
              {action === "get-started" ? (
                <>
                  Company / Organization <span className="text-amber-500">*</span>
                </>
              ) : (
                "Company, University, or Current Status"
              )}
            </Label>
            <div className="relative mt-1.5">
              <Briefcase className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="talent-org"
                value={companyOrSchool}
                style={inputStyle}
                onChange={(e) => {
                  setCompanyOrSchool(e.target.value);
                  if (errors.companyOrSchool)
                    setErrors((prev) => ({ ...prev, companyOrSchool: "" }));
                }}
                placeholder={
                  action === "get-started" ? "Enter your company or organization" : "Enter your company, university, or current status"
                }
                className={`pl-9 bg-white border-slate-300 text-black placeholder:text-slate-400 focus:bg-white focus:border-amber-500 ${
                  errors.companyOrSchool ? "border-rose-500" : ""
                }`}
              />
            </div>
            {errors.companyOrSchool && (
              <p className="mt-1 text-xs text-rose-500">{errors.companyOrSchool}</p>
            )}
          </div>

          {/* Row 3: Password & Confirm Password */}
          <div>
            <Label htmlFor="talent-password" className="text-xs font-semibold text-black" style={labelStyle}>
              Password <span className="text-amber-500">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="talent-password"
                type={showPassword ? "text" : "password"}
                value={password}
                style={inputStyle}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="Enter your password"
                className={`pl-9 pr-10 bg-white border-slate-300 text-black placeholder:text-slate-400 focus:bg-white focus:border-amber-500 ${
                  errors.password ? "border-rose-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-black transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
          </div>

          <div>
            <Label htmlFor="talent-confirm-password" className="text-xs font-semibold text-black" style={labelStyle}>
              Confirm Password <span className="text-amber-500">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="talent-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                style={inputStyle}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                placeholder="Enter your confirm password"
                className={`pl-9 pr-10 bg-white border-slate-300 text-black placeholder:text-slate-400 focus:bg-white focus:border-amber-500 ${
                  errors.confirmPassword ? "border-rose-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-black transition-colors"
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* SECTION B1: DYNAMIC FIELDS SPECIFIC TO "APPLY NOW" */}
        {/* ───────────────────────────────────────────────────────────── */}
        {action === "apply" && (
          <div style={cardStyle} className="space-y-4 rounded-xl border p-4 text-black">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 text-xs font-bold uppercase tracking-wider text-black" style={{ color: "#000000", borderColor: "#e2e8f0" }}>
              <GraduationCap className="h-4 w-4 text-amber-600" />
              {spec.optionTitle} — {isHireTalentTarget ? "Hire Talent & Cohort Criteria" : "Candidate Application Criteria"}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold text-black" style={labelStyle}>
                  {spec.apply.trackLabel} <span className="text-amber-500">*</span>
                </Label>
                <Select value={selectedTrack} onValueChange={(val) => {
                  setSelectedTrack(val);
                  if (errors.selectedTrack) setErrors((prev) => ({ ...prev, selectedTrack: "" }));
                }}>
                  <SelectTrigger style={inputStyle} className={`mt-1.5 bg-white border-slate-300 text-black focus:border-amber-500 ${errors.selectedTrack ? "border-rose-500" : ""}`}>
                    <SelectValue placeholder="Select technical track..." />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }} className="bg-white border-slate-300 text-black shadow-xl">
                    {spec.apply.tracks.map((t) => (
                      <SelectItem key={t} value={t} className="text-black focus:bg-amber-50 focus:text-black">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.selectedTrack && <p className="mt-1 text-xs text-rose-500">{errors.selectedTrack}</p>}
              </div>

              {spec.apply.experienceOptions && (
                <div>
                  <Label className="text-xs font-semibold text-black" style={labelStyle}>
                    {spec.apply.experienceLabel || "Experience Level"}
                  </Label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger style={inputStyle} className="mt-1.5 bg-white border-slate-300 text-black focus:border-amber-500">
                      <SelectValue placeholder="Select experience level..." />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }} className="bg-white border-slate-300 text-black shadow-xl">
                      {spec.apply.experienceOptions.map((opt) => (
                        <SelectItem key={opt} value={opt} className="text-black focus:bg-amber-50 focus:text-black">
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {spec.apply.specialtyOptions ? (
                <div>
                  <Label className="text-xs font-semibold text-black" style={labelStyle}>
                    {spec.apply.specialtyLabel || "Preferences"}
                  </Label>
                  <Select value={learningFormat} onValueChange={setLearningFormat}>
                    <SelectTrigger style={inputStyle} className="mt-1.5 bg-white border-slate-300 text-black focus:border-amber-500">
                      <SelectValue placeholder="Select preferred format..." />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }} className="bg-white border-slate-300 text-black shadow-xl">
                      {spec.apply.specialtyOptions.map((opt) => (
                        <SelectItem key={opt} value={opt} className="text-black focus:bg-amber-50 focus:text-black">
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <Label className="text-xs font-semibold text-black" style={labelStyle}>Current City / Location</Label>
                  <div className="relative mt-1.5">
                    <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      value={cityLocation}
                      style={inputStyle}
                      onChange={(e) => setCityLocation(e.target.value)}
                      placeholder="Enter your city or location"
                      className="pl-9 bg-white border-slate-300 text-black placeholder:text-slate-400 focus:bg-white focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label className="text-xs font-semibold text-black" style={labelStyle}>
                  GitHub / Portfolio / Code Link
                </Label>
                <Input
                  value={portfolioUrl}
                  style={inputStyle}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="Enter your GitHub, portfolio, or code link"
                  className="mt-1.5 bg-white border-slate-300 text-black placeholder:text-slate-400 focus:bg-white focus:border-amber-500"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-black" style={labelStyle}>LinkedIn Profile URL</Label>
                <Input
                  value={linkedinUrl}
                  style={inputStyle}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="Enter your LinkedIn profile URL"
                  className="mt-1.5 bg-white border-slate-300 text-black placeholder:text-slate-400 focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold text-black" style={labelStyle}>
                  Earliest Available Joining / Start Date
                </Label>
                <Select value={availableStartDate} onValueChange={setAvailableStartDate}>
                  <SelectTrigger style={inputStyle} className="mt-1.5 bg-white border-slate-300 text-black focus:border-amber-500">
                    <SelectValue placeholder="Select available start date..." />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }} className="bg-white border-slate-300 text-black shadow-xl">
                    <SelectItem value="Immediate (Within 7 days)" className="text-black focus:bg-amber-50 focus:text-black">Immediate (Within 7 days)</SelectItem>
                    <SelectItem value="Within 2-3 Weeks" className="text-black focus:bg-amber-50 focus:text-black">Within 2-3 Weeks</SelectItem>
                    <SelectItem value="Next Month (1st of next month)" className="text-black focus:bg-amber-50 focus:text-black">Next Month</SelectItem>
                    <SelectItem value="Next Academic Quarter" className="text-black focus:bg-amber-50 focus:text-black">Next Academic Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="talent-statement" className="text-xs font-semibold text-black" style={labelStyle}>
                  Goals & Technical Statement
                </Label>
                <Textarea
                  id="talent-statement"
                  rows={3}
                  value={statement}
                  style={inputStyle}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder={spec.apply.statementPlaceholder || "Enter your goals and technical statement"}
                  className="mt-1.5 bg-white border-slate-300 text-black placeholder:text-slate-400 focus:bg-white focus:border-amber-500 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* SECTION B2: DYNAMIC FIELDS SPECIFIC TO "GET STARTED" */}
        {/* ───────────────────────────────────────────────────────────── */}
        {action === "get-started" && (
          <div style={cardStyle} className="space-y-4 rounded-xl border p-4 text-black">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 text-xs font-bold uppercase tracking-wider text-black" style={{ color: "#000000", borderColor: "#e2e8f0" }}>
              <Briefcase className="h-4 w-4 text-amber-600" />
              {spec.optionTitle} — Enterprise Engagement Scope
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-semibold text-black" style={labelStyle}>
                  {spec.getStarted.scopeLabel} <span className="text-amber-500">*</span>
                </Label>
                <Select value={scopeOption} onValueChange={setScopeOption}>
                  <SelectTrigger style={inputStyle} className="mt-1.5 bg-white border-slate-300 text-black focus:border-amber-500">
                    <SelectValue placeholder="Select capacity / scope..." />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }} className="bg-white border-slate-300 text-black shadow-xl">
                    {spec.getStarted.scopeOptions.map((opt) => (
                      <SelectItem key={opt} value={opt} className="text-black focus:bg-amber-50 focus:text-black">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-black" style={labelStyle}>
                  {spec.getStarted.stackLabel} <span className="text-amber-500">*</span>
                </Label>
                <Select value={selectedStack} onValueChange={setSelectedStack}>
                  <SelectTrigger style={inputStyle} className="mt-1.5 bg-white border-slate-300 text-black focus:border-amber-500">
                    <SelectValue placeholder="Select required tech stack..." />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }} className="bg-white border-slate-300 text-black shadow-xl">
                    {spec.getStarted.stackOptions.map((opt) => (
                      <SelectItem key={opt} value={opt} className="text-black focus:bg-amber-50 focus:text-black">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-black" style={labelStyle}>Target Delivery Timeline</Label>
                <Select value={targetTimeline} onValueChange={setTargetTimeline}>
                  <SelectTrigger style={inputStyle} className="mt-1.5 bg-white border-slate-300 text-black focus:border-amber-500">
                    <SelectValue placeholder="Select target delivery timeline..." />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }} className="bg-white border-slate-300 text-black shadow-xl">
                    {(
                      spec.getStarted.timelineOptions || [
                        "Immediate (within 48h)",
                        "Within 2 weeks",
                        "Within 30 days",
                        "Next Quarter",
                      ]
                    ).map((t) => (
                      <SelectItem key={t} value={t} className="text-black focus:bg-amber-50 focus:text-black">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-black" style={labelStyle}>Estimated Budget / Pricing Model</Label>
                <Select value={budgetRange} onValueChange={setBudgetRange}>
                  <SelectTrigger style={inputStyle} className="mt-1.5 bg-white border-slate-300 text-black focus:border-amber-500">
                    <SelectValue placeholder="Select estimated budget / pricing model..." />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }} className="bg-white border-slate-300 text-black shadow-xl">
                    {(
                      spec.getStarted.budgetOptions || [
                        "Standard Placement Fee (Pay-After-Join)",
                        "$3,000–$6,000 / mo per Engineer",
                        "$6,000–$12,000 / mo per Engineer",
                        "Dedicated Pod Monthly Retainer",
                        "Enterprise Contract (Custom)",
                      ]
                    ).map((b) => (
                      <SelectItem key={b} value={b} className="text-black focus:bg-amber-50 focus:text-black">
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="talent-notes" className="text-xs font-semibold text-black" style={labelStyle}>
                  Specific Project Requirements / Role Details
                </Label>
                <Textarea
                  id="talent-notes"
                  rows={3}
                  value={projectRequirements}
                  style={inputStyle}
                  onChange={(e) => setProjectRequirements(e.target.value)}
                  placeholder={spec.getStarted.notesPlaceholder || "Enter your project requirements and scope notes"}
                  className="mt-1.5 bg-white border-slate-300 text-black placeholder:text-slate-400 focus:bg-white focus:border-amber-500 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* SECTION B3: DYNAMIC FIELDS SPECIFIC TO "SCHEDULE CONSULTATION" */}
        {/* ───────────────────────────────────────────────────────────── */}
        {action === "consultation" && (
          <div style={cardStyle} className="space-y-4 rounded-xl border p-4 text-black">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 text-xs font-bold uppercase tracking-wider text-black" style={{ color: "#000000", borderColor: "#e2e8f0" }}>
              <Calendar className="h-4 w-4 text-amber-600" />
              {spec.optionTitle} — Discovery Consultation Booking
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold text-black" style={labelStyle}>
                  {spec.consultation.focusLabel} <span className="text-amber-500">*</span>
                </Label>
                <Select value={consultationFocus} onValueChange={setConsultationFocus}>
                  <SelectTrigger style={inputStyle} className="mt-1.5 bg-white border-slate-300 text-black focus:border-amber-500">
                    <SelectValue placeholder="Select consultation focus..." />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }} className="bg-white border-slate-300 text-black shadow-xl">
                    {spec.consultation.focusOptions.map((f) => (
                      <SelectItem key={f} value={f} className="text-black focus:bg-amber-50 focus:text-black">
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-black" style={labelStyle}>
                  {spec.consultation.attendeeLabel}
                </Label>
                <Select value={attendeeRole} onValueChange={setAttendeeRole}>
                  <SelectTrigger style={inputStyle} className="mt-1.5 bg-white border-slate-300 text-black focus:border-amber-500">
                    <SelectValue placeholder="Select your role..." />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }} className="bg-white border-slate-300 text-black shadow-xl">
                    {spec.consultation.attendeeOptions.map((a) => (
                      <SelectItem key={a} value={a} className="text-black focus:bg-amber-50 focus:text-black">
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="talent-date" className="text-xs font-semibold text-black" style={labelStyle}>
                  Preferred Date <span className="text-amber-500">*</span>
                </Label>
                <Input
                  id="talent-date"
                  type="date"
                  value={preferredDate}
                  style={inputStyle}
                  onChange={(e) => {
                    setPreferredDate(e.target.value);
                    if (errors.preferredDate) setErrors((prev) => ({ ...prev, preferredDate: "" }));
                  }}
                  placeholder="Enter your preferred date"
                  className={`mt-1.5 bg-white border-slate-300 text-black focus:bg-white focus:border-amber-500 ${
                    errors.preferredDate ? "border-rose-500" : ""
                  }`}
                />
                {errors.preferredDate && (
                  <p className="mt-1 text-xs text-rose-500">{errors.preferredDate}</p>
                )}
              </div>

              <div>
                <Label className="text-xs font-semibold text-black" style={labelStyle}>Preferred Time Window</Label>
                <Select value={preferredTimeSlot} onValueChange={setPreferredTimeSlot}>
                  <SelectTrigger style={inputStyle} className="mt-1.5 bg-white border-slate-300 text-black focus:border-amber-500">
                    <SelectValue placeholder="Select preferred time window..." />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }} className="bg-white border-slate-200 text-black shadow-xl">
                    <SelectItem value="Morning (9:00 AM - 12:00 PM)" className="text-black focus:bg-amber-50 focus:text-black">
                      Morning (9:00 AM - 12:00 PM)
                    </SelectItem>
                    <SelectItem value="Afternoon (12:00 PM - 4:00 PM)" className="text-black focus:bg-amber-50 focus:text-black">
                      Afternoon (12:00 PM - 4:00 PM)
                    </SelectItem>
                    <SelectItem value="Evening (4:00 PM - 7:00 PM)" className="text-black focus:bg-amber-50 focus:text-black">
                      Evening (4:00 PM - 7:00 PM)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-black" style={labelStyle}>Meeting Platform</Label>
                <Select value={meetingPlatform} onValueChange={setMeetingPlatform}>
                  <SelectTrigger style={inputStyle} className="mt-1.5 bg-white border-slate-300 text-black focus:border-amber-500">
                    <SelectValue placeholder="Select meeting platform..." />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }} className="bg-white border-slate-200 text-black shadow-xl">
                    <SelectItem value="Google Meet" className="text-black focus:bg-amber-50 focus:text-black">Google Meet (Video)</SelectItem>
                    <SelectItem value="Zoom" className="text-black focus:bg-amber-50 focus:text-black">Zoom Meeting</SelectItem>
                    <SelectItem value="Phone Call" className="text-black focus:bg-amber-50 focus:text-black">Direct Phone Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="talent-q" className="text-xs font-semibold text-black" style={labelStyle}>
                  Key Questions or Specific Requirements to Cover
                </Label>
                <Textarea
                  id="talent-q"
                  rows={3}
                  value={discussionQuestions}
                  style={inputStyle}
                  onChange={(e) => setDiscussionQuestions(e.target.value)}
                  placeholder={spec.consultation.notesPlaceholder || "Enter your key questions or specific requirements to cover"}
                  className="mt-1.5 bg-white border-slate-300 text-black placeholder:text-slate-400 focus:bg-white focus:border-amber-500 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* SUBMISSION FOOTER & TRUST SIGNALS */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={submitting}
            style={{ backgroundColor: "#f59e0b", color: "#000000" }}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-sm font-bold text-black shadow-lg shadow-amber-500/25 transition-all hover:from-amber-300 hover:to-amber-400 disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing {activeSubSpec.title}...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {action === "apply" ? (
                  <>
                    {isHireTalentTarget
                      ? `Hire Talent for ${spec.optionTitle}`
                      : `Submit Application for ${spec.optionTitle}`}
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : action === "get-started" ? (
                  <>
                    Get Started with {spec.optionTitle}
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Confirm Consultation for {spec.optionTitle}
                    <Calendar className="h-4 w-4" />
                  </>
                )}
              </span>
            )}
          </Button>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 font-medium" style={{ color: "#475569" }}>
            <span className="flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-emerald-600" />
              Mutual NDA & SOC 2 certified data handling
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-amber-600" />
              Average response time: &lt; 24 business hours
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
