"use client";

import { ArrowLeft } from "lucide-react";
import { memo } from "react";

const ButtonHistoryBack = () => {
  return (
    <button onClick={() => history.back()} className="btn-options">
      <ArrowLeft size={16} />
    </button>
  );
};

export default memo(ButtonHistoryBack);
