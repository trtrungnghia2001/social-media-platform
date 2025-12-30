"use client";

import { X } from "lucide-react";
import React, { memo, useEffect } from "react";
import { createPortal } from "react-dom";

type ModalType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
};

const Modal = ({ open, setOpen, title, children }: ModalType) => {
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 h-screen w-screen p-4 flex items-center justify-center">
      <div
        className="absolute top-0 left-0 right-0 bottom-0 -z-10 bg-black/50"
        onClick={handleClose}
      ></div>
      <div className="max-w-xl w-full bg-background p-4 rounded-lg max-h-full overflow-y-auto scrollbar-beauty">
        <div className="relative flex items-center gap-4 mb-4 justify-between">
          <h3>{title}</h3>
          <button onClick={handleClose} className="btn-options">
            <X size={16} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default memo(Modal);
