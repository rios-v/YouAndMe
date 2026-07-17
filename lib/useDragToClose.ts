"use client";

import { useDragControls, type PanInfo } from "framer-motion";

interface UseDragToCloseOptions {
  onClose: () => void;
  /** distância mínima (px) para considerar que deve fechar */
  threshold?: number;
  /** velocidade mínima (px/s) para considerar que deve fechar mesmo com pouco offset */
  velocityThreshold?: number;
}

export function useDragToClose({
  onClose,
  threshold = 120,
  velocityThreshold = 500,
}: UseDragToCloseOptions) {
  const dragControls = useDragControls();

  const handleProps = {
    onPointerDown: (e: React.PointerEvent) => dragControls.start(e),
    style: { touchAction: "none" as const, cursor: "grab" as const },
  };

  const panelProps = {
    drag: "y" as const,
    dragControls,
    dragListener: false,
    dragConstraints: { top: 0, bottom: 0 },
    dragElastic: { top: 0, bottom: 0.5 },
    onDragEnd: (_: unknown, info: PanInfo) => {
      if (info.offset.y > threshold || info.velocity.y > velocityThreshold) {
        onClose();
      }
    },
  };

  return { handleProps, panelProps };
}