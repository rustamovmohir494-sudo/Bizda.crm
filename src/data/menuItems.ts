import type { LucideIcon } from "lucide-react";

import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  TicketPercent,
  Tags,
  CreditCard,
  Star,
  PackagePlus,
  Image,
  Package,
  MessageSquare,
  ShieldCheck,
  Settings,
} from "lucide-react";

export interface MenuItem {
  label: string;
  icon: LucideIcon;
  active?: boolean;
}

export const mainMenu: MenuItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Order Management",
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    icon: Users,
  },
  {
    label: "Coupon Code",
    icon: TicketPercent,
  },
  {
    label: "Categories",
    icon: Tags,
  },
  {
    label: "Transaction",
    icon: CreditCard,
  },
  {
    label: "Brand",
    icon: Star,
  },
];

export const productMenu: MenuItem[] = [
  {
    label: "Add Products",
    icon: PackagePlus,
  },
  {
    label: "Product Media",
    icon: Image,
  },
  {
    label: "Product List",
    icon: Package,
  },
  {
    label: "Product Reviews",
    icon: MessageSquare,
  },
];

export const adminMenu: MenuItem[] = [
  {
    label: "Admin role",
    icon: ShieldCheck,
    active: true,
  },
  {
    label: "Control Authority",
    icon: Settings,
  },
];