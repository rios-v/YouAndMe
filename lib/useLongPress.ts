"use client";

import { useRef, useCallback } from "react";

export function useLongPress(onLongPress: () => void, onClick: () => void, delay = 600) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggered = useRef(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const MOVE_THRESHOLD = 10; // quanto pode "tremer" o dedo antes de considerar que é scroll

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    startPos.current = null;
  }, []);

  const start = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      triggered.current = false;

      if ("touches" in e) {
        const touch = e.touches[0];
        startPos.current = { x: touch.clientX, y: touch.clientY };
      }

      timerRef.current = setTimeout(() => {
        triggered.current = true;
        if (navigator.vibrate) navigator.vibrate(10);
        onLongPress();
      }, delay);
    },
    [onLongPress, delay]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!startPos.current) return;

      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - startPos.current.x);
      const deltaY = Math.abs(touch.clientY - startPos.current.y);

      // se moveu mais que o threshold em qualquer eixo, cancela, era scroll, não long-press
      if (deltaX > MOVE_THRESHOLD || deltaY > MOVE_THRESHOLD) {
        clear();
      }
    },
    [clear]
  );

  const handleClick = useCallback(() => {
    if (!triggered.current) onClick();
  }, [onClick]);

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchMove: handleTouchMove,
    onTouchEnd: clear,
    onClick: handleClick,
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      onLongPress();
    },
  };
}