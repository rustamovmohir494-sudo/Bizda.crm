import ProfileCard from "./components/ProfileCard";
import ChangePassword from "./components/ChangePassword";
import ProfileUpdate from "./components/ProfileUpdate";

import useAdminProfile from "./hooks/useAdminProfile";
import useAvatarImage from "../../hooks/useAvatarImage";

import "./AdminRole.css";

export default function AdminRole() {
  const {
    admin,

    isEditing,
    setIsEditing,

    isSaving,
    isChangingPassword,

    firstName,
    setFirstName,

    lastName,
    setLastName,

    phone,
    setPhone,

    avatar,
    setAvatar,

    currentPassword,
    setCurrentPassword,

    newPassword,
    setNewPassword,

    repeatPassword,
    setRepeatPassword,

    showCurrentPassword,
    setShowCurrentPassword,

    showNewPassword,
    setShowNewPassword,

    showRepeatPassword,
    setShowRepeatPassword,

    handleAvatarChange,
    handleSaveProfile,
    handleChangePassword,
    cancelEditing,
    copyEmail,

    profileName,
    initials,
  } = useAdminProfile();

  const {
    imageUrl: avatarImage,
  } = useAvatarImage(
    avatar || admin?.avatar || "",
  );

  return (
    <div className="admin-role-page">
      <div className="admin-role-header">
        <div>
          <h1>Admin role</h1>

          <p>
            Manage your profile and account settings
          </p>
        </div>
      </div>

      <section className="about-section">
        <h2>About section</h2>

        <div className="admin-role-grid">
          <div className="admin-left-column">
            <ProfileCard
              profileName={profileName}
              initials={initials}
              email={admin?.email}
              avatar={avatarImage}
              onEdit={() =>
                setIsEditing(true)
              }
              onCopyEmail={copyEmail}
            />

            <ChangePassword
              currentPassword={currentPassword}
              newPassword={newPassword}
              repeatPassword={repeatPassword}
              setCurrentPassword={
                setCurrentPassword
              }
              setNewPassword={setNewPassword}
              setRepeatPassword={
                setRepeatPassword
              }
              showCurrentPassword={
                showCurrentPassword
              }
              showNewPassword={
                showNewPassword
              }
              showRepeatPassword={
                showRepeatPassword
              }
              setShowCurrentPassword={
                setShowCurrentPassword
              }
              setShowNewPassword={
                setShowNewPassword
              }
              setShowRepeatPassword={
                setShowRepeatPassword
              }
              isChangingPassword={
                isChangingPassword
              }
              onChangePassword={
                handleChangePassword
              }
            />
          </div>

          <ProfileUpdate
            firstName={firstName}
            lastName={lastName}
            phone={phone}
            avatar={avatar}
            email={admin?.email}
            profileName={profileName}
            initials={initials}
            isEditing={isEditing}
            isSaving={isSaving}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setPhone={setPhone}
            setIsEditing={setIsEditing}
            setAvatar={setAvatar}
            onAvatarChange={handleAvatarChange}
            onSave={handleSaveProfile}
            onCancel={cancelEditing}
          />
        </div>
      </section>
    </div>
  );
}
