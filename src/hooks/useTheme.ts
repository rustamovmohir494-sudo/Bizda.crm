import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const THEME_KEY = "dealport-theme";

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem(
    THEME_KEY,
  );

  if (
    savedTheme === "light" ||
    savedTheme === "dark"
  ) {
    return savedTheme;
  }

  return "light";
}

export function useTheme() {
  const [theme, setTheme] =
    useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

    localStorage.setItem(
      THEME_KEY,
      theme,
    );
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "light"
        ? "dark"
        : "light",
    );
  }

  return {
    theme,
    setTheme,
    toggleTheme,
  };
}