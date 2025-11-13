"use client";

import React, { useState } from "react";
import IntegrationsModal from "./IntegrationsModal";

const IntegrationToggleButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Integrations"
        className="flex items-center justify-center rounded-full bg-[#5EA68E] p-2.5 shadow hover:bg-[#4F937D] active:scale-95 transition
                   dark:bg-[#5EA68E] dark:hover:bg-[#4F937D]"
      >
        {/* Integration Icon (two interlocking nodes) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17 3a4 4 0 0 0-3.465 6H10a4 4 0 0 0 0 8h3.535A4 4 0 1 0 17 3Zm-3.465 8A4 4 0 0 1 17 17a4 4 0 0 1-3.465-6H10a2 2 0 1 1 0-4h3.535Z" />
        </svg>
      </button>

      <IntegrationsModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default IntegrationToggleButton;
