import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import { message } from "antd";

import { useAuth } from "../../../context/AuthContext";

import {
  changeAdminPassword,
  updateAdminProfile,
} from "../../../api/authApi";

const API_BASE_URL =
  "https://oline-shop-backend.onrender.com";

export default function useAdminProfile() {
  const {
    admin,
    refreshAdmin,
  } = useAuth();

  // =========================
  // PROFILE EDIT
  // =========================

  const [isEditing, setIsEditing] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isChangingPassword, setIsChangingPassword] =
    useState(false);

  // =========================
  // PROFILE DATA
  // =========================

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [avatar, setAvatar] =
    useState("");

  // =========================
  // PASSWORD
  // =========================

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [repeatPassword, setRepeatPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showRepeatPassword, setShowRepeatPassword] =
    useState(false);

  // =========================
  // BACKEND -> FORM
  // =========================

  useEffect(() => {
    if (!admin) {
      return;
    }

    setFirstName(admin.firstName ?? "");
    setLastName(admin.lastName ?? "");
    setPhone(admin.phone ?? "");

    const backendAvatar = admin.avatar ?? "";

    if (
      backendAvatar &&
      backendAvatar.startsWith("/")
    ) {
      setAvatar(
        `${API_BASE_URL}${backendAvatar}`
      );
    } else {
      setAvatar(backendAvatar);
    }
  }, [admin]);

  // =========================
  // AVATAR UPLOAD
  // =========================

  const handleAvatarChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // Fayl turi
    if (!file.type.startsWith("image/")) {
      message.error(
        "Faqat rasm faylini tanlang"
      );

      event.target.value = "";
      return;
    }

    // Fayl hajmi
    if (file.size > 5 * 1024 * 1024) {
      message.error(
        "Rasm hajmi 5 MB dan oshmasin"
      );

      event.target.value = "";
      return;
    }

    try {
      message.loading({
        content: "Rasm yuklanmoqda...",
        key: "avatar-upload",
      });

      // =========================
      // FORM DATA
      // =========================

      const formData = new FormData();

      formData.append("file", file);

      // =========================
      // ACCESS TOKEN
      // =========================

      const accessToken =
        localStorage.getItem(
          "crmAccessToken"
        );

      if (!accessToken) {
        throw new Error(
          "Access token topilmadi. Iltimos, qayta login qiling."
        );
      }

      // =========================
      // UPLOAD API
      // =========================

      const response = await fetch(
        `${API_BASE_URL}/api/admin/uploads`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },

          body: formData,
        }
      );

      // =========================
      // RESPONSE
      // =========================

      const result =
        await response.json();

      console.log(
        "AVATAR UPLOAD RESPONSE:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            `Rasm yuklanmadi: ${response.status}`
        );
      }

      const uploadedUrl =
        result?.data?.url;

      if (!uploadedUrl) {
        throw new Error(
          "Backend rasm URL manzilini qaytarmadi."
        );
      }

      // Backend relative URL qaytaradi:
      //
      // /uploads/misc/xxxxx.png
      //
      // Frontendda esa to'liq URL kerak.

      const fullAvatarUrl =
        uploadedUrl.startsWith("http")
          ? uploadedUrl
          : `${API_BASE_URL}${uploadedUrl}`;

      console.log(
        "AVATAR URL:",
        fullAvatarUrl
      );

      // State'ga backenddagi tayyor URLni saqlaymiz
      setAvatar(fullAvatarUrl);

      message.success({
        content:
          "Rasm muvaffaqiyatli yuklandi",
        key: "avatar-upload",
      });
    } catch (error) {
      console.error(
        "AVATAR UPLOAD ERROR:",
        error
      );

      message.error({
        content:
          error instanceof Error
            ? error.message
            : "Rasm yuklanmadi",
        key: "avatar-upload",
      });
    } finally {
      // Bir xil rasmni yana tanlashga imkon beradi
      event.target.value = "";
    }
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSaveProfile =
    async () => {
      const cleanFirstName =
        firstName.trim();

      const cleanLastName =
        lastName.trim();

      const cleanPhone =
        phone.trim();

      if (!cleanFirstName) {
        message.error(
          "First Name kiriting"
        );

        return;
      }

      if (!cleanLastName) {
        message.error(
          "Last Name kiriting"
        );

        return;
      }

      if (!cleanPhone) {
        message.error(
          "Phone Number kiriting"
        );

        return;
      }

      try {
        setIsSaving(true);

        console.log(
          "PROFILE UPDATE DATA:",
          {
            firstName:
              cleanFirstName,

            lastName:
              cleanLastName,

            phone:
              cleanPhone,

            avatar,
          }
        );

        await updateAdminProfile({
          firstName:
            cleanFirstName,

          lastName:
            cleanLastName,

          phone:
            cleanPhone,

          avatar:
            avatar || "",
        });

        // Backenddan yangi profile olish
        await refreshAdmin();

        message.success(
          "Profile muvaffaqiyatli yangilandi"
        );

        setIsEditing(false);
      } catch (error) {
        console.error(
          "PROFILE UPDATE ERROR:",
          error
        );

        message.error(
          error instanceof Error
            ? error.message
            : "Profile yangilanmadi"
        );
      } finally {
        setIsSaving(false);
      }
    };

  // =========================
  // CANCEL
  // =========================

  const cancelEditing = () => {
    setFirstName(
      admin?.firstName ?? ""
    );

    setLastName(
      admin?.lastName ?? ""
    );

    setPhone(
      admin?.phone ?? ""
    );

    const backendAvatar =
      admin?.avatar ?? "";

    if (
      backendAvatar &&
      backendAvatar.startsWith("/")
    ) {
      setAvatar(
        `${API_BASE_URL}${backendAvatar}`
      );
    } else {
      setAvatar(backendAvatar);
    }

    setIsEditing(false);
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleChangePassword =
    async () => {
      if (!currentPassword) {
        message.error(
          "Current Password kiriting"
        );

        return;
      }

      if (!newPassword) {
        message.error(
          "New Password kiriting"
        );

        return;
      }

      if (newPassword.length < 6) {
        message.error(
          "Yangi parol kamida 6 ta belgidan iborat bo‘lsin"
        );

        return;
      }

      if (
        newPassword !==
        repeatPassword
      ) {
        message.error(
          "Yangi parollar bir xil emas"
        );

        return;
      }

      try {
        setIsChangingPassword(true);

        await changeAdminPassword({
          currentPassword,
          newPassword,
        });

        setCurrentPassword("");
        setNewPassword("");
        setRepeatPassword("");

        message.success(
          "Password muvaffaqiyatli o‘zgartirildi"
        );
      } catch (error) {
        console.error(
          "PASSWORD ERROR:",
          error
        );

        message.error(
          error instanceof Error
            ? error.message
            : "Password o‘zgartirilmadi"
        );
      } finally {
        setIsChangingPassword(false);
      }
    };

  // =========================
  // COPY EMAIL
  // =========================

  const copyEmail = async () => {
    if (!admin?.email) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        admin.email
      );

      message.success(
        "Email nusxalandi"
      );
    } catch (error) {
      console.error(error);

      message.error(
        "Email nusxalanmadi"
      );
    }
  };

  // =========================
  // DISPLAY NAME
  // =========================

  const profileName =
    `${admin?.firstName ?? ""} ${
      admin?.lastName ?? ""
    }`.trim() || "Admin";

  // =========================
  // INITIALS
  // =========================

  const initials =
    `${admin?.firstName?.[0] ?? ""}${
      admin?.lastName?.[0] ?? ""
    }`.toUpperCase() || "A";

  // =========================
  // RETURN
  // =========================

  return {
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
  };
}