import {
  Copy,
  Edit3,
  Share2,
  UserRound,
} from "lucide-react";

import { message } from "antd";

import useAvatarImage from "../../../hooks/useAvatarImage";

import "./ProfileCard.css";

interface ProfileCardProps {
  profileName: string;
  initials: string;
  email?: string;
  avatar: string;
  onEdit: () => void;
  onCopyEmail: () => void;
}

export default function ProfileCard({
  profileName,
  initials,
  email,
  avatar,
  onEdit,
  onCopyEmail,
}: ProfileCardProps) {
  const {
    imageUrl,
  } = useAvatarImage(avatar);

  const handleSocialMedia = () => {
    message.info(
      "Social media ulash backend API orqali keyin ulanadi.",
    );
  };

  return (
    <div className="admin-card profile-card">
      <div className="card-title-row">
        <h3>Profile</h3>

        <div className="profile-actions">
          <button
            type="button"
            className="icon-button"
            onClick={onEdit}
            title="Edit profile"
          >
            <Edit3 size={17} />
          </button>

          <button
            type="button"
            className="icon-button"
            title="Share profile"
            onClick={() =>
              message.info(
                "Profile share funksiyasi keyin ulanadi.",
              )
            }
          >
            <Share2 size={17} />
          </button>
        </div>
      </div>

      <div className="profile-avatar-wrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={
              profileName ||
              "Profile avatar"
            }
            className="profile-avatar"
          />
        ) : (
          <div className="profile-avatar profile-avatar-placeholder">
            <UserRound size={32} />
          </div>
        )}
      </div>

      <h3 className="profile-name">
        {profileName}
      </h3>

      <div className="profile-email-row">
        <span>
          {email ?? "admin@example.com"}
        </span>

        <button
          type="button"
          onClick={onCopyEmail}
          title="Copy email"
        >
          <Copy size={14} />
        </button>
      </div>

      <div className="linked-title">
        Linked with Social media
      </div>

      <div className="social-icons">
        <span className="google-icon">
          G
        </span>

        <span className="facebook-icon">
          f
        </span>

        <span className="x-icon">
          𝕏
        </span>
      </div>

      <button
        type="button"
        className="social-button"
        onClick={handleSocialMedia}
      >
        <span>+</span>
        Social media
      </button>
    </div>
  );
}

