import {
  Activity, ArrowRight, ArrowRightLeft, Award, BadgeCheck, BarChart3, Bot, Boxes, Briefcase, Building2, Calculator,
  CalendarDays, Check, ChevronDown, ClipboardCheck, Brain, BrainCircuit,
  Clapperboard, Clock, CloudCog, Cog, Compass, Contact, Cpu, Database, DraftingCompass, Code,
  Factory, FileSearch, FileText, Globe, Handshake, HardHat, Headset, HeartHandshake, History,
  Inbox, Landmark, Layers, Lightbulb, LineChart, Megaphone, MessageSquare, Network, Package,
  Palette, PenTool, Phone, Plug, Receipt, RefreshCw, Rocket, ScanEye, ScanLine, Settings,
  Shield, ShieldCheck, ShoppingCart, Smartphone, Sparkles, Star, Target, TrendingUp, Users, UserCheck, UserCircle, Workflow,
  Zap, Wrench, Search, GraduationCap, Bell, BookOpen, LayoutDashboard, MapPin,
  AudioLines, Atom, Binary, Box, Braces, Brush, Camera, CircuitBoard, Cloud,
  CloudDownload, CloudUpload, Coins, Container, Crown, Earth, Fingerprint, Flame,
  FlaskConical, Frame, Gauge, Gem, GitBranch, GitMerge, GitPullRequest, HardDrive,
  Image, KeyRound, ListChecks, Lock, Mail, Mic, MonitorPlay, Music, Orbit, PiggyBank,
  Play, Podcast, QrCode, Radar, Radio, Repeat, RotateCcw, Route, Scale, ScanBarcode,
  Server, ServerCog, Siren, Ship, Shapes, Terminal, Timer, TrendingDown, Trophy,
  Type, Wand2, Wallet, Waypoints, Film, Video, X, type LucideIcon,
} from "lucide-react";

// Note: ChevronDown is also imported above and added to the ICONS map below.

const ICONS: Record<string, LucideIcon> = {
  Activity, ArrowRight, ArrowRightLeft, BarChart3, Bot, Boxes, Briefcase, Building2, Calculator, ChevronDown, ClipboardCheck,
  Clapperboard, CloudCog, Cog, Compass, Contact, Cpu, Database, DraftingCompass,
  Factory, FileSearch, FileText, Globe, Handshake, HardHat, Headset, HeartHandshake, History,
  Inbox, Landmark, Layers, Lightbulb, LineChart, Megaphone, MessageSquare, Network, Package,
  Palette, PenTool, Plug, Receipt, RefreshCw, Rocket, ScanEye, ScanLine, Settings,
  ShieldCheck, ShoppingCart, Smartphone, Sparkles, Target, TrendingUp, Users, UserCircle, Workflow,
  Zap, Wrench, Search, GraduationCap, Bell, BookOpen, LayoutDashboard,
  AudioLines, Atom, Binary, Box, Braces, Brush, Camera, CircuitBoard, Cloud,
  CloudDownload, CloudUpload, Coins, Container, Crown, Earth, Fingerprint, Flame,
  FlaskConical, Frame, Gauge, Gem, GitBranch, GitMerge, GitPullRequest, HardDrive,
  Image, KeyRound, ListChecks, Lock, Mail, Mic, MonitorPlay, Music, Orbit, PiggyBank,
  Play, Podcast, QrCode, Radar, Radio, Repeat, RotateCcw, Route, Scale, ScanBarcode,
  Server, ServerCog, Siren, Ship, Shapes, Terminal, Timer, TrendingDown, Trophy,
  Type, Wand2, Wallet, Waypoints, Film, Video, X,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.8,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = ICONS[name] ?? Sparkles;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}

/** Gradient visual tile used across cards & detail heroes */
export function AccentTile({
  gradient,
  icon,
  className,
  iconClass,
}: {
  gradient: string;
  icon: string;
  className?: string;
  iconClass?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${className ?? ""}`}
    >
      <div className="absolute inset-0 surface-grid opacity-60" aria-hidden="true" />
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15 blur-xl"
        aria-hidden="true"
      />
      <Icon name={icon} className={`relative text-white/95 ${iconClass ?? "h-10 w-10"}`} />
    </div>
  );
}
