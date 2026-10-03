
import { useEffect, useState } from "react";

const API_BASE_URL =
  "https://oline-shop-backend.onrender.com";

export default function useAvatarImage(
  avatar: string,
) {
  const [imageUrl, setImageUrl] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  useEffect(() => {
    let objectUrl = "";

    const loadImage = async () => {
      if (!avatar) {
        setImageUrl("");
        return;
      }

      // Local/base64 image
      if (
        avatar.startsWith("data:") ||
        avatar.startsWith("blob:")
      ) {
        setImageUrl(avatar);
        return;
      }

      setIsLoading(true);

      try {
        const url = avatar.startsWith("http")
          ? avatar
          : `${API_BASE_URL}${avatar}`;

        const response =
          await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Avatar request failed: ${response.status}`,
          );
        }

        const blob =
          await response.blob();

        objectUrl =
          URL.createObjectURL(blob);

        setImageUrl(objectUrl);
      } catch (error) {
        console.error(
          "AVATAR LOAD ERROR:",
          error,
        );

        setImageUrl("");
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [avatar]);

  return {
    imageUrl,
    isLoading,
  };
}

