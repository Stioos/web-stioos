"use client";

import { useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppStore, useCurrentUser } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

const MEETING_TYPES = [
  { value: "discovery", label: "Discovery Call" },
  { value: "technical", label: "Technical Consultation" },
  { value: "demo", label: "Product Demo" },
  { value: "scoping", label: "Project Scoping" },
];

const TIME_SLOTS = [
  "09:00 AM",
  "11:00 AM",
  "02:00 PM",
  "04:00 PM",
];

const TIME_ZONES = [
  "Europe/Berlin",
  "Asia/Kolkata",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Singapore",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type MeetingSubject = { name: string };

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * MeetingDialog — a booking flow opened from the ServiceCard's "Book a
 * Meeting" CTA. Captures meeting type, preferred date + time, contact
 * details, and a short project brief, then submits as a consultation
 * inquiry via the existing store.addInquiry (no new API or duplicate
 * form infrastructure).
 *
 * Controlled open state so the ServiceCard can mount it per-card.
 */
export function MeetingDialog({
  service,
  open,
  onOpenChange,
}: {
  service: MeetingSubject;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const addInquiry = useAppStore((s) => s.addInquiry);
  const currentUser = useCurrentUser();

  const [meetingType, setMeetingType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [timeZone, setTimeZone] = useState("Europe/Berlin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const current = new Date();
    return new Date(current.getFullYear(), current.getMonth(), 1);
  });

  const contactName = currentUser?.name ?? name;
  const contactEmail = currentUser?.email ?? email;
  const contactCompany = currentUser?.company ?? company;
  const contactPhone = currentUser?.phone ?? phone;

  const reset = () => {
    setMeetingType("");
    setDate("");
    setTime("");
    setTimeZone("Europe/Berlin");
    setName("");
    setEmail("");
    setCompany("");
    setPhone("");
    setDetails("");
    setSubmitting(false);
    setDone(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!meetingType) return setError("Please select a meeting type.");
    if (!date) return setError("Please pick a preferred date.");
    if (!time) return setError("Please pick a preferred time.");
    if (!contactName.trim()) return setError("Your name is required.");
    if (!contactEmail.trim()) return setError("Your email is required.");

    setSubmitting(true);
    // Compose a structured requirements string carrying the meeting context.
    const typeLabel =
      MEETING_TYPES.find((m) => m.value === meetingType)?.label ?? meetingType;
    const requirements = [
      `Meeting Type: ${typeLabel}`,
      `Preferred Date: ${date}`,
      `Preferred Time: ${time}`,
      `Time Zone: ${timeZone}`,
      details.trim() ? `Project Details: ${details.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      addInquiry({
        type: "consultation",
        name: contactName.trim(),
        email: contactEmail.trim(),
        company: contactCompany.trim(),
        phone: contactPhone.trim(),
        serviceName: service.name,
        requirements,
        budgetRange: "N/A",
        timeline: `${date} ${time} (${timeZone})`,
      });
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Today's date as min for the date picker.
  const today = new Date().toISOString().split("T")[0];
  const monthLabel = calendarMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const firstWeekday = calendarMonth.getDay();
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => index - firstWeekday + 1);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <CalendarClock className="h-5 w-5 text-violet-600" />
            Book a Meeting
          </DialogTitle>
          <DialogDescription>
            Schedule a session with our team about{" "}
            <span className="font-semibold text-foreground">{service.name}</span>.
            We&apos;ll confirm your slot within one business day.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <h3 className="text-lg font-bold text-foreground">Meeting requested!</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Thank you, {contactName.split(" ")[0]}. Your{" "}
              {MEETING_TYPES.find((m) => m.value === meetingType)?.label} on{" "}
              <span className="font-semibold">{date}</span> at{" "}
              <span className="font-semibold">{time}</span> ({timeZone}) has been queued. A
              senior expert will email {contactEmail} to confirm.
            </p>
            <Button
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              className="mt-2"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] lg:grid lg:grid-cols-[0.9fr_1.35fr_0.8fr]">
              <div className="space-y-4 border-b border-white/10 p-4 lg:border-r lg:border-b-0">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-400">Meeting for</p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-white">{service.name}</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meeting-type">Session type</Label>
                  <Select value={meetingType} onValueChange={setMeetingType}>
                    <SelectTrigger id="meeting-type" className="w-full bg-white/[0.03]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {MEETING_TYPES.map((meeting) => (
                        <SelectItem key={meeting.value} value={meeting.value}>{meeting.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-xs text-slate-400">
                  <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-violet-400" />45 min session</span>
                  <span className="flex items-center gap-2"><CalendarIcon className="h-3.5 w-3.5 text-violet-400" />Choose a date and time</span>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meeting-timezone">Time zone</Label>
                  <Select value={timeZone} onValueChange={setTimeZone}>
                    <SelectTrigger id="meeting-timezone" className="w-full bg-white/[0.03]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_ZONES.map((zone) => <SelectItem key={zone} value={zone}>{zone}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-b border-white/10 p-4 lg:border-r lg:border-b-0">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{monthLabel}</p>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Next month"><ChevronRight className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {WEEKDAYS.map((weekday) => <span key={weekday} className="py-1 text-[9px] font-semibold uppercase text-slate-500">{weekday}</span>)}
                  {calendarDays.map((day, index) => {
                    if (day < 1) return <span key={`empty-${index}`} />;
                    const dateKey = toDateKey(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                    const isPast = dateKey < today;
                    const isSelected = date === dateKey;
                    return <button key={dateKey} type="button" disabled={isPast} onClick={() => setDate(dateKey)} className={`mx-auto flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors ${isSelected ? "bg-violet-600 font-bold text-white" : "text-slate-300 hover:bg-white/10"} ${isPast ? "cursor-not-allowed text-slate-700 hover:bg-transparent" : ""}`}>{day}</button>;
                  })}
                </div>
              </div>

              <div className="p-4">
                <p className="mb-3 text-xs font-semibold text-white">Available times</p>
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                  {TIME_SLOTS.map((slot) => (
                    <button key={slot} type="button" onClick={() => setTime(slot)} className={`h-9 rounded-lg border text-xs font-semibold transition-colors ${time === slot ? "border-violet-500 bg-violet-500/15 text-violet-300" : "border-white/10 text-slate-300 hover:border-violet-400/50 hover:bg-white/[0.04]"}`}>{slot}</button>
                  ))}
                </div>
              </div>
            </div>

            {!currentUser && (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="meeting-name">Full name *</Label>
                    <Input id="meeting-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="meeting-email">Email *</Label>
                    <Input id="meeting-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="meeting-company">Company</Label>
                    <Input id="meeting-company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="meeting-phone">Phone</Label>
                    <Input id="meeting-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
              </>
            )}

            {/* Project details */}
            <div className="space-y-1.5">
              <Label htmlFor="meeting-details">Project details</Label>
              <Textarea
                id="meeting-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Briefly describe what you'd like to discuss…"
                rows={3}
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-violet-600 hover:bg-violet-500"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Requesting…
                </>
              ) : (
                <>
                  <CalendarIcon className="h-4 w-4" />
                  Request Meeting
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
