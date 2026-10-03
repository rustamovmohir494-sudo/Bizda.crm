import { useEffect, useState } from "react";

export function useAnimatedNumber(
  target: number,
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!Number.isFinite(target)) {
      setValue(0);
      return;
    }

    if (target === 0) {
      setValue(0);
      return;
    }

    const absoluteTarget = Math.abs(target);

    const duration = Math.max(
      700,
      Math.min(
        3000,
        3000 -
          Math.log10(
            absoluteTarget + 1,
          ) *
            100,
      ),
    );

    let animationFrame = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1,
      );

      const easeOut =
        1 - Math.pow(1 - progress, 3);

      const currentValue =
        target * easeOut;

      setValue(
        Math.round(currentValue),
      );

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animate);
      }
    };

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [target]);

  return value;
}