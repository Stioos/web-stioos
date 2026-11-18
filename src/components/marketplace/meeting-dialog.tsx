"use client";

import { useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Loader2,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import type { Service } from "@/types";
import { useAppStore } from "@/lib/store";
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
  service: Service;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const addInquiry = useAppStore((s) => s.addInquiry);

  const [meetingType, setMeetingType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setMeetingType("");
    setDate("");
    setTime("");
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
    if (!name.trim()) return setError("Your name is required.");
    if (!email.trim()) return setError("Your email is required.");

    setSubmitting(true);
    // Compose a structured requirements string carrying the meeting context.
    const typeLabel =
      MEETING_TYPES.find((m) => m.value === meetingType)?.label ?? meetingType;
    const requirements = [
      `Meeting Type: ${typeLabel}`,
      `Preferred Date: ${date}`,
      `Preferred Time: ${time}`,
      details.trim() ? `Project Details: ${details.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      addInquiry({
        type: "consultation",
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        phone: phone.trim(),
        serviceName: service.name,
        requirements,
        budgetRange: "N/A",
        timeline: `${date} ${time}`,
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

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[480px]">
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
              Thank you, {name.split(" ")[0]}. Your{" "}
              {MEETING_TYPES.find((m) => m.value === meetingType)?.label} on{" "}
              <span className="font-semibold">{date}</span> at{" "}
              <span className="font-semibold">{time}</span> has been queued. A
              senior expert will email {email} to confirm.
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
            {/* Meeting type + date + time */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="meeting-type">Meeting type</Label>
                <Select value={meetingType} onValueChange={setMeetingType}>
                  <SelectTrigger id="meeting-type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEETING_TYPES.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="meeting-date">Preferred date</Label>
                <Input
                  id="meeting-date"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="meeting-time">Preferred time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger id="meeting-time" className="w-full">
                  <Clock className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="meeting-name">Full name *</Label>
                <Input
                  id="meeting-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="meeting-email">Email *</Label>
                <Input
                  id="meeting-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="meeting-company">Company</Label>
                <Input
                  id="meeting-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="meeting-phone">Phone</Label>
                <Input
                  id="meeting-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

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
