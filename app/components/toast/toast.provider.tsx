import { useSyncExternalStore } from "react";
import { toastStore } from "./toast.store";
import { AnimatePresence } from "framer-motion";

import { motion } from "framer-motion";

export const ToastProvider = (props: any) => {
  const state = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getState,
    toastStore.getState
  );

  const position = "bottom";

  const toasts = state[position];

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label={`Notifications-${position}`}
      key={position}
      id={`chakra-toast-manager-${position}`}
      className="flex space-y-2 flex-col items-center justify-end pointer-events-none"
      style={{ position: "fixed", left: 0, right: 0, top: 0, bottom: 0 }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast: any) => (
          <motion.div
            className="bg-red-200 rounded font-semibold px-4 py-2 pointer-events-auto"
            key={toast.id}
            onClick={() => {
              alert("Clicked!");
            }}
            variants={{
              initial: (props) => {
                const position = "bottom";

                const dir = "bottom";

                let factor = ["top-right", "bottom-right"].includes(position)
                  ? 1
                  : -1;
                if (position === "bottom") factor = 1;

                return {
                  opacity: 0,
                  [dir]: factor * 24
                };
              },
              animate: {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                transition: {
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1]
                }
              },
              exit: {
                opacity: 0,
                scale: 0.85,
                transition: {
                  duration: 0.2,
                  ease: [0.4, 0, 1, 1]
                }
              }
            }}
            layout
            initial="initial"
            animate="animate"
            exit="exit"
            // onHoverStart={onMouseEnter}
            // onHoverEnd={onMouseLeave}
            // custom={{ position }}
            // style={toastStyle}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
