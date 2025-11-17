// "use client";

// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { StepBadge } from "@/components/common/StepBadge";
// import { FaCheck } from "react-icons/fa";

// type Provider = "amazon" | "shopify";

// type Props = {
//   open: boolean;
//   onClose: () => void;
// };

// const options: { key: Provider; title: string; icon: string }[] = [
//   { key: "amazon", title: "Amazon Integration", icon: "/amazon.png" },
//   { key: "shopify", title: "Shopify Integration", icon: "/shopify.png" },
// ];

// const IntegrationsModal: React.FC<Props> = ({ open, onClose }) => {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!open || !mounted) return null;

//   const handleChoose = (key: Provider) => {
//     window.dispatchEvent(
//       new CustomEvent("integration:choose", {
//         detail: { provider: key, origin: "header" },
//       })
//     );
//     onClose();
//   };

//   // You can wire these from props/state later if needed
//   const locked = false;
//   const completed = false;

//   const containerCls = locked
//     ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
//     : completed
//     ? "bg-[#5EA68E26] border-[#5EA68E]"
//     : "bg-white border-[#5EA68E] hover:bg-gray-50";

//   const modalContent = (
//     <div
//       className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
//       role="dialog"
//       aria-modal="true"
//     >
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal box */}
//       <div className="relative z-10 w-full max-w-lg rounded-xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
//         {/* Modal header */}
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
//             Integrations
//           </h2>
//           <button
//             onClick={onClose}
//             className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
//             aria-label="Close"
//           >
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//               <path
//                 d="M6 6l12 12M18 6L6 18"
//                 stroke="currentColor"
//                 strokeWidth="1.6"
//                 strokeLinecap="round"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* Inlined Step 2 block */}
//         <div className={`mb-4 rounded-md border p-4 transition-all ${containerCls}`}>
//           <div className="mb-3 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <StepBadge completed={completed} label={2} />
//               <h3
//                 className={`text-sm font-semibold sm:text-base ${
//                   locked ? "text-gray-500" : "text-[#5EA68E]"
//                 }`}
//               >
//                 Select Your Integration Method
//               </h3>
//             </div>

//             {locked ? (
//               <i className="fa-solid fa-lock text-xs text-gray-500" />
//             ) : completed ? (
//               <span className="flex items-center gap-1 rounded-full bg-[#5EA68E] px-3 py-1 text-[10px] font-semibold text-white">
//                 <FaCheck className="h-3 w-3" /> Completed
//               </span>
//             ) : (
//               <img src="/Favicon.png" alt="icon" className="h-5 sm:h-6" />
//             )}
//           </div>

//           <div className="ml-8 flex gap-5">
//             {options.map((opt) => (
//               <button
//                 key={opt.key}
//                 type="button"
//                 disabled={locked}
//                 onClick={() => !locked && handleChoose(opt.key)}
//                 title={opt.title}
//                 aria-label={opt.title}
//                 className={`flex aspect-square w-14 items-center justify-center rounded-md border border-[#5EA68E]
//                   ${locked ? "cursor-not-allowed opacity-60" : "hover:bg-emerald-50"}`}
//               >
//                 <img
//                   src={opt.icon}
//                   alt={opt.title}
//                   className="h-7 w-7 object-contain"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>
//         {/* /Inlined Step 2 block */}
//       </div>
//     </div>
//   );

//   return createPortal(modalContent, document.body);
// };

// export default IntegrationsModal;





















"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Provider = "amazon" | "shopify";

type Props = {
  open: boolean;
  onClose: () => void;
};

const options: { key: Provider; title: string; icon: string }[] = [
  { key: "amazon", title: "Amazon ", icon: "/amazon.png" },
  { key: "shopify", title: "Shopify ", icon: "/shopify.png" },
];

const IntegrationsModal: React.FC<Props> = ({ open, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  const handleChoose = (key: Provider) => {
    window.dispatchEvent(
      new CustomEvent("integration:choose", {
        detail: { provider: key, origin: "header" },
      })
    );
    onClose();
  };

  const locked = false;

  const containerCls = locked
    ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
    : "bg-white border-[#5EA68E] hover:bg-gray-50";

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        {/* Modal header */}
      <div className="mb-4 relative flex items-center justify-center">
  <h2 className="text-xl font-semibold text-charcoal-500 dark:text-gray-100">
    Select Your Integration
  </h2>

  <button
    onClick={onClose}
    className="absolute right-0 rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
    aria-label="Close"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  </button>
</div>


        {/* Integration selection block */}
     <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
  {options.map((opt) => (
    <button
      key={opt.key}
      type="button"
      disabled={locked}
      onClick={() => !locked && handleChoose(opt.key)}
      title={opt.title}
      aria-label={opt.title}
      className={`flex flex-col items-center justify-center 
        w-36 h-36 sm:w-40 sm:h-40
        rounded-2xl border border-[#5EA68E] bg-white
        transition-all 
        ${locked ? "cursor-not-allowed opacity-60" : "hover:bg-emerald-50 hover:scale-105"}`}
    >
      <img
        src={opt.icon}
        alt={opt.title}
        className="h-16 w-16 sm:h-20 sm:w-20 object-contain mb-3"
      />
      <span className="text-sm sm:text-base font-semibold text-charcoal-500 whitespace-nowrap">
        {opt.title}
      </span>
    </button>
  ))}
</div>


      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default IntegrationsModal;
