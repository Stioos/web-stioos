"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TalentIntakeForm } from "./talent-intake-form";
import type { TalentAction } from "@/data/talent-form-specs";

interface TalentActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  optionSlug: string;
  initialAction?: TalentAction;
}

export function TalentActionDialog({
  open,
  onOpenChange,
  optionSlug,
  initialAction = "apply",
}: TalentActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-theme="light"
        style={{ backgroundColor: "#ffffff", color: "#000000" }}
        className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-black shadow-2xl sm:p-7 md:max-w-3xl"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Talent Solutions Intake</DialogTitle>
        </DialogHeader>

        <TalentIntakeForm
          key={`${optionSlug}-${initialAction}`}
          optionSlug={optionSlug}
          initialAction={initialAction}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
