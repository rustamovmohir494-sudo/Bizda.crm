import {
  Bell,
  Search,
  UserRound,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import useAvatarImage from "../../hooks/useAvatarImage";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

import "./Header.css";

export default function Header() {
  const { admin } = useAuth();

  const {
    imageUrl: avatar,
  } = useAvatarImage(
    admin?.avatar ?? "",
  );

  return (
    <header className="header">
      <div className="header-title">
        <h1>Dashboard</h1>
      </div>

      <div className="header-actions">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search data, users, or reports"
          />

          <Search size={18} />
        </div>

        <button
          type="button"
          className="header-icon-button"
          aria-label="Notifications"
        >
          <Bell size={18} />

          <span className="notification-dot" />
        </button>

        <ThemeToggle />

        <div className="header-avatar">
          {avatar ? (
            <img
              src={avatar}
              alt="Profile"
            />
          ) : (
            <UserRound size={20} />
          )}
        </div>
      </div>
    </header>
  );
}
