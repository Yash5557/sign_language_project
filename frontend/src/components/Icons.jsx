import React from "react";
import helpingHandEmblem from "../assets/helping-hand-emblem.png";
import {
  CheckCircle2,
  Terminal,
  GitCommit,
  ShieldCheck,
  Camera,
  Video,
  Hand,
  Languages,
  Volume2,
  VolumeX,
  Mic,
  Upload,
  Download,
  Globe,
  Check,
  Palette,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  Activity,
  Cpu,
  AlertTriangle,
  Layers,
  Play,
  ArrowRight,
  Sliders,
  Code2,
  BookOpen,
  Zap,
  Timer,
  FileVideo,
  Target,
  RefreshCw,
  Search,
  Eye,
  SlidersHorizontal,
  Flame,
  Award,
  Users,
  Heart,
  Stethoscope,
  GraduationCap,
  ExternalLink,
  FileText,
  Lightbulb,
  Pause,
  Square,
  Headphones,
  VideoOff,
  CameraOff,
  Power,
  SwitchCamera
} from "lucide-react";

// Standard vector UI library icons with clean 1.5px stroke width
export function CheckCircleIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <CheckCircle2 size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function TerminalIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Terminal size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function GitCommitIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <GitCommit size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function ShieldCheckIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <ShieldCheck size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function LogoIcon({ size = 28, className = "", style = {} }) {
  return (
    <img
      src={helpingHandEmblem}
      alt="Helping Hand Logo"
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: "contain",
        display: "inline-block",
        verticalAlign: "middle",
        ...style
      }}
    />
  );
}

export function CameraIcon({ size = 20, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Camera size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function VideoIcon({ size = 20, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Video size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function HandGestureIcon({ size = 20, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Hand size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function TranslateIcon({ size = 20, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Languages size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function AudioIcon({ size = 20, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Volume2 size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function MuteIcon({ size = 20, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <VolumeX size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function MicrophoneIcon({ size = 20, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Mic size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function UploadIcon({ size = 20, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Upload size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function LanguageIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Languages size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function GlobeIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Globe size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function CheckIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Check size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function PaletteIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Palette size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function SparklesIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Sparkles size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function SunIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Sun size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function MoonIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Moon size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function ChevronDownIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <ChevronDown size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function ActivityIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Activity size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function CpuIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Cpu size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function AlertTriangleIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <AlertTriangle size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function LayersIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Layers size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function PlayIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Play size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function ArrowRightIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <ArrowRight size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function CodeIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Code2 size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function BookOpenIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <BookOpen size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function ZapIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Zap size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function TimerIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Timer size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function FileVideoIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <FileVideo size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function TargetIcon({ size = 18, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Target size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function RefreshCwIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <RefreshCw size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function SearchIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Search size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function EyeIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Eye size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function SlidersIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <SlidersHorizontal size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function FlameIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Flame size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function AwardIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Award size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function UsersIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Users size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function HeartIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Heart size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function StethoscopeIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Stethoscope size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function GraduationCapIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <GraduationCap size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function ExternalLinkIcon({ size = 14, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <ExternalLink size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function FileTextIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <FileText size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function LightbulbIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Lightbulb size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function PauseIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Pause size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function SquareIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Square size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function HeadphonesIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Headphones size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function HandIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Hand size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function VideoOffIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <VideoOff size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function CameraOffIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <CameraOff size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function PowerIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Power size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function SwitchCameraIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <SwitchCamera size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

export function DownloadIcon({ size = 16, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return <Download size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}
