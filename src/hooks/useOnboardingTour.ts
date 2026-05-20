import { useEffect, useRef } from "react";
import { driver, type Driver } from "driver.js";
import "driver.js/dist/driver.css";

const STORAGE_PREFIX = "etw-onboarded:";

function waitForEl(selector: string, timeout = 2000): Promise<Element | null> {
  return new Promise((resolve) => {
    const found = document.querySelector(selector);
    if (found) return resolve(found);
    const start = Date.now();
    const interval = window.setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        window.clearInterval(interval);
        resolve(el);
      } else if (Date.now() - start > timeout) {
        window.clearInterval(interval);
        resolve(null);
      }
    }, 80);
  });
}

export function useOnboardingTour({
  userId,
  ready,
  hasDeck,
}: {
  userId: string | null | undefined;
  ready: boolean;
  hasDeck: boolean;
}) {
  const startedRef = useRef(false);
  const driverRef = useRef<Driver | null>(null);

  useEffect(() => {
    if (!userId || !ready || !hasDeck || startedRef.current) return;
    const key = `${STORAGE_PREFIX}${userId}`;
    if (localStorage.getItem(key) === "1") return;
    startedRef.current = true;

    const start = async () => {
      // Make sure the first card is mounted
      await waitForEl('[data-tour="deck"]');

      const d = driver({
        showProgress: true,
        allowClose: true,
        overlayOpacity: 0.7,
        stagePadding: 6,
        stageRadius: 16,
        popoverClass: "etw-tour",
        nextBtnText: "Next →",
        prevBtnText: "← Back",
        doneBtnText: "Got it",
        steps: [
          {
            popover: {
              title: "Welcome to POWER CONNECT 👋",
              description:
                "A quick 60-second tour of how to find and save the right people at Energy Tech Week 2026.",
            },
          },
          {
            element: '[data-tour="deck"]',
            popover: {
              title: "Swipe through the deck",
              description:
                "Each card is an attendee. Swipe <b>right to save</b>, <b>left to pass</b>. You can drag from anywhere on the card.",
              side: "bottom",
              align: "center",
            },
          },
          {
            element: '[data-tour="actions"]',
            popover: {
              title: "Or use the buttons",
              description:
                "Prefer tapping? Use <b>Pass</b>, <b>Undo</b>, and <b>Save</b>. Undo brings back your last action.",
              side: "top",
              align: "center",
            },
          },
          {
            element: '[data-tour="search"]',
            popover: {
              title: "Search by name or company",
              description: "Looking for someone specific? Just type their name or company here.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: '[data-tour="filters"]',
            popover: {
              title: "Filter the deck",
              description:
                "Narrow the deck down by <b>company type</b> and <b>department</b> to focus your time.",
              side: "bottom",
              align: "end",
            },
          },
          {
            element: '[data-tour="nav-saved"]',
            popover: {
              title: "Your saved network",
              description:
                "Everyone you swipe right on lands here. Tap a profile to see details and connect on LinkedIn.",
              side: "top",
              align: "center",
            },
          },
          {
            element: '[data-tour="nav-settings"]',
            popover: {
              title: "Settings",
              description:
                "Export your network, reset passed profiles, or sign out — all from here.",
              side: "top",
              align: "center",
            },
          },
          {
            popover: {
              title: "You're ready ⚡",
              description: "Start swiping and build your network with POWER CONNECT.",
            },
          },
        ],
        onDestroyed: () => {
          localStorage.setItem(key, "1");
        },
      });

      driverRef.current = d;
      d.drive();
    };

    // Slight delay so layout settles
    const t = window.setTimeout(start, 350);
    return () => {
      window.clearTimeout(t);
      driverRef.current?.destroy();
    };
  }, [userId, ready, hasDeck]);
}
