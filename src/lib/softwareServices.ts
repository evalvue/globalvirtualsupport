import { Code2, Smartphone, Calculator, Dumbbell, ShoppingCart, Database, Users2, Boxes } from "lucide-react";

export type SoftwareService = {
  slug: string;
  title: string;
  short: string;
  long: string;
  icon: typeof Code2;
  gradient: string;
  features: string[];
  tech: string[];
  projects: { name: string; url?: string; tagline: string; status: "live" | "case-study" }[];
};

export const softwareServices: SoftwareService[] = [
  {
    slug: "website-development",
    title: "Website Development",
    short: "Modern marketing sites, landing pages and corporate websites that convert.",
    long: "Pixel-perfect, blazing-fast websites built with React, Next.js and headless CMS — designed to rank on Google and convert visitors into customers.",
    icon: Code2,
    gradient: "from-blue-500 to-cyan-400",
    features: [
      "Custom UI / UX design",
      "SEO-optimized & lightning fast",
      "Headless CMS integration",
      "Analytics & conversion tracking",
      "Free 1-year maintenance",
    ],
    tech: ["React", "Next.js", "Tailwind", "WordPress", "Shopify"],
    projects: [
      { name: "GlobalVirtualSupport.com", url: "https://globalvirtualsupport.lovable.app", tagline: "Corporate website (this site)", status: "live" },
    ],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    short: "Native-feel iOS & Android apps built once with React Native & Flutter.",
    long: "Cross-platform mobile apps with native performance, push notifications, offline sync and App Store / Play Store publishing handled end-to-end.",
    icon: Smartphone,
    gradient: "from-purple-500 to-pink-400",
    features: [
      "iOS + Android from one codebase",
      "Push notifications & deep linking",
      "Offline-first architecture",
      "App Store & Play Store deployment",
      "Ongoing version updates",
    ],
    tech: ["React Native", "Flutter", "Expo", "Firebase", "Supabase"],
    projects: [
      { name: "GitNFreakk Mobile App", tagline: "Companion app for gym members — bookings, workouts, attendance", status: "case-study" },
    ],
  },
  {
    slug: "accounting-software",
    title: "Accounting Software",
    short: "GST-ready accounting, invoicing and inventory built for Indian businesses.",
    long: "Complete double-entry accounting platform — invoicing, GST returns, e-way bills, inventory, multi-branch and Tally-style ledger reports.",
    icon: Calculator,
    gradient: "from-emerald-500 to-teal-400",
    features: [
      "GST invoicing & e-way bills",
      "Inventory & stock management",
      "Multi-branch & multi-user",
      "P&L, balance sheet, day book",
      "Bank reconciliation",
    ],
    tech: ["React", "Node.js", "PostgreSQL", "GST API"],
    projects: [
      { name: "Retail Accounting Suite", tagline: "Used by 40+ retail stores across Maharashtra", status: "case-study" },
    ],
  },
  {
    slug: "gym-management-software",
    title: "Gym Management Software",
    short: "All-in-one gym software — memberships, billing, attendance, trainers.",
    long: "Manage members, trainers, packages, biometric attendance, recurring billing, diet plans and a branded member mobile app — everything a modern gym needs.",
    icon: Dumbbell,
    gradient: "from-orange-500 to-red-400",
    features: [
      "Member & package management",
      "Biometric / RFID attendance",
      "Auto recurring billing & reminders",
      "Trainer & class scheduling",
      "Branded member mobile app",
    ],
    tech: ["React", "React Native", "Node.js", "Razorpay", "WhatsApp API"],
    projects: [
      { name: "GitNFreakk", url: "https://gitnfreakk.shop", tagline: "Live gym e-commerce + membership platform", status: "live" },
    ],
  },
  {
    slug: "ecommerce-development",
    title: "E-commerce Development",
    short: "Shopify, WooCommerce & custom online stores that actually sell.",
    long: "High-converting online stores with payment gateways, shipping integration, abandoned cart recovery and marketing automation built in.",
    icon: ShoppingCart,
    gradient: "from-pink-500 to-rose-400",
    features: [
      "Shopify & WooCommerce stores",
      "Custom checkout & payment gateway",
      "Inventory & order management",
      "Abandoned cart recovery",
      "Marketing & email automation",
    ],
    tech: ["Shopify", "WooCommerce", "Next.js", "Stripe", "Razorpay"],
    projects: [
      { name: "GitNFreakk Store", url: "https://gitnfreakk.shop", tagline: "Live supplement & apparel e-commerce", status: "live" },
    ],
  },
  {
    slug: "crm-software",
    title: "CRM Software",
    short: "Custom CRMs that fit your sales process — not the other way around.",
    long: "Pipeline management, lead scoring, call logging, WhatsApp integration and powerful dashboards — built around how your team actually sells.",
    icon: Users2,
    gradient: "from-indigo-500 to-blue-400",
    features: [
      "Lead capture & pipeline boards",
      "WhatsApp & call integration",
      "Email sequences & automations",
      "Custom reports & dashboards",
      "Role-based access control",
    ],
    tech: ["React", "Node.js", "PostgreSQL", "Twilio", "WhatsApp API"],
    projects: [
      { name: "Logistics CRM", tagline: "Internal CRM for a US dispatching company — 80+ users", status: "case-study" },
    ],
  },
  {
    slug: "erp-software",
    title: "ERP Software",
    short: "End-to-end ERP for manufacturing, distribution and services.",
    long: "Procurement, production, inventory, HR, finance and reporting — one integrated ERP tailored to your industry workflows.",
    icon: Database,
    gradient: "from-amber-500 to-yellow-400",
    features: [
      "Procurement & vendor management",
      "Production planning & BOM",
      "Multi-warehouse inventory",
      "HR, payroll & finance modules",
      "Real-time MIS dashboards",
    ],
    tech: ["React", "Node.js", "PostgreSQL", "Docker"],
    projects: [
      { name: "Manufacturing ERP", tagline: "Custom ERP for an auto-components manufacturer", status: "case-study" },
    ],
  },
  {
    slug: "custom-software",
    title: "Custom Software",
    short: "Bespoke web & desktop software built around your unique workflow.",
    long: "From internal tools and admin panels to SaaS platforms — we design, build and maintain custom software with clean code and solid architecture.",
    icon: Boxes,
    gradient: "from-fuchsia-500 to-violet-400",
    features: [
      "Requirement workshops & UX",
      "Custom web & desktop apps",
      "Third-party API integrations",
      "Cloud deployment & DevOps",
      "Ongoing support & SLAs",
    ],
    tech: ["React", "Node.js", "Python", "AWS", "Supabase"],
    projects: [
      { name: "Internal Ops Platform", tagline: "Workflow + reporting tool replacing 4 separate spreadsheets", status: "case-study" },
    ],
  },
];

export const getServiceBySlug = (slug?: string) =>
  softwareServices.find((s) => s.slug === slug);