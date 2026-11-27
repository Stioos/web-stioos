export interface LifecycleStep {
  step: number;
  key: string;
  label: string;
}

// ─────────────────────────────────────────────────────────────
// 1. CANDIDATE LIFECYCLE FOR THE 5 TARGET OPTIONS:
//    Get Trained, Get Placed, Get Certified, Joining Terms, Learning Terms
//    Steps: Applied, Review, Schedule, Screening, Selected, Onboard, Assign, Completed
// ─────────────────────────────────────────────────────────────
export const CANDIDATE_TALENT_LIFECYCLE_STEPS: LifecycleStep[] = [
  { step: 1, key: "applied", label: "Applied" },
  { step: 2, key: "review", label: "Review" },
  { step: 3, key: "schedule", label: "Schedule" },
  { step: 4, key: "screening", label: "Screening" },
  { step: 5, key: "selected", label: "Selected" },
  { step: 6, key: "onboard", label: "Onboard" },
  { step: 7, key: "assign", label: "Assign" },
  { step: 8, key: "completed", label: "Completed" },
];

// ─────────────────────────────────────────────────────────────
// 2. EMPLOYER LIFECYCLE FOR BUILD TALENT (and Cohort Training):
// ─────────────────────────────────────────────────────────────
export const BUILD_TALENT_LIFECYCLE_STEPS: LifecycleStep[] = [
  { step: 1, key: "brief", label: "Applied / Brief" },
  { step: 2, key: "review", label: "In Review" },
  { step: 3, key: "scoping", label: "Stack Scoping" },
  { step: 4, key: "quoted", label: "Quoted" },
  { step: 5, key: "approved", label: "Approved" },
  { step: 6, key: "onboard", label: "Cohort Onboarding" },
  { step: 7, key: "active", label: "Training Active" },
  { step: 8, key: "completed", label: "Completed" },
];

// ─────────────────────────────────────────────────────────────
// 3. EMPLOYER LIFECYCLE FOR HIRE TALENT (Sourcing & Staffing):
// ─────────────────────────────────────────────────────────────
export const HIRE_TALENT_LIFECYCLE_STEPS: LifecycleStep[] = [
  { step: 1, key: "requisition", label: "Requisition Brief" },
  { step: 2, key: "review", label: "In Review" },
  { step: 3, key: "sourcing", label: "Candidate Sourcing" },
  { step: 4, key: "shortlisted", label: "Shortlisted" },
  { step: 5, key: "interviews", label: "Interviews" },
  { step: 6, key: "offer", label: "Offer & Approvals" },
  { step: 7, key: "onboard", label: "Onboarding" },
  { step: 8, key: "completed", label: "Completed" },
];

// ─────────────────────────────────────────────────────────────
// 4. EMPLOYER LIFECYCLE FOR SCALE WORKFORCE (Pod Deployment):
// ─────────────────────────────────────────────────────────────
export const SCALE_WORKFORCE_LIFECYCLE_STEPS: LifecycleStep[] = [
  { step: 1, key: "brief", label: "Workforce Brief" },
  { step: 2, key: "review", label: "In Review" },
  { step: 3, key: "architecture", label: "Pod Architecture" },
  { step: 4, key: "quoted", label: "Quoted" },
  { step: 5, key: "approved", label: "Approved" },
  { step: 6, key: "onboard", label: "Team Onboarding" },
  { step: 7, key: "active", label: "Active Deployment" },
  { step: 8, key: "completed", label: "Completed" },
];

// ─────────────────────────────────────────────────────────────
// 5. DEFAULT BASELINE LIFECYCLE (General Employer fallback):
// ─────────────────────────────────────────────────────────────
export const DEFAULT_TALENT_LIFECYCLE_STEPS: LifecycleStep[] = [
  { step: 1, key: "open", label: "Applied / Brief" },
  { step: 2, key: "in_review", label: "In Review" },
  { step: 3, key: "scoping", label: "Scoping" },
  { step: 4, key: "quoted", label: "Quoted" },
  { step: 5, key: "approved", label: "Approved" },
  { step: 6, key: "in_progress", label: "Onboarding" },
  { step: 7, key: "active", label: "Active" },
  { step: 8, key: "closed", label: "Completed" },
];

export interface UnifiedTxnMeta {
  groupSlug?: string;
  optionSlug?: string;
  track?: string;
  [key: string]: any;
}

export interface MinimalTalentTxn {
  title?: string;
  details?: string;
  status: string;
  kind?: string;
  meta?: UnifiedTxnMeta;
}

/**
 * Resolves the tailored Engagement Lifecycle steps and current active step
 * number based on whether the transaction originated from candidate pathways
 * (Get Trained, Get Placed, Get Certified, Joining Terms, Learning Terms) or
 * employer enterprise solutions (Build Talent, Hire Talent, Scale Workforce).
 */
export function getLifecycleConfigForTxn(txn: MinimalTalentTxn): {
  steps: LifecycleStep[];
  currentStep: number;
} {
  const groupSlug = (txn.meta?.groupSlug || "").toLowerCase();
  const optionSlug = (txn.meta?.optionSlug || "").toLowerCase();
  const title = (txn.title || "").toLowerCase();
  const details = (txn.details || "").toLowerCase();

  // Check if it belongs to one of the 5 Candidate Portals:
  // get-trained, get-placed, get-certified, joining-terms, learning-terms
  const isCandidateGroup =
    groupSlug === "get-trained" ||
    groupSlug === "get-placed" ||
    groupSlug === "get-certified" ||
    groupSlug === "joining-terms" ||
    groupSlug === "learning-terms" ||
    (!["build-talent", "train-to-hire", "hire-talent", "scale-workforce"].includes(groupSlug) && (
      optionSlug.includes("get-trained") ||
      optionSlug.includes("get-placed") ||
      optionSlug.includes("get-certified") ||
      optionSlug.includes("joining-terms") ||
      optionSlug.includes("learning-terms") ||
      title.includes("get trained") ||
      title.includes("get placed") ||
      title.includes("get certified") ||
      title.includes("joining terms") ||
      title.includes("learning terms") ||
      details.includes("get trained") ||
      details.includes("get placed") ||
      details.includes("get certified") ||
      details.includes("joining terms") ||
      details.includes("learning terms")
    ));

  // Check the 3 Employer Portals:
  const isBuildTalent =
    groupSlug === "build-talent" ||
    optionSlug.includes("build-talent") ||
    optionSlug.includes("train-to-hire") ||
    optionSlug.includes("hire-to-train") ||
    optionSlug.includes("corporate-training") ||
    title.includes("build talent") ||
    title.includes("train to hire") ||
    title.includes("hire to train") ||
    title.includes("corporate training");

  const isHireTalent =
    groupSlug === "hire-talent" ||
    optionSlug.includes("hire-talent") ||
    optionSlug.includes("staffing") ||
    optionSlug.includes("talent-sourcing") ||
    optionSlug.includes("talent-deployment") ||
    title.includes("hire talent") ||
    title.includes("staffing") ||
    title.includes("sourcing");

  const isScaleWorkforce =
    groupSlug === "scale-workforce" ||
    optionSlug.includes("scale-workforce") ||
    optionSlug.includes("workforce-management") ||
    optionSlug.includes("talent-assessment") ||
    optionSlug.includes("placement-services") ||
    title.includes("scale workforce") ||
    title.includes("workforce management") ||
    title.includes("workforce solutions");

  let steps = DEFAULT_TALENT_LIFECYCLE_STEPS;
  let currentStep = 1;

  if (isCandidateGroup) {
    // 5 OPTIONS: applied, review, schedule, screening, selected, onboard, assign, completed
    steps = CANDIDATE_TALENT_LIFECYCLE_STEPS;
    const s = (txn.status || "").toLowerCase();
    switch (s) {
      case "applied":
      case "open":
      case "new":
        currentStep = 1;
        break;
      case "review":
      case "in_review":
        currentStep = 2;
        break;
      case "schedule":
      case "scheduled":
      case "scoping":
        currentStep = 3;
        break;
      case "screening":
      case "screened":
      case "quoted":
        currentStep = 4;
        break;
      case "selected":
      case "selcted":
      case "approved":
        currentStep = 5;
        break;
      case "onboard":
      case "onboarding":
      case "in_progress":
      case "ordered":
        currentStep = 6;
        break;
      case "assign":
      case "assigned":
      case "active":
        currentStep = 7;
        break;
      case "completed":
      case "closed":
      case "delivered":
        currentStep = 8;
        break;
      default:
        currentStep = 1;
    }
  } else if (isHireTalent) {
    steps = HIRE_TALENT_LIFECYCLE_STEPS;
    const s = (txn.status || "").toLowerCase();
    switch (s) {
      case "open":
      case "new":
      case "applied":
        currentStep = 1;
        break;
      case "in_review":
      case "review":
        currentStep = 2;
        break;
      case "scoping":
      case "sourcing":
        currentStep = 3;
        break;
      case "quoted":
      case "shortlisted":
        currentStep = 4;
        break;
      case "approved":
      case "interviews":
        currentStep = 5;
        break;
      case "in_progress":
      case "offer":
        currentStep = 6;
        break;
      case "active":
      case "onboard":
      case "ordered":
        currentStep = 7;
        break;
      case "completed":
      case "closed":
        currentStep = 8;
        break;
      default:
        currentStep = 1;
    }
  } else if (isBuildTalent) {
    steps = BUILD_TALENT_LIFECYCLE_STEPS;
    const s = (txn.status || "").toLowerCase();
    switch (s) {
      case "open":
      case "new":
      case "applied":
        currentStep = 1;
        break;
      case "in_review":
      case "review":
        currentStep = 2;
        break;
      case "scoping":
        currentStep = 3;
        break;
      case "quoted":
        currentStep = 4;
        break;
      case "approved":
        currentStep = 5;
        break;
      case "in_progress":
      case "ordered":
        currentStep = 6;
        break;
      case "active":
        currentStep = 7;
        break;
      case "completed":
      case "closed":
        currentStep = 8;
        break;
      default:
        currentStep = 1;
    }
  } else if (isScaleWorkforce) {
    steps = SCALE_WORKFORCE_LIFECYCLE_STEPS;
    const s = (txn.status || "").toLowerCase();
    switch (s) {
      case "open":
      case "new":
      case "applied":
        currentStep = 1;
        break;
      case "in_review":
      case "review":
        currentStep = 2;
        break;
      case "scoping":
      case "architecture":
        currentStep = 3;
        break;
      case "quoted":
        currentStep = 4;
        break;
      case "approved":
        currentStep = 5;
        break;
      case "in_progress":
      case "ordered":
        currentStep = 6;
        break;
      case "active":
        currentStep = 7;
        break;
      case "completed":
      case "closed":
        currentStep = 8;
        break;
      default:
        currentStep = 1;
    }
  } else {
    steps = DEFAULT_TALENT_LIFECYCLE_STEPS;
    const s = (txn.status || "").toLowerCase();
    switch (s) {
      case "open":
      case "new":
      case "applied":
        currentStep = 1;
        break;
      case "in_review":
      case "review":
        currentStep = 2;
        break;
      case "scoping":
        currentStep = 3;
        break;
      case "quoted":
        currentStep = 4;
        break;
      case "approved":
        currentStep = 5;
        break;
      case "in_progress":
      case "ordered":
        currentStep = 6;
        break;
      case "active":
      case "delivered":
        currentStep = 7;
        break;
      case "completed":
      case "closed":
        currentStep = 8;
        break;
      default:
        currentStep = 1;
    }
  }

  return { steps, currentStep };
}
