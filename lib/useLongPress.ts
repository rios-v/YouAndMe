"use client";

import { useRef, useCallback } from "react";

export function useLongPress(onLongPress: () => void, onClick: () => void, delay = 800) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggered = useRef(false);

  const start = useCallback(() => {
    triggered.current = false;
    timerRef.current = setTimeout(() => {
      triggered.current = true;
      if (navigator.vibrate) navigator.vibrate(10);
      onLongPress();
    }, delay);
  }, [onLongPress, delay]);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleClick = useCallback(() => {
    if (!triggered.current) onClick();
  }, [onClick]);

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
    onClick: handleClick,
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      onLongPress();
    },
  };
}