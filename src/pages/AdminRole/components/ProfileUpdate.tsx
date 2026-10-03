import {
  CalendarDays,
  EyeOff,
  ImagePlus,
  Pencil,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import type { ChangeEvent } from "react";

import useAvatarImage from "../../../hooks/useAvatarImage";

import "./ProfileUpdate.css";

interface ProfileUpdateProps {
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string;

  email?: string;

  profileName: string;
  initials: string;

  isEditing: boolean;
  isSaving: boolean;

  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setPhone: (value: string) => void;
  setIsEditing: (value: boolean) => void;
  setAvatar: (value: string) => void;

  onAvatarChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;

  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileUpdate({
  firstName,
  lastName,
  phone,
  avatar,
  email,
  profileName,
  initials,
  isEditing,
  isSaving,
  setFirstName,
  setLastName,
  setPhone,
  setIsEditing,
  setAvatar,
  onAvatarChange,
  onSave,
  onCancel,
}: ProfileUpdateProps) {
  const {
    imageUrl: avatarImage,
  } = useAvatarImage(
    avatar || "",
  );

  return (
    <div className="admin-card profile-update-card">
      <div className="card-title-row">
        <h3>Profile Update</h3>

        {!isEditing ? (
          <button
            type="button"
            className="edit-profile-button"
            onClick={() =>
              setIsEditing(true)
            }
          >
            <Pencil size={15} />
            Edit
          </button>
        ) : (
          <button
            type="button"
            className="cancel-edit-button"
            onClick={onCancel}
          >
            <X size={15} />
            Cancel
          </button>
        )}
      </div>

      <div className="update-avatar-row">
        {avatarImage ? (
          <img
            src={avatarImage}
            alt={profileName}
            className="update-avatar"
          />
        ) : (
          <div className="update-avatar update-avatar-placeholder">
            <UserRound size={24} />
          </div>
        )}

        {isEditing && (
          <div className="avatar-buttons">
            <label className="upload-button">
              <ImagePlus size={16} />
              Upload New

              <input
                type="file"
                accept="image/*"
                onChange={onAvatarChange}
                hidden
              />
            </label>

            <button
              type="button"
              className="delete-avatar-button"
              onClick={() =>
                setAvatar("")
              }
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label>First Name</label>

          <input
            value={firstName}
            disabled={!isEditing}
            onChange={(event) =>
              setFirstName(
                event.target.value,
              )
            }
          />
        </div>

        <div className="form-field">
          <label>Last Name</label>

          <input
            value={lastName}
            disabled={!isEditing}
            onChange={(event) =>
              setLastName(
                event.target.value,
              )
            }
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label>Password</label>

          <div className="readonly-password">
            <input
              value="••••••••••••"
              disabled
              readOnly
            />

            <EyeOff size={17} />
          </div>
        </div>

        <div className="form-field">
          <label>Phone Number</label>

          <input
            value={phone}
            disabled={!isEditing}
            onChange={(event) =>
              setPhone(
                event.target.value,
              )
            }
          />
        </div>
      </div>

      <div className="form-field">
        <label>E-mail</label>

        <input
          value={email ?? ""}
          disabled
          readOnly
        />
      </div>

      <div className="form-field">
        <label>Date of Birth</label>

        <div className="disabled-field">
          <span>
            Not connected to API
          </span>

          <CalendarDays size={17} />
        </div>
      </div>

      <div className="form-field">
        <label>Location</label>

        <div className="disabled-field">
          <span>
            Not connected to API
          </span>
        </div>
      </div>

      <div className="form-field">
        <label>Credit Card</label>

        <div className="disabled-field">
          <span>
            •••• •••• •••• 4444
          </span>
        </div>
      </div>

      <div className="form-field">
        <label>Biography</label>

        <textarea
          disabled
          placeholder="Enter a biography about you"
        />
      </div>

      {isEditing && (
        <div className="profile-save-row">
          <button
            type="button"
            className="save-profile-button"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

