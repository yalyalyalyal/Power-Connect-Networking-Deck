import { motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import type { Profile } from "@/lib/profiles";
import { ProfileDetail } from "./ProfileDetail";

const SWIPE_THRESHOLD = 110;

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

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) onSwipe("right");
    else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe("left");
  };

  const scale = 1 - stackIndex * 0.04;
  const y = stackIndex * 10;

  return (
    <motion.div
      className="absolute inset-0 select-none"
      style={{ x, rotate, zIndex: 50 - stackIndex, touchAction: isTop ? "pan-y" : "none" }}
      initial={{ scale, y, opacity: stackIndex > 2 ? 0 : 1 }}
      animate={{ scale, y, opacity: stackIndex > 2 ? 0 : 1 }}
      drag={isTop ? "x" : false}
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border/60 bg-card card-shadow">
        <div className="h-full overflow-y-auto no-scrollbar" style={{ touchAction: "pan-y" }}>
          <ProfileDetail profile={profile} />
        </div>

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
