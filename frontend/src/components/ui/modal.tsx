import { AnimatePresence, motion } from "framer-motion";
import type { PropsWithChildren, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ModalProps = PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  footer?: ReactNode;
}>;

export const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
}: ModalProps) => (
  <AnimatePresence>
    {open ? (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => onOpenChange(false)}
      >
        <motion.div
          initial={{ y: 28, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 12, opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-2xl"
        >
          <Card className="overflow-hidden border-border/80 bg-card/95">
            <div className="flex items-start justify-between gap-4 border-b border-border/70 p-6">
              <div>
                {title ? (
                  <h3 className="text-lg font-semibold">{title}</h3>
                ) : null}
                {description ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                aria-label="Close modal"
              >
                ×
              </Button>
            </div>
            <div className="p-6">{children}</div>
            {footer ? (
              <div className="flex justify-end gap-3 border-t border-border/70 p-6">
                {footer}
              </div>
            ) : null}
          </Card>
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);
