"use client";

import { useEffect, useState, useCallback } from "react";

type Section = "letters" | "timeline";

function getLastSeenKey(section: Section) {
  return `lastSeenId:${section}`;
}

export function markSectionAsSeen(section: Section, latestId: number) {
  localStorage.setItem(getLastSeenKey(section), String(latestId));
}

function getLastSeenId(section: Section): number {
  const stored = localStorage.getItem(getLastSeenKey(section));
  return stored ? Number(stored) : 0;
}

export function useUnreadBadge() {
  const [unread, setUnread] = useState<{ letters: boolean; timeline: boolean }>({
    letters: false,
    timeline: false,
  });

  const checkUnread = useCallback(async () => {
    try {
      const [lettersRes, timelineRes] = await Promise.all([
        fetch("/api/letters"),
        fetch("/api/timeline"),
      ]);

      const letters = await lettersRes.json();
      const timeline = await timelineRes.json();

      const latestLetterId = letters.length > 0
        ? Math.max(...letters.map((l: { id: number }) => l.id))
        : 0;
      const latestTimelineId = timeline.length > 0
        ? Math.max(...timeline.map((t: { id: number }) => t.id))
        : 0;

      setUnread({
        letters: latestLetterId > getLastSeenId("letters"),
        timeline: latestTimelineId > getLastSeenId("timeline"),
      });
    } catch (error) {
      console.error("Error checking unread items:", error);
    }
  }, []);

  useEffect(() => {
    checkUnread();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkUnread();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const interval = setInterval(checkUnread, 30000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(interval);
    };
  }, [checkUnread]);

  return unread;
}