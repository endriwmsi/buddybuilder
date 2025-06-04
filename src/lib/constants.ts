import {
  IconDashboard,
  IconUsers,
  IconFolder,
  IconChartFunnelFilled,
  IconListDetails,
} from "@tabler/icons-react";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";

export const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Tarefas",
    url: "/tasks",
    icon: IconListDetails,
  },
  {
    title: "Funis",
    url: "/funnels",
    icon: IconChartFunnelFilled,
  },
  {
    title: "Projects",
    url: "#",
    icon: IconFolder,
  },
  {
    title: "Team",
    url: "#",
    icon: IconUsers,
  },
];

export const teams = [
  {
    name: "Acme Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
  {
    name: "Acme Corp.",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: Command,
    plan: "Free",
  },
];

export const sourceOptions = [
  { value: "WEBSITE", label: "Website" },
  { value: "REFERRAL", label: "Indicação" },
  { value: "COLD_CALL", label: "Cold Call" },
  { value: "EMAIL_CAMPAIGN", label: "Campanha de Email" },
  { value: "SOCIAL_MEDIA", label: "Redes Sociais" },
  { value: "EVENT", label: "Evento" },
  { value: "OTHER", label: "Outro" },
] as const;

export const statusOptions = [
  { value: "NEW", label: "Novo" },
  { value: "CONTACTED", label: "Contatado" },
  { value: "QUALIFIED", label: "Qualificado" },
  { value: "PROPOSAL", label: "Proposta" },
  { value: "NEGOTIATION", label: "Negociação" },
  { value: "WON", label: "Ganho" },
  { value: "LOST", label: "Perdido" },
] as const;

export const statusTranslations: Record<string, string> = {
  NEW: "Novo",
  CONTACTED: "Contatado",
  QUALIFIED: "Qualificado",
  PROPOSAL: "Proposta",
  NEGOTIATION: "Negociação",
  WON: "Ganho",
  LOST: "Perdido",
};
