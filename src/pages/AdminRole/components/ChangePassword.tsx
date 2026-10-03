import {
  Eye,
  EyeOff,
} from "lucide-react";
import "./ChangePassword.css";
import { message } from "antd";

interface ChangePasswordProps {
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;

  setCurrentPassword: (
    value: string,
  ) => void;

  setNewPassword: (
    value: string,
  ) => void;

  setRepeatPassword: (
    value: string,
  ) => void;

  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showRepeatPassword: boolean;

  setShowCurrentPassword: (
    value: boolean,
  ) => void;

  setShowNewPassword: (
    value: boolean,
  ) => void;

  setShowRepeatPassword: (
    value: boolean,
  ) => void;

  isChangingPassword: boolean;

  onChangePassword: () => void;
}

export default function ChangePassword({
  currentPassword,
  newPassword,
  repeatPassword,

  setCurrentPassword,
  setNewPassword,
  setRepeatPassword,

  showCurrentPassword,
  showNewPassword,
  showRepeatPassword,

  setShowCurrentPassword,
  setShowNewPassword,
  setShowRepeatPassword,

  isChangingPassword,
  onChangePassword,
}: ChangePasswordProps) {
  return (
    <div className="admin-card password-card">
      <div className="card-title-row">
        <h3>Change Password</h3>

        <button
          type="button"
          className="help-button"
          onClick={() =>
            message.info(
              "Current passwordni kiriting va yangi passwordni ikki marta yozing.",
            )
          }
        >
          Need help ⓘ
        </button>
      </div>

      <label>Current Password</label>

      <div className="password-input">
        <input
          type={
            showCurrentPassword
              ? "text"
              : "password"
          }
          value={currentPassword}
          onChange={(event) =>
            setCurrentPassword(
              event.target.value,
            )
          }
          placeholder="Enter password"
        />

        <button
          type="button"
          onClick={() =>
            setShowCurrentPassword(
              !showCurrentPassword,
            )
          }
        >
          {showCurrentPassword ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>

      <button
        type="button"
        className="forgot-password"
        onClick={() =>
          message.info(
            "Passwordni tiklash backend recovery endpointiga bog‘lanadi.",
          )
        }
      >
        Forgot Current Password? Click here
      </button>

      <label>New Password</label>

      <div className="password-input">
        <input
          type={
            showNewPassword
              ? "text"
              : "password"
          }
          value={newPassword}
          onChange={(event) =>
            setNewPassword(
              event.target.value,
            )
          }
          placeholder="Enter password"
        />

        <button
          type="button"
          onClick={() =>
            setShowNewPassword(
              !showNewPassword,
            )
          }
        >
          {showNewPassword ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>

      <label>Re-enter Password</label>

      <div className="password-input">
        <input
          type={
            showRepeatPassword
              ? "text"
              : "password"
          }
          value={repeatPassword}
          onChange={(event) =>
            setRepeatPassword(
              event.target.value,
            )
          }
          placeholder="Enter password"
        />

        <button
          type="button"
          onClick={() =>
            setShowRepeatPassword(
              !showRepeatPassword,
            )
          }
        >
          {showRepeatPassword ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>

      <button
        type="button"
        className="save-password-button"
        onClick={onChangePassword}
        disabled={isChangingPassword}
      >
        {isChangingPassword
          ? "Saving..."
          : "Save Change"}
      </button>
    </div>
  );
}