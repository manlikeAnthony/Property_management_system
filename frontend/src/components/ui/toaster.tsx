import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { create } from "zustand";
import { Button } from "@/components/ui/button";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
};

type ToastState = {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
  clear: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    window.setTimeout(
      () =>
        set((state) => ({
          toasts: state.toasts.filter((item) => item.id !== id),
        })),
      4000,
    );
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, type: "success" }),
  error: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, type: "error" }),
  info: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, type: "info" }),
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  if (type === "success")
    return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
  if (type === "error")
    return <AlertCircle className="h-5 w-5 text-rose-500" />;
  return <AlertCircle className="h-5 w-5 text-sky-500" />;
};

export const Toaster = () => {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div className="fixed right-4 top-4 z-[60] flex w-[min(100vw-2rem,24rem)] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            className="rounded-2xl border border-border/70 bg-card/95 p-4 shadow-glow backdrop-blur"
          >
            <div className="flex gap-3">
              <ToastIcon type={item.type} />
              <div className="flex-1 space-y-1">
                <p className="font-medium">{item.title}</p>
                {item.description ? (
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => dismiss(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
