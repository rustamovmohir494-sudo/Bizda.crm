import { useCallback, useState } from "react";

export default function useLoading() {
  const [loading, setLoading] = useState(false);

  const runWithLoading = useCallback(
    async <T,>(callback: () => Promise<T>): Promise<T> => {
      try {
        setLoading(true);
        return await callback();
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    runWithLoading,
  };
}