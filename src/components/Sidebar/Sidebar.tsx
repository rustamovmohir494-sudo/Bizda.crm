import type { LucideIcon } from "lucide-react";

import {
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Star,
  Tag,
  UserRound,
  Users,
} from "lucide-react";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import useAvatarImage from "../../hooks/useAvatarImage";

import "./Sidebar.css";

interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const mainMenu: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Order Management",
    path: "/orders",
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    label: "Coupon Code",
    path: "/coupons",
    icon: Tag,
  },
  {
    label: "Categories",
    path: "/categories",
    icon: FolderOpen,
  },
  {
    label: "Transaction",
    path: "/transactions",
    icon: CircleDollarSign,
  },
  {
    label: "Brand",
    path: "/brands",
    icon: Star,
  },
];

const productMenu: MenuItem[] = [
  {
    label: "Add Products",
    path: "/products/new",
    icon: Package,
  },
  {
    label: "Product Media",
    path: "/products/media",
    icon: FolderOpen,
  },
  {
    label: "Product List",
    path: "/products",
    icon: Package,
  },
  {
    label: "Product Reviews",
    path: "/products/reviews",
    icon: Star,
  },
];

const adminMenu: MenuItem[] = [
  {
    label: "Admin role",
    path: "/admin-role",
    icon: UserRound,
  },
  {
    label: "Control Authority",
    path: "/control-authority",
    icon: Settings,
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface SidebarSectionProps {
  title: string;
  items: MenuItem[];
}

function SidebarSection({
  title,
  items,
}: SidebarSectionProps) {
  const location = useLocation();

  return (
    <div className="sidebar-section">
      <div className="sidebar-section-title">
        {title}
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;

          const isDashboard =
            item.path === "/";

          const isProductMedia =
            item.path === "/products/media";

          const isProductList =
            item.path === "/products";

          let active = false;

          if (isDashboard) {
            active =
              location.pathname === "/";
          } else if (isProductMedia) {
            active =
              location.pathname ===
                "/products/media" ||
              location.pathname.startsWith(
                "/products/media/",
              );
          } else if (isProductList) {
            active =
              location.pathname ===
              "/products";
          } else {
            active =
              location.pathname ===
                item.path ||
              location.pathname.startsWith(
                `${item.path}/`,
              );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={`sidebar-link ${
                active ? "active" : ""
              }`}
            >
              <Icon
                size={18}
                strokeWidth={1.8}
              />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export default function Sidebar({
  collapsed,
  onToggle,
}: SidebarProps) {
  const navigate = useNavigate();

  const {
    admin,
    logout,
  } = useAuth();

  const {
    imageUrl: avatar,
  } = useAvatarImage(
    admin?.avatar ?? "",
  );

  async function handleLogout() {
    await logout();

    navigate("/login", {
      replace: true,
    });
  }

  const firstName =
    admin?.firstName ||
    admin?.login ||
    "Admin";

  const lastName =
    admin?.lastName || "";

  const email =
    admin?.email ||
    "admin@example.com";

  return (
    <aside
      className={`sidebar ${
        collapsed ? "collapsed" : ""
      }`}
    >
      <div className="sidebar-top">
        <div className="sidebar-logo">
          DEAL<span>PORT</span>
        </div>

        <button
          type="button"
          className="sidebar-collapse"
          onClick={onToggle}
          aria-label={
            collapsed
              ? "Open sidebar"
              : "Close sidebar"
          }
        >
          {collapsed ? (
            <ChevronRight size={17} />
          ) : (
            <ChevronLeft size={17} />
          )}
        </button>
      </div>

      <div className="sidebar-content">
        <SidebarSection
          title="Main menu"
          items={mainMenu}
        />

        <SidebarSection
          title="Product"
          items={productMenu}
        />

        <SidebarSection
          title="Admin"
          items={adminMenu}
        />
      </div>

      <div className="sidebar-bottom">
        <div className="admin-profile">
          <div className="admin-avatar">
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
              />
            ) : (
              <UserRound size={20} />
            )}
          </div>

          {!collapsed && (
            <div className="admin-info">
              <strong>
                {firstName} {lastName}
              </strong>

              <span>{email}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={18} />

          {!collapsed && (
            <span>Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}