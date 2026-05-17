import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useRef } from "react";
import type { Profile } from "@/lib/profiles";
import { ProfileDetail } from "./ProfileDetail";

const SWIPE_THRESHOLD = 110;
const DIRECTION_LOCK_PX = 6;

export function SwipeCard({
  profile,
  onSwipe,
  isTop,
  stackIndex,
}: {
  profile: Profile;
  onSwipe: (dir: "left" | "right") => void;
  isTop: boolean;
  stackIndex: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [40, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -40], [1, 0]);

  const startRef = useRef<{ x: number; y: number } | null>(null);
  const lockedRef = useRef<"horizontal" | "vertical" | null>(null);
  const activePointerRef = useRef<number | null>(null);

  const reset = () => {
    startRef.current = null;
    lockedRef.current = null;
    activePointerRef.current = null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isTop) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    lockedRef.current = null;
    activePointerRef.current = e.pointerId;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isTop || !startRef.current) return;
    if (activePointerRef.current !== e.pointerId) return;

    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;

    if (!lockedRef.current) {
      if (Math.abs(dx) < DIRECTION_LOCK_PX && Math.abs(dy) < DIRECTION_LOCK_PX) return;
      lockedRef.current = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
      if (lockedRef.current === "horizontal") {
        // Capture pointer so we keep getting events even if the browser tries to scroll
        (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      }
    }

    if (lockedRef.current === "horizontal") {
      e.preventDefault();
      x.set(dx);
    }
  };

  const finish = (e: React.PointerEvent) => {
    if (!isTop) return;
    if (activePointerRef.current !== e.pointerId) return;
    const wasHorizontal = lockedRef.current === "horizontal";
    reset();
    if (!wasHorizontal) return;

    const current = x.get();
    if (current > SWIPE_THRESHOLD) {
      onSwipe("right");
    } else if (current < -SWIPE_THRESHOLD) {
      onSwipe("left");
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
    }
  };

  const scale = 1 - stackIndex * 0.04;
  const y = stackIndex * 10;

  return (
    <motion.div
      className="absolute inset-0 select-none"
      style={{ x, rotate, zIndex: 50 - stackIndex, touchAction: isTop ? "pan-y" : "none" }}
      initial={{ scale, y, opacity: stackIndex > 2 ? 0 : 1 }}
      animate={{ scale, y, opacity: stackIndex > 2 ? 0 : 1 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finish}
      onPointerCancel={finish}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border/60 bg-card card-shadow">
        <ProfileDetail profile={profile} variant="card" />

        {isTop && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="pointer-events-none absolute top-8 left-6 rotate-[-12deg] rounded-xl border-4 border-primary bg-primary/20 px-4 py-1 text-xl font-extrabold uppercase tracking-widest text-primary text-glow"
            >
              Save
            </motion.div>
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="pointer-events-none absolute top-8 right-6 rotate-[12deg] rounded-xl border-4 border-destructive bg-destructive/20 px-4 py-1 text-xl font-extrabold uppercase tracking-widest text-destructive"
            >
              Pass
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
