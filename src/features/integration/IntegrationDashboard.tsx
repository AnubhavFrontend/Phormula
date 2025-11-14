// // // // // IntegrationDashboard.tsx (only the changed bits)

// // // // "use client";

// // // // import React, { useMemo, useState, useEffect } from "react";
// // // // import { useParams } from "next/navigation";
// // // // import { useMediaQuery } from "react-responsive";

// // // // import { useIntegrationProgress, LS_KEYS } from "./useIntegrationProgress";

// // // // import { Step1ProductList } from "./steps/Step1ProductList";
// // // // import { Step2Integration } from "./steps/Step2Integration";
// // // // import { Step3FeePreview } from "./steps/Step3FeePreview";
// // // // import { Step4MTD } from "./steps/Step4MTD";

// // // // import SkuMultiCountryUpload from "@/components/ui/modal/SkuMultiCountryUpload";
// // // // import FeepreviewUpload from "@/components/ui/modal/FeepreviewUpload";

// // // // import AmazonConnect from "./AmazonConnect";
// // // // import { Modal } from "@/components/ui/modal";
// // // // import FileUploadForm from "@/app/(admin)/(ui-elements)/modals/FileUploadForm";
// // // // import ConnectShopifyModal from "./ConnectShopifyModal";

// // // // export default function IntegrationDashboard() {
// // // //   const { countryName } = useParams<{ countryName: string }>();
// // // //   const selectedCountry = (countryName || "").toLowerCase();

// // // //   const {
// // // //     fileUploaded,
// // // //     profileExists,
// // // //     integrationMethod,
// // // //     setIntegrationMethod,
// // // //     amazonConnected,
// // // //     mtdUploaded,
// // // //     setMtdUploaded,
// // // //   } = useIntegrationProgress(selectedCountry);

// // // //   const [activePopup, setActivePopup] = useState<number | null>(null);
// // // //   const [showAmazonConnect, setShowAmazonConnect] = useState(false);
// // // //   const [showShopifyConnect, setShowShopifyConnect] = useState(false);
// // // //   const [fileUploadedLocal, setFileUploadedLocal] = useState(false);

// // // //   // NEW: which country was clicked in Step 4
// // // //   const [mtdCountry, setMtdCountry] = useState<string>("");

// // // //   const isMobile = useMediaQuery({ maxWidth: 768 });

// // // //   useEffect(() => {
// // // //     if (localStorage.getItem("fileUploaded") === "true") {
// // // //       setFileUploadedLocal(true);
// // // //     }
// // // //   }, []);

// // // //   const steps = useMemo(() => {
// // // //     const step1Done = fileUploaded || fileUploadedLocal;

// // // //     const manual = [
// // // //       { id: 1, completed: step1Done, enabled: true, action: () => setActivePopup(1) },
// // // //       { id: 2, completed: !!integrationMethod, enabled: step1Done },
// // // //       { id: 3, completed: profileExists, enabled: !!integrationMethod, action: () => setActivePopup(2) },
// // // //       { id: 4, completed: mtdUploaded, enabled: profileExists, action: () => setActivePopup(3) },
// // // //     ];
// // // //     const amazon = [
// // // //       { id: 1, completed: step1Done, enabled: true, action: () => setActivePopup(1) },
// // // //       { id: 2, completed: !!integrationMethod && amazonConnected, enabled: step1Done },
// // // //       { id: 3, completed: mtdUploaded, enabled: !!integrationMethod && amazonConnected, action: () => setActivePopup(3) },
// // // //     ];
// // // //     return integrationMethod === "amazon" ? amazon : manual;
// // // //   }, [integrationMethod, amazonConnected, fileUploaded, fileUploadedLocal, profileExists, mtdUploaded]);

// // // //   const chooseIntegration = (key: "amazon" | "shopify") => {
// // // //     setIntegrationMethod(key);
// // // //     localStorage.setItem(LS_KEYS.integrationMethod, key);
// // // //     setActivePopup(null);
// // // //     if (key === "amazon") setShowAmazonConnect(true);
// // // //     if (key === "shopify") setShowShopifyConnect(true);
// // // //   };

// // // //   return (
// // // //     <div className="font-lato bg-white box-border">
// // // //       <h2 className="text-[#414042] font-semibold text-lg md:text-xl mb-4">
// // // //         Start your Journey with Phormula!
// // // //       </h2>

// // // //       <Step1ProductList
// // // //         completed={steps[0].completed}
// // // //         onOpen={() => steps[0].enabled && steps[0].action?.()}
// // // //       />

// // // //       <Step2Integration
// // // //         locked={!steps[1].enabled}
// // // //         completed={steps[1].completed}
// // // //         onChoose={chooseIntegration}
// // // //       />

// // // //       {integrationMethod === "manual" && (
// // // //         <>
// // // //           <Step3FeePreview
// // // //             enabled={steps[2].enabled}
// // // //             completed={steps[2].completed}
// // // //             onOpen={() => steps[2].enabled && steps[2].action?.()}
// // // //           />

// // // //           {/* IMPORTANT: pass selectedCountry and capture which button was clicked */}
// // // //           <Step4MTD
// // // //             enabled={steps[3]?.enabled}
// // // //             completed={steps[3]?.completed}
// // // //             selectedCountry={selectedCountry}
// // // //             onOpenForCountry={(code) => {
// // // //               // only allow current country, Step4 already guards that, but be explicit:
// // // //               if (code !== selectedCountry) return;
// // // //               setMtdCountry(code);       // << remember which country was clicked
// // // //               setActivePopup(3);         // open modal
// // // //             }}
// // // //           />
// // // //         </>
// // // //       )}

// // // //       {/* Step 1 modal */}
// // // //       {activePopup === 1 && (
// // // //         <Modal
// // // //           isOpen
// // // //           onClose={() => setActivePopup(null)}
// // // //         className="m-4 max-w-[900px]"
// // // //           showCloseButton
// // // //         >
// // // //             <div className="relative w-full rounded-3xl bg-white p-4 no-scrollbar dark:bg-gray-900 lg:p-11">
// // // //           <SkuMultiCountryUpload
// // // //             onClose={() => setActivePopup(null)}
// // // //             onComplete={() => {
// // // //               setFileUploadedLocal(true);
// // // //               localStorage.setItem("fileUploaded", "true");
// // // //               window.dispatchEvent(new CustomEvent("inventory:productListUploaded"));
// // // //               setActivePopup(null);
// // // //             }}
// // // //           />
// // // //           </div>
// // // //         </Modal>
// // // //       )}

// // // //       {/* Step 3 modal (Fee Preview) */}
// // // //       {activePopup === 2 && (
// // // //         <Modal
// // // //           isOpen
// // // //           onClose={() => setActivePopup(null)}
// // // //           className="m-4 max-w-[800px]"
// // // //           showCloseButton
// // // //         >  <div className="relative w-full rounded-3xl bg-white p-4 no-scrollbar dark:bg-gray-900 lg:p-11">
// // // //           <FeepreviewUpload country={selectedCountry} onClose={() => setActivePopup(null)} />
// // // //              </div>
// // // //         </Modal>
// // // //       )}

// // // //       {/* Step 4 modal (MTD Upload) */}
// // // //       {activePopup === 3 && (
// // // //         <Modal
// // // //           isOpen
// // // //           onClose={() => setActivePopup(null)}
// // // //           className="m-4 max-w-3xl"
// // // //           showCloseButton
// // // //         >
// // // //           {/* PASS THE COUNTRY HERE */}
// // // //           <FileUploadForm
// // // //             initialCountry={mtdCountry || selectedCountry}
// // // //             onClose={() => {
// // // //               setActivePopup(null);
// // // //             }}
// // // //             onComplete={() => {
// // // //               // mark MTD step done
// // // //               setMtdUploaded(true);
// // // //               localStorage.setItem(LS_KEYS.mtdDone(selectedCountry), "true");
// // // //               setActivePopup(null);
// // // //             }}
// // // //           />
// // // //         </Modal>
// // // //       )}

// // // //       {/* Amazon connect modal */}
// // // //       {showAmazonConnect && (
// // // //         <Modal
// // // //           isOpen
// // // //           onClose={() => setShowAmazonConnect(false)}
// // // //           className="m-4 max-w-xl"
// // // //           showCloseButton
// // // //         >
// // // //           <AmazonConnect
// // // //             onClose={() => setShowAmazonConnect(false)}
// // // //             onConnected={(refreshToken?: string) => {
// // // //               localStorage.setItem("amazonRefreshToken", String(refreshToken ?? ""));
// // // //               setShowAmazonConnect(false);
// // // //             }}
// // // //             onChooseManual={() => {
// // // //               setShowAmazonConnect(false);
// // // //               setIntegrationMethod("manual");
// // // //               localStorage.setItem(LS_KEYS.integrationMethod, "manual");
// // // //             }}
// // // //           />
// // // //         </Modal>
// // // //       )}

// // // //       {showShopifyConnect && (
// // // //         <ConnectShopifyModal onClose={() => setShowShopifyConnect(false)} />
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }


























// // // // IntegrationDashboard.tsx

// // // "use client";

// // // import React, { useMemo, useState, useEffect } from "react";
// // // import { useParams } from "next/navigation";
// // // import { useMediaQuery } from "react-responsive";

// // // import { useIntegrationProgress, LS_KEYS } from "./useIntegrationProgress";

// // // import { Step1ProductList } from "./steps/Step1ProductList";
// // // import { Step2Integration } from "./steps/Step2Integration";
// // // import { Step3FeePreview } from "./steps/Step3FeePreview";
// // // import { Step4MTD } from "./steps/Step4MTD";

// // // import SkuMultiCountryUpload from "@/components/ui/modal/SkuMultiCountryUpload";
// // // import FeepreviewUpload from "@/components/ui/modal/FeepreviewUpload";

// // // import AmazonConnect from "./AmazonConnect";
// // // import AmazonConnectLegacy from "./AmazonConnectLegacy"; // ← NEW
// // // import { Modal } from "@/components/ui/modal";
// // // import FileUploadForm from "@/app/(admin)/(ui-elements)/modals/FileUploadForm";
// // // import ConnectShopifyModal from "./ConnectShopifyModal";
// // // import { Step3AmazonFinancial } from "./steps/Step3AmazonFinancial";
// // // import AmazonFinancialDashboard from "./AmazonFinancialDashboard";


// // // type Origin = "header" | "page";

// // // export default function IntegrationDashboard() {
// // //   const { countryName } = useParams<{ countryName: string }>();
// // //   const selectedCountry = (countryName || "").toLowerCase();

// // //   const {
// // //     fileUploaded,
// // //     profileExists,
// // //     integrationMethod,
// // //     setIntegrationMethod,
// // //     setAmazonConnected,
// // //     amazonConnected,
// // //     mtdUploaded,
// // //     setMtdUploaded,
// // //   } = useIntegrationProgress(selectedCountry);

// // //   const [activePopup, setActivePopup] = useState<number | null>(null);
// // //   const [showAmazonConnect, setShowAmazonConnect] = useState(false);
// // //   const [showAmazonLegacyConnect, setShowAmazonLegacyConnect] = useState(false); // ← NEW
// // //   const [showShopifyConnect, setShowShopifyConnect] = useState(false);
// // //   const [fileUploadedLocal, setFileUploadedLocal] = useState(false);
// // //   const [openAmazonFinance, setOpenAmazonFinance] = useState(false);


// // //   // which country was clicked in Step 4
// // //   const [mtdCountry, setMtdCountry] = useState<string>("");

// // //   const isMobile = useMediaQuery({ maxWidth: 768 });

// // //   useEffect(() => {
// // //     if (localStorage.getItem("fileUploaded") === "true") {
// // //       setFileUploadedLocal(true);
// // //     }
// // //   }, []);

// // //   // Listen for Integration choices coming from the Header's IntegrationsModal
// // //   useEffect(() => {
// // //     const handler = (e: Event) => {
// // //       const custom = e as CustomEvent<{ provider: "amazon" | "shopify"; origin?: Origin }>;
// // //       const { provider, origin = "header" } = custom.detail || {};
// // //       if (!provider) return;
// // //       chooseIntegration(provider, origin);
// // //     };
// // //     // @ts-ignore - CustomEvent name
// // //     window.addEventListener("integration:choose", handler);
// // //     return () => {
// // //       // @ts-ignore
// // //       window.removeEventListener("integration:choose", handler);
// // //     };
// // //   }, []);

// // //   const steps = useMemo(() => {
// // //     const step1Done = fileUploaded || fileUploadedLocal;

// // //     const manual = [
// // //       { id: 1, completed: step1Done, enabled: true, action: () => setActivePopup(1) },
// // //       { id: 2, completed: !!integrationMethod, enabled: step1Done },
// // //       { id: 3, completed: profileExists, enabled: !!integrationMethod, action: () => setActivePopup(2) },
// // //       { id: 4, completed: mtdUploaded, enabled: profileExists, action: () => setActivePopup(3) },
// // //     ];
// // //     const amazon = [
// // //       { id: 1, completed: step1Done, enabled: true, action: () => setActivePopup(1) },
// // //       { id: 2, completed: !!integrationMethod && amazonConnected, enabled: step1Done },
// // //       { id: 3, completed: mtdUploaded, enabled: !!integrationMethod && amazonConnected, action: () => setActivePopup(3) },
// // //     ];

// // //     return integrationMethod === "amazon" ? amazon : manual;
// // //   }, [integrationMethod, amazonConnected, fileUploaded, fileUploadedLocal, profileExists, mtdUploaded]);

// // //   // UPDATED: accept an origin to branch the flow
// // //   const chooseIntegration = (key: "amazon" | "shopify", origin: Origin = "page") => {
// // //     setIntegrationMethod(key);
// // //     localStorage.setItem(LS_KEYS.integrationMethod, key);
// // //     setActivePopup(null);

// // //     if (key === "amazon") {
// // //       if (origin === "header") {
// // //         // Skip AmazonConnect; open Legacy directly
// // //         setShowAmazonLegacyConnect(true);
// // //       } else {
// // //         // Default Step 2 flow: show AmazonConnect first
// // //         setShowAmazonConnect(true);
// // //       }
// // //       return;
// // //     }

// // //     if (key === "shopify") {
// // //       setShowShopifyConnect(true);
// // //     }
// // //   };

// // //   return (
// // //     <div className="font-lato bg-white box-border">
// // //       <h2 className="text-[#414042] font-semibold text-lg md:text-xl mb-4">
// // //         Start your Journey with Phormula!
// // //       </h2>

// // //       <Step1ProductList
// // //         completed={steps[0].completed}
// // //         onOpen={() => steps[0].enabled && steps[0].action?.()}
// // //       />

// // //       <Step2Integration
// // //         locked={!steps[1].enabled}
// // //         completed={steps[1].completed}
// // //         onChoose={(key) => chooseIntegration(key, "page")}
// // //       />

// // //       {integrationMethod === "manual" && (
// // //         <>
// // //           <Step3FeePreview
// // //             enabled={steps[2].enabled}
// // //             completed={steps[2].completed}
// // //             onOpen={() => steps[2].enabled && steps[2].action?.()}
// // //           />

// // //           {/* Pass selectedCountry and capture which button was clicked */}
// // //           <Step4MTD
// // //             enabled={steps[3]?.enabled}
// // //             completed={steps[3]?.completed}
// // //             selectedCountry={selectedCountry}
// // //             onOpenForCountry={(code) => {
// // //               if (code !== selectedCountry) return;
// // //               setMtdCountry(code);
// // //               setActivePopup(3);
// // //             }}
// // //           />
// // //         </>
// // //       )}

// // //       {/* {integrationMethod === "amazon" && (
// // //         <Step3AmazonFinancial
// // //           enabled={steps[2].enabled}
// // //           completed={steps[2].completed}
// // //           onOpen={() => steps[2].enabled && steps[2].action?.()}
// // //         />
// // //       )} */}

// // //       {integrationMethod === "amazon" && (
// // //         <Step3AmazonFinancial
// // //           enabled={steps[2].enabled}
// // //           completed={steps[2].completed}
// // //           onOpen={() => setOpenAmazonFinance(true)}
// // //         />
// // //       )}


// // //       {/* Step 1 modal */}
// // //       {activePopup === 1 && (
// // //         <Modal
// // //           isOpen
// // //           onClose={() => setActivePopup(null)}
// // //           className="m-4 max-w-[900px]"
// // //           showCloseButton
// // //         >
// // //           <div className="relative w-full rounded-3xl bg-white p-4 no-scrollbar dark:bg-gray-900 lg:p-11">
// // //             <SkuMultiCountryUpload
// // //               onClose={() => setActivePopup(null)}
// // //               onComplete={() => {
// // //                 setFileUploadedLocal(true);
// // //                 localStorage.setItem("fileUploaded", "true");
// // //                 window.dispatchEvent(new CustomEvent("inventory:productListUploaded"));
// // //                 setActivePopup(null);
// // //               }}
// // //             />
// // //           </div>
// // //         </Modal>
// // //       )}

// // //       {/* Step 3 modal (Fee Preview) */}
// // //       {activePopup === 2 && (
// // //         <Modal
// // //           isOpen
// // //           onClose={() => setActivePopup(null)}
// // //           className="m-4 max-w-[800px]"
// // //           showCloseButton
// // //         >
// // //           <div className="relative w-full rounded-3xl bg-white p-4 no-scrollbar dark:bg-gray-900 lg:p-11">
// // //             <FeepreviewUpload country={selectedCountry} onClose={() => setActivePopup(null)} />
// // //           </div>
// // //         </Modal>
// // //       )}

// // //       {/* Step 4 modal (MTD Upload) */}
// // //       {activePopup === 3 && (
// // //         <Modal
// // //           isOpen
// // //           onClose={() => setActivePopup(null)}
// // //           className="m-4 max-w-3xl"
// // //           showCloseButton
// // //         >
// // //           <FileUploadForm
// // //             initialCountry={mtdCountry || selectedCountry}
// // //             onClose={() => {
// // //               setActivePopup(null);
// // //             }}
// // //             onComplete={() => {
// // //               setMtdUploaded(true);
// // //               localStorage.setItem(LS_KEYS.mtdDone(selectedCountry), "true");
// // //               setActivePopup(null);
// // //             }}
// // //           />
// // //         </Modal>
// // //       )}

// // //       {/* Amazon connect modal (Step 2/page flow) */}
// // //       {showAmazonConnect && (
// // //         <Modal
// // //           isOpen
// // //           onClose={() => setShowAmazonConnect(false)}
// // //           className="m-4 max-w-xl"
// // //           showCloseButton
// // //         >
// // //           <AmazonConnect
// // //             onClose={() => setShowAmazonConnect(false)}
// // //             onConnected={(refreshToken?: string) => {
// // //               localStorage.setItem(
// // //                 LS_KEYS.amazonRefreshToken(selectedCountry),   // ✅ type-safe now
// // //                 String(refreshToken ?? "")
// // //               );
// // //               setAmazonConnected(true);                        // ✅ update hook state
// // //               setShowAmazonConnect(false);
// // //             }}

// // //             onChooseManual={() => {
// // //               setShowAmazonConnect(false);
// // //               setIntegrationMethod("manual");
// // //               localStorage.setItem(LS_KEYS.integrationMethod, "manual");
// // //             }}
// // //           />
// // //         </Modal>
// // //       )}

// // //       {/* Amazon LEGACY connect modal (Header flow) */}
// // //       {/* {showAmazonLegacyConnect && (
// // //         <Modal
// // //           isOpen
// // //           onClose={() => setShowAmazonLegacyConnect(false)}
// // //           className="m-4 max-w-xl"
// // //           showCloseButton
// // //         >
// // //           <AmazonConnectLegacy
// // //             onClose={() => setShowAmazonLegacyConnect(false)}
// // //             onConnected={(refreshToken?: string) => {
// // //               localStorage.setItem("amazonRefreshToken", String(refreshToken ?? ""));
// // //               setShowAmazonLegacyConnect(false);
// // //             }}
// // //           />
// // //         </Modal>
// // //       )} */}

// // //       {/* Amazon LEGACY connect modal (Header flow) */}
// // //       {showAmazonLegacyConnect && (
// // //         <Modal
// // //           isOpen
// // //           onClose={() => setShowAmazonLegacyConnect(false)}
// // //           className="m-4 max-w-xl"
// // //           showCloseButton
// // //         >
// // //           <AmazonConnectLegacy
// // //             onClose={() => setShowAmazonLegacyConnect(false)}
// // //             onConnected={(refreshToken?: string) => {
// // //               localStorage.setItem(
// // //                 LS_KEYS.amazonRefreshToken(selectedCountry),
// // //                 String(refreshToken ?? "")
// // //               );
// // //               setAmazonConnected(true);
// // //               setShowAmazonLegacyConnect(false);
// // //             }}

// // //             hideBack                  // 👈 NEW: tell Legacy to hide its back button
// // //             backLabel="Close"         // 👈 (optional) if you want the button to appear as "Close"
// // //             onBack={() => {           // 👈 (optional) if the component still renders a back/close control
// // //               setShowAmazonLegacyConnect(false);
// // //             }}
// // //           />
// // //         </Modal>
// // //       )}

// // // {openAmazonFinance && (
// // //   <div
// // //     className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
// // //     role="dialog"
// // //     aria-modal="true"
// // //   >
// // //     <div
// // //       className="absolute inset-0 bg-black/40 backdrop-blur-sm"
// // //       onClick={() => setOpenAmazonFinance(false)}
// // //     />
// // //     <div className="relative w-full max-w-6xl rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
// // //       <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
// // //         <h3 className="text-base font-semibold">Amazon Financial Dashboard</h3>
// // //         <button
// // //           onClick={() => setOpenAmazonFinance(false)}
// // //           className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
// // //           aria-label="Close"
// // //         >
// // //           <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
// // //             <path
// // //               d="M6 6l12 12M18 6L6 18"
// // //               stroke="currentColor"
// // //               strokeWidth="1.6"
// // //               strokeLinecap="round"
// // //             />
// // //           </svg>
// // //         </button>
// // //       </div>
// // //       <div className="mt-3">
// // //         <AmazonFinancialDashboard onClose={() => setOpenAmazonFinance(false)} />
// // //       </div>
// // //     </div>
// // //   </div>
// // // )}


// // //       {showShopifyConnect && (
// // //         <ConnectShopifyModal onClose={() => setShowShopifyConnect(false)} />
// // //       )}
// // //     </div>
// // //   );
// // // }















// // "use client";

// // import React from "react";
// // import { StepBadge } from "@/components/common/StepBadge";
// // import { FaCheck } from "react-icons/fa";
// // import { Modal } from "@/components/ui/modal";

// // type Provider = "amazon" | "shopify";

// // type Props = {
// //   open: boolean;
// //   onClose: () => void;
// // };

// // const options: { key: Provider; title: string; icon: string }[] = [
// //   { key: "amazon", title: "Amazon Integration", icon: "/amazon.png" },
// //   { key: "shopify", title: "Shopify Integration", icon: "/shopify.png" },
// // ];

// // const IntegrationsModal: React.FC<Props> = ({ open, onClose }) => {
// //   const handleChoose = (key: Provider) => {
// //     window.dispatchEvent(
// //       new CustomEvent("integration:choose", {
// //         detail: { provider: key, origin: "header" },
// //       })
// //     );
// //     onClose();
// //   };

// //   const locked = false;
// //   const completed = false;

// //   const containerCls = locked
// //     ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
// //     : completed
// //     ? "bg-[#5EA68E26] border-[#5EA68E]"
// //     : "bg-white border-[#5EA68E] hover:bg-gray-50";

// //   return (
// //     <Modal
// //       isOpen={open}
// //       onClose={onClose}
// //       className="max-w-lg p-5 border border-gray-200 shadow-2xl dark:border-gray-800"
// //     >
// //       {/* Modal header */}
// //       <div className="mb-4 flex items-center justify-between">
// //         <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
// //           Integrations
// //         </h2>
// //       </div>

// //       {/* Step block */}
// //       <div className={`p-4 rounded-md border mb-4 transition-all ${containerCls}`}>
// //         <div className="flex items-center justify-between mb-3">
// //           <div className="flex items-center gap-2">
// //             <StepBadge completed={completed} label={2} />
// //             <h3
// //               className={`font-semibold text-sm sm:text-base ${
// //                 locked ? "text-gray-500" : "text-[#5EA68E]"
// //               }`}
// //             >
// //               Select Your Integration Method
// //             </h3>
// //           </div>

// //           {locked ? (
// //             <i className="fa-solid fa-lock text-gray-500 text-xs" />
// //           ) : completed ? (
// //             <span className="flex items-center gap-1 text-[10px] font-semibold text-white bg-[#5EA68E] px-3 py-1 rounded-full">
// //               <FaCheck className="w-3 h-3" /> Completed
// //             </span>
// //           ) : (
// //             <img src="/Favicon.png" alt="icon" className="h-5 sm:h-6" />
// //           )}
// //         </div>

// //         <div className="flex gap-5 ml-8">
// //           {options.map((opt) => (
// //             <button
// //               key={opt.key}
// //               type="button"
// //               disabled={locked}
// //               onClick={() => !locked && handleChoose(opt.key)}
// //               title={opt.title}
// //               aria-label={opt.title}
// //               className={`aspect-square w-14 rounded-md border border-[#5EA68E] flex items-center justify-center
// //                 ${locked ? "opacity-60 cursor-not-allowed" : "hover:bg-emerald-50"}`}
// //             >
// //               <img src={opt.icon} alt={opt.title} className="h-7 w-7 object-contain" />
// //             </button>
// //           ))}
// //         </div>
// //       </div>
// //     </Modal>
// //   );
// // };

// // export default IntegrationsModal;





















// // // IntegrationDashboard.tsx
// // "use client";

// // import React, { useMemo, useState, useEffect } from "react";
// // import { useParams } from "next/navigation";

// // import { useIntegrationProgress, LS_KEYS } from "./useIntegrationProgress";

// // import { Step1ProductList } from "./steps/Step1ProductList";
// // import { Step2Integration } from "./steps/Step2Integration";
// // import { Step3FeePreview } from "./steps/Step3FeePreview";
// // import { Step4MTD } from "./steps/Step4MTD";
// // import { Step3AmazonFinancial } from "./steps/Step3AmazonFinancial";

// // import SkuMultiCountryUpload from "@/components/ui/modal/SkuMultiCountryUpload";
// // import FeepreviewUpload from "@/components/ui/modal/FeepreviewUpload";

// // import AmazonConnect from "./AmazonConnect";
// // import AmazonConnectLegacy from "./AmazonConnectLegacy";
// // import { Modal } from "@/components/ui/modal";
// // import FileUploadForm from "@/app/(admin)/(ui-elements)/modals/FileUploadForm";
// // import ConnectShopifyModal from "./ConnectShopifyModal";
// // import AmazonFinancialDashboard from "./AmazonFinancialDashboard";

// // type Origin = "header" | "page";
// // type Provider = "amazon" | "shopify";

// // export default function IntegrationDashboard() {
// //   const { countryName } = useParams<{ countryName: string }>();
// //   const selectedCountry = (countryName || "").toLowerCase();

// //   const {
// //     fileUploaded,
// //     profileExists,
// //     integrationMethod,
// //     setIntegrationMethod,
// //     setAmazonConnected,
// //     amazonConnected,
// //     mtdUploaded,
// //     setMtdUploaded,
// //   } = useIntegrationProgress(selectedCountry);

// //   const [activePopup, setActivePopup] = useState<number | null>(null);
// //   const [showAmazonConnect, setShowAmazonConnect] = useState(false);
// //   const [showAmazonLegacyConnect, setShowAmazonLegacyConnect] = useState(false);
// //   const [showShopifyConnect, setShowShopifyConnect] = useState(false);
// //   const [fileUploadedLocal, setFileUploadedLocal] = useState(false);
// //   const [openAmazonFinance, setOpenAmazonFinance] = useState(false);

// //   // which country was clicked in Step 4
// //   const [mtdCountry, setMtdCountry] = useState<string>("");

// //   // Restore "fileUploaded" optimistic flag from localStorage (legacy / UI only)
// //   useEffect(() => {
// //     if (typeof window === "undefined") return;
// //     if (localStorage.getItem("fileUploaded") === "true") {
// //       setFileUploadedLocal(true);
// //     }
// //   }, []);

// //   // Listen for Integration choices coming from the Header's IntegrationsModal
// //   useEffect(() => {
// //     const handler = (e: Event) => {
// //       const custom = e as CustomEvent<{ provider: Provider; origin?: Origin }>;
// //       const { provider, origin = "header" } = custom.detail || {};
// //       if (!provider) return;
// //       chooseIntegration(provider, origin);
// //     };

// //     // @ts-ignore - CustomEvent name type
// //     window.addEventListener("integration:choose", handler);
// //     return () => {
// //       // @ts-ignore
// //       window.removeEventListener("integration:choose", handler);
// //     };
// //   }, []);

// //   // Close the Amazon Finance modal when country or integration method changes
// //   useEffect(() => {
// //     setOpenAmazonFinance(false);
// //   }, [selectedCountry, integrationMethod]);

// //   const steps = useMemo(() => {
// //     // Step 1 is done if:
// //     //  - backend says fileUploaded, OR
// //     //  - we optimistically marked it via fileUploadedLocal
// //     const step1Done = fileUploaded || fileUploadedLocal;

// //     const manual = [
// //       { id: 1, completed: step1Done, enabled: true, action: () => setActivePopup(1) },
// //       { id: 2, completed: !!integrationMethod, enabled: step1Done },
// //       {
// //         id: 3,
// //         completed: profileExists,
// //         enabled: !!integrationMethod,
// //         action: () => setActivePopup(2),
// //       },
// //       {
// //         id: 4,
// //         completed: mtdUploaded,
// //         enabled: profileExists,
// //         action: () => setActivePopup(3),
// //       },
// //     ];

// //     const amazon = [
// //       { id: 1, completed: step1Done, enabled: true, action: () => setActivePopup(1) },
// //       {
// //         id: 2,
// //         completed: !!integrationMethod && amazonConnected,
// //         enabled: step1Done,
// //       },
// //       {
// //         id: 3,
// //         completed: mtdUploaded,
// //         enabled: !!integrationMethod && amazonConnected,
// //         action: () => setActivePopup(3),
// //       },
// //     ];

// //     return integrationMethod === "amazon" ? amazon : manual;
// //   }, [
// //     integrationMethod,
// //     amazonConnected,
// //     fileUploaded,
// //     fileUploadedLocal,
// //     profileExists,
// //     mtdUploaded,
// //   ]);

// //   // Accept an origin to branch the flow
// //   const chooseIntegration = (key: Provider, origin: Origin = "page") => {
// //     // ⬇️ hook handles localStorage persistence
// //     setIntegrationMethod(key);
// //     setActivePopup(null);

// //     if (key === "amazon") {
// //       if (origin === "header") {
// //         // Skip AmazonConnect; open Legacy directly
// //         setShowAmazonLegacyConnect(true);
// //       } else {
// //         // Default Step 2 flow: show AmazonConnect first
// //         setShowAmazonConnect(true);
// //       }
// //       return;
// //     }

// //     if (key === "shopify") {
// //       setShowShopifyConnect(true);
// //     }
// //   };

// //   return (
// //     <div className="font-lato bg-white box-border">
// //       <h2 className="text-[#414042] font-semibold text-lg md:text-xl mb-4">
// //         Start your Journey with Phormula!
// //       </h2>

// //       {/* Step 1: Product list upload */}
// //       <Step1ProductList
// //         completed={steps[0].completed}
// //         onOpen={() => steps[0].enabled && steps[0].action?.()}
// //       />

// //       {/* Step 2: Integration selection */}
// //       <Step2Integration
// //         locked={!steps[1].enabled}
// //         completed={steps[1].completed}
// //         onChoose={(key) => chooseIntegration(key, "page")}
// //       />

// //       {/* Manual integration steps */}
// //       {integrationMethod === "manual" && (
// //         <>
// //           <Step3FeePreview
// //             enabled={steps[2].enabled}
// //             completed={steps[2].completed}
// //             onOpen={() => steps[2].enabled && steps[2].action?.()}
// //           />

// //           <Step4MTD
// //             enabled={steps[3]?.enabled}
// //             completed={steps[3]?.completed}
// //             selectedCountry={selectedCountry}
// //             onOpenForCountry={(code) => {
// //               if (code !== selectedCountry) return;
// //               setMtdCountry(code);
// //               setActivePopup(3);
// //             }}
// //           />
// //         </>
// //       )}

// //       {/* Amazon integration steps */}
// //       {integrationMethod === "amazon" && (
// //         <Step3AmazonFinancial
// //           enabled={steps[2].enabled}
// //           completed={steps[2].completed}
// //           onOpen={() => setOpenAmazonFinance(true)}
// //         />
// //       )}

// //       {/* Step 1 modal (Product list upload) */}
// //       {activePopup === 1 && (
// //         <Modal
// //           isOpen
// //           onClose={() => setActivePopup(null)}
// //           className="m-4 max-w-[900px]"
// //           showCloseButton
// //         >
// //           <div className="relative w-full rounded-3xl bg-white p-4 no-scrollbar dark:bg-gray-900 lg:p-11">
// //             <SkuMultiCountryUpload
// //               onClose={() => setActivePopup(null)}
// //               onComplete={() => {
// //                 // Optimistically mark step 1 done so next step unlocks immediately
// //                 setFileUploadedLocal(true);
// //                 if (typeof window !== "undefined") {
// //                   localStorage.setItem("fileUploaded", "true"); // legacy / UI only
// //                   window.dispatchEvent(
// //                     new CustomEvent("inventory:productListUploaded")
// //                   );
// //                 }
// //                 setActivePopup(null);
// //               }}
// //             />
// //           </div>
// //         </Modal>
// //       )}

// //       {/* Step 3 modal (Fee Preview upload) */}
// //       {activePopup === 2 && (
// //         <Modal
// //           isOpen
// //           onClose={() => setActivePopup(null)}
// //           className="m-4 max-w-[800px]"
// //           showCloseButton
// //         >
// //           <div className="relative w-full rounded-3xl bg-white p-4 no-scrollbar dark:bg-gray-900 lg:p-11">
// //             <FeepreviewUpload
// //               country={selectedCountry}
// //               onClose={() => setActivePopup(null)}
// //               // ⚠️ OPTIONAL: if FeepreviewUpload supports onComplete,
// //               // you can use it to force a refetch of the profile query
// //               // so Step 4 unlocks faster without a manual refresh.
// //             />
// //           </div>
// //         </Modal>
// //       )}

// //       {/* Step 4 modal (MTD Upload) */}
// //       {activePopup === 3 && (
// //         <Modal
// //           isOpen
// //           onClose={() => setActivePopup(null)}
// //           className="m-4 max-w-3xl"
// //           showCloseButton
// //         >
// //           <FileUploadForm
// //             initialCountry={mtdCountry || selectedCountry}
// //             onClose={() => {
// //               setActivePopup(null);
// //             }}
// //             onComplete={() => {
// //               // ✅ This setter BOTH updates React state and writes to LS in the hook
// //               setMtdUploaded(true);
// //               setActivePopup(null);
// //             }}
// //           />
// //         </Modal>
// //       )}

// //       {/* Amazon connect modal (Step 2 / page flow) */}
// //       {showAmazonConnect && (
// //         <Modal
// //           isOpen
// //           onClose={() => setShowAmazonConnect(false)}
// //           className="m-4 max-w-xl"
// //           showCloseButton
// //         >
// //           <AmazonConnect
// //             onClose={() => setShowAmazonConnect(false)}
// //             onConnected={(refreshToken?: string) => {
// //               if (typeof window !== "undefined") {
// //                 localStorage.setItem(
// //                   LS_KEYS.amazonRefreshToken(selectedCountry),
// //                   String(refreshToken ?? "")
// //                 );
// //               }
// //               // ✅ Immediately unlocks the Amazon step
// //               setAmazonConnected(true);
// //               setShowAmazonConnect(false);
// //             }}
// //             onChooseManual={() => {
// //               setShowAmazonConnect(false);
// //               setIntegrationMethod("manual");
// //             }}
// //           />
// //         </Modal>
// //       )}

// //       {/* Amazon LEGACY connect modal (Header flow) */}
// //       {showAmazonLegacyConnect && (
// //         <Modal
// //           isOpen
// //           onClose={() => setShowAmazonLegacyConnect(false)}
// //           className="m-4 max-w-xl"
// //           showCloseButton
// //         >
// //           <AmazonConnectLegacy
// //             onClose={() => setShowAmazonLegacyConnect(false)}
// //             onConnected={(refreshToken?: string) => {
// //               if (typeof window !== "undefined") {
// //                 localStorage.setItem(
// //                   LS_KEYS.amazonRefreshToken(selectedCountry),
// //                   String(refreshToken ?? "")
// //                 );
// //               }
// //               setAmazonConnected(true);
// //               setShowAmazonLegacyConnect(false);
// //             }}
// //             hideBack
// //             backLabel="Close"
// //             onBack={() => {
// //               setShowAmazonLegacyConnect(false);
// //             }}
// //           />
// //         </Modal>
// //       )}

// //       {/* Amazon Financial Dashboard modal (only when Amazon is selected AND connected) */}
// //       {integrationMethod === "amazon" && amazonConnected && openAmazonFinance && (
// //         <div
// //           className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
// //           role="dialog"
// //           aria-modal="true"
// //         >
// //           <div
// //             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
// //             onClick={() => setOpenAmazonFinance(false)}
// //           />
// //           <div className="relative w-full max-w-6xl rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
// //             <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
// //               <h3 className="text-base font-semibold">
// //                 Amazon Financial Dashboard
// //               </h3>
// //               <button
// //                 onClick={() => setOpenAmazonFinance(false)}
// //                 className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
// //                 aria-label="Close"
// //               >
// //                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
// //                   <path
// //                     d="M6 6l12 12M18 6L6 18"
// //                     stroke="currentColor"
// //                     strokeWidth="1.6"
// //                     strokeLinecap="round"
// //                   />
// //                 </svg>
// //               </button>
// //             </div>
// //             <div className="mt-3">
// //               <AmazonFinancialDashboard
// //                 onClose={() => setOpenAmazonFinance(false)}
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Shopify connect modal */}
// //       {showShopifyConnect && (
// //         <ConnectShopifyModal onClose={() => setShowShopifyConnect(false)} />
// //       )}
// //     </div>
// //   );
// // }





































// // IntegrationDashboard.tsx
// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import { useParams } from "next/navigation";

// import { useIntegrationProgress, LS_KEYS } from "./useIntegrationProgress";

// import { Step1ProductList } from "./steps/Step1ProductList";
// import { Step2Integration } from "./steps/Step2Integration";
// import { Step3FeePreview } from "./steps/Step3FeePreview";
// import { Step4MTD } from "./steps/Step4MTD";
// import { Step3AmazonFinancial } from "./steps/Step3AmazonFinancial";

// import SkuMultiCountryUpload from "@/components/ui/modal/SkuMultiCountryUpload";
// import FeepreviewUpload from "@/components/ui/modal/FeepreviewUpload";

// import AmazonConnect from "./AmazonConnect";
// import AmazonConnectLegacy from "./AmazonConnectLegacy";
// import { Modal } from "@/components/ui/modal";
// import FileUploadForm from "@/app/(admin)/(ui-elements)/modals/FileUploadForm";
// import ConnectShopifyModal from "./ConnectShopifyModal";
// import AmazonFinancialDashboard from "./AmazonFinancialDashboard";

// type Origin = "header" | "page";
// type Provider = "amazon" | "shopify";

// export default function IntegrationDashboard() {
//   const { countryName } = useParams<{ countryName: string }>();
//   const selectedCountry = (countryName || "").toLowerCase();

//   const {
//     fileUploaded,
//     profileExists,
//     integrationMethod,
//     setIntegrationMethod,
//     setAmazonConnected,
//     amazonConnected,
//     mtdUploaded,
//     setMtdUploaded,
//     refetchFileStatus,           // ⬅️ NEW
//   } = useIntegrationProgress(selectedCountry);

//   const [activePopup, setActivePopup] = useState<number | null>(null);
//   const [showAmazonConnect, setShowAmazonConnect] = useState(false);
//   const [showAmazonLegacyConnect, setShowAmazonLegacyConnect] = useState(false);
//   const [showShopifyConnect, setShowShopifyConnect] = useState(false);
//   const [openAmazonFinance, setOpenAmazonFinance] = useState(false);

//   // which country was clicked in Step 4
//   const [mtdCountry, setMtdCountry] = useState<string>("");

//   // ✅ local flag: "SKU upload for this session is done"
//   const [skuCompleted, setSkuCompleted] = useState(false);

//   // Listen for Integration choices coming from the Header's IntegrationsModal
//   useEffect(() => {
//     const handler = (e: Event) => {
//       const custom = e as CustomEvent<{ provider: Provider; origin?: Origin }>;
//       const { provider, origin = "header" } = custom.detail || {};
//       if (!provider) return;
//       chooseIntegration(provider, origin);
//     };

//     // @ts-ignore - CustomEvent name type
//     window.addEventListener("integration:choose", handler);
//     return () => {
//       // @ts-ignore
//       window.removeEventListener("integration:choose", handler);
//     };
//   }, []);

//   // Close the Amazon Finance modal when country or integration method changes
//   useEffect(() => {
//     setOpenAmazonFinance(false);
//   }, [selectedCountry, integrationMethod]);

//   const steps = useMemo(() => {
//     // ✅ Step 1 is done if backend says so OR we've completed it in this session
//     const step1Done = fileUploaded || skuCompleted;

//     const manual = [
//       { id: 1, completed: step1Done, enabled: true, action: () => setActivePopup(1) },
//       { id: 2, completed: !!integrationMethod, enabled: step1Done },
//       {
//         id: 3,
//         completed: profileExists,
//         enabled: !!integrationMethod,
//         action: () => setActivePopup(2),
//       },
//       {
//         id: 4,
//         completed: mtdUploaded,
//         enabled: profileExists,
//         action: () => setActivePopup(3),
//       },
//     ];

//     const amazon = [
//       { id: 1, completed: step1Done, enabled: true, action: () => setActivePopup(1) },
//       {
//         id: 2,
//         completed: !!integrationMethod && amazonConnected,
//         enabled: step1Done,
//       },
//       {
//         id: 3,
//         completed: mtdUploaded,
//         enabled: !!integrationMethod && amazonConnected,
//         action: () => setActivePopup(3),
//       },
//     ];

//     return integrationMethod === "amazon" ? amazon : manual;
//   }, [
//     integrationMethod,
//     amazonConnected,
//     fileUploaded,
//     skuCompleted,          // ⬅️ IMPORTANT
//     profileExists,
//     mtdUploaded,
//   ]);

//   // Accept an origin to branch the flow
//   const chooseIntegration = (key: Provider, origin: Origin = "page") => {
//     setIntegrationMethod(key);
//     setActivePopup(null);

//     if (key === "amazon") {
//       if (origin === "header") {
//         setShowAmazonLegacyConnect(true);
//       } else {
//         setShowAmazonConnect(true);
//       }
//       return;
//     }

//     if (key === "shopify") {
//       setShowShopifyConnect(true);
//     }
//   };

//   return (
//     <div className="font-lato bg-white box-border">
//       <h2 className="text-[#414042] font-semibold text-lg md:text-xl mb-4">
//         Start your Journey with Phormula!
//       </h2>

//       {/* Step 1: Product list upload */}
//       <Step1ProductList
//         completed={steps[0].completed}
//         onOpen={() => steps[0].enabled && steps[0].action?.()}
//       />

//       {/* Step 2: Integration selection */}
//       <Step2Integration
//         locked={!steps[1].enabled}
//         completed={steps[1].completed}
//         onChoose={(key) => chooseIntegration(key, "page")}
//       />

//       {/* Manual integration steps */}
//       {integrationMethod === "manual" && (
//         <>
//           <Step3FeePreview
//             enabled={steps[2].enabled}
//             completed={steps[2].completed}
//             onOpen={() => steps[2].enabled && steps[2].action?.()}
//           />

//           <Step4MTD
//             enabled={steps[3]?.enabled}
//             completed={steps[3]?.completed}
//             selectedCountry={selectedCountry}
//             onOpenForCountry={(code) => {
//               if (code !== selectedCountry) return;
//               setMtdCountry(code);
//               setActivePopup(3);
//             }}
//           />
//         </>
//       )}

//       {/* Amazon integration steps */}
//       {integrationMethod === "amazon" && (
//         <Step3AmazonFinancial
//           enabled={steps[2].enabled}
//           completed={steps[2].completed}
//           onOpen={() => setOpenAmazonFinance(true)}
//         />
//       )}

//       {/* Step 1 modal (Product list upload) */}
//       {activePopup === 1 && (
//         <Modal
//           isOpen
//           onClose={() => setActivePopup(null)}
//           className="m-4 max-w-[900px]"
//           showCloseButton
//         >
//           {/* <div className="relative w-full rounded-3xl bg-white p-4 no-scrollbar dark:bg-gray-900 lg:p-11">
//             <SkuMultiCountryUpload
//               onClose={() => setActivePopup(null)}
//               onComplete={async () => {
//                 // ✅ Immediately mark Step 1 as completed in this session
//                 setSkuCompleted(true);

//                 // ✅ Ask RTK Query to refresh backend status (for future visits / reload)
//                 try {
//                   await refetchFileStatus();
//                 } catch {
//                   // fail silently; local skuCompleted still keeps UI unlocked
//                 }

//                 setActivePopup(null);
//               }}
//             />
//           </div> */}

//           <div className="relative w-full rounded-3xl bg-white p-4 no-scrollbar dark:bg-gray-900 lg:p-11">
//       <SkuMultiCountryUpload
//         onClose={() => setActivePopup(null)}
//         onComplete={() => {
//           // ✅ this will FINALLY be called
//           setFileUploadedLocal(true);
//           if (typeof window !== "undefined") {
//             localStorage.setItem("fileUploaded", "true");
//             window.dispatchEvent(
//               new CustomEvent("inventory:productListUploaded")
//             );
//           }
//           setActivePopup(null);
//         }}
//       />
//     </div>
//         </Modal>
//       )}

//       {/* Step 3 modal (Fee Preview upload) */}
//       {activePopup === 2 && (
//         <Modal
//           isOpen
//           onClose={() => setActivePopup(null)}
//           className="m-4 max-w-[800px]"
//           showCloseButton
//         >
//           <div className="relative w-full rounded-3xl bg-white p-4 no-scrollbar dark:bg-gray-900 lg:p-11">
//             <FeepreviewUpload
//               country={selectedCountry}
//               onClose={() => setActivePopup(null)}
//             />
//           </div>
//         </Modal>
//       )}

//       {/* Step 4 modal (MTD Upload) */}
//       {activePopup === 3 && (
//         <Modal
//           isOpen
//           onClose={() => setActivePopup(null)}
//           className="m-4 max-w-3xl"
//           showCloseButton
//         >
//           <FileUploadForm
//             initialCountry={mtdCountry || selectedCountry}
//             onClose={() => {
//               setActivePopup(null);
//             }}
//             onComplete={() => {
//               setMtdUploaded(true);
//               setActivePopup(null);
//             }}
//           />
//         </Modal>
//       )}

//       {/* Amazon connect modal (Step 2 / page flow) */}
//       {showAmazonConnect && (
//         <Modal
//           isOpen
//           onClose={() => setShowAmazonConnect(false)}
//           className="m-4 max-w-xl"
//           showCloseButton
//         >
//           <AmazonConnect
//             onClose={() => setShowAmazonConnect(false)}
//             onConnected={(refreshToken?: string) => {
//               if (typeof window !== "undefined") {
//                 localStorage.setItem(
//                   LS_KEYS.amazonRefreshToken(selectedCountry),
//                   String(refreshToken ?? "")
//                 );
//               }
//               setAmazonConnected(true);
//               setShowAmazonConnect(false);
//             }}
//             onChooseManual={() => {
//               setShowAmazonConnect(false);
//               setIntegrationMethod("manual");
//             }}
//           />
//         </Modal>
//       )}

//       {/* Amazon LEGACY connect modal (Header flow) */}
//       {showAmazonLegacyConnect && (
//         <Modal
//           isOpen
//           onClose={() => setShowAmazonLegacyConnect(false)}
//           className="m-4 max-w-xl"
//           showCloseButton
//         >
//           <AmazonConnectLegacy
//             onClose={() => setShowAmazonLegacyConnect(false)}
//             onConnected={(refreshToken?: string) => {
//               if (typeof window !== "undefined") {
//                 localStorage.setItem(
//                   LS_KEYS.amazonRefreshToken(selectedCountry),
//                   String(refreshToken ?? "")
//                 );
//               }
//               setAmazonConnected(true);
//               setShowAmazonLegacyConnect(false);
//             }}
//             hideBack
//             backLabel="Close"
//             onBack={() => {
//               setShowAmazonLegacyConnect(false);
//             }}
//           />
//         </Modal>
//       )}

//       {/* Amazon Financial Dashboard modal */}
//       {integrationMethod === "amazon" && amazonConnected && openAmazonFinance && (
//         <div
//           className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
//           role="dialog"
//           aria-modal="true"
//         >
//           <div
//             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//             onClick={() => setOpenAmazonFinance(false)}
//           />
//           <div className="relative w-full max-w-6xl rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
//             <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
//               <h3 className="text-base font-semibold">
//                 Amazon Financial Dashboard
//               </h3>
//               <button
//                 onClick={() => setOpenAmazonFinance(false)}
//                 className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
//                 aria-label="Close"
//               >
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                   <path
//                     d="M6 6l12 12M18 6L6 18"
//                     stroke="currentColor"
//                     strokeWidth="1.6"
//                     strokeLinecap="round"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className="mt-3">
//               <AmazonFinancialDashboard
//                 onClose={() => setOpenAmazonFinance(false)}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Shopify connect modal */}
//       {showShopifyConnect && (
//         <ConnectShopifyModal onClose={() => setShowShopifyConnect(false)} />
//       )}
//     </div>
//   );
// }



















// features/integration/IntegrationDashboard.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { useIntegrationProgress, LS_KEYS } from "./useIntegrationProgress";

import { Step1ProductList } from "./steps/Step1ProductList";
import { Step2Integration } from "./steps/Step2Integration";
import { Step3FeePreview } from "./steps/Step3FeePreview";
import { Step4MTD } from "./steps/Step4MTD";
import { Step3AmazonFinancial } from "./steps/Step3AmazonFinancial";

import SkuMultiCountryUpload from "@/components/ui/modal/SkuMultiCountryUpload";
import FeepreviewUpload from "@/components/ui/modal/FeepreviewUpload";

import AmazonConnect from "./AmazonConnect";
import AmazonConnectLegacy from "./AmazonConnectLegacy";
import { Modal } from "@/components/ui/modal";
import FileUploadForm from "@/app/(admin)/(ui-elements)/modals/FileUploadForm";
import ConnectShopifyModal from "./ConnectShopifyModal";
import AmazonFinancialDashboard from "./AmazonFinancialDashboard";

type Origin = "header" | "page";
type Provider = "amazon" | "shopify";

// (optional, to satisfy Page.tsx props)
type IntegrationDashboardProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function IntegrationDashboard(_: IntegrationDashboardProps) {
  const { countryName } = useParams<{ countryName: string }>();
  const selectedCountry = (countryName || "").toLowerCase();

  const {
    fileUploaded,
    profileExists,
    integrationMethod,
    setIntegrationMethod,
    setAmazonConnected,
    amazonConnected,
    mtdUploaded,
    setMtdUploaded,
    refetchFileStatus,
  } = useIntegrationProgress(selectedCountry);

  const [activePopup, setActivePopup] = useState<number | null>(null);
  const [showAmazonConnect, setShowAmazonConnect] = useState(false);
  const [showAmazonLegacyConnect, setShowAmazonLegacyConnect] = useState(false);
  const [showShopifyConnect, setShowShopifyConnect] = useState(false);
  const [openAmazonFinance, setOpenAmazonFinance] = useState(false);

  const [mtdCountry, setMtdCountry] = useState<string>("");

  // ✅ local in-session flag for SKU step completion
  const [skuCompleted, setSkuCompleted] = useState(false);

  // Listen for Integration choices fired from header modal
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ provider: Provider; origin?: Origin }>;
      const { provider, origin = "header" } = custom.detail || {};
      if (!provider) return;
      chooseIntegration(provider, origin);
    };

    // @ts-ignore Custom event name
    window.addEventListener("integration:choose", handler);
    return () => {
      // @ts-ignore
      window.removeEventListener("integration:choose", handler);
    };
  }, []);

  // Close Amazon Finance modal on country / integration change
  useEffect(() => {
    setOpenAmazonFinance(false);
  }, [selectedCountry, integrationMethod]);

  const steps = useMemo(() => {
    const step1Done = fileUploaded || skuCompleted;

    const manual = [
      { id: 1, completed: step1Done, enabled: true, action: () => setActivePopup(1) },
      { id: 2, completed: !!integrationMethod, enabled: step1Done },
      {
        id: 3,
        completed: profileExists,
        enabled: !!integrationMethod,
        action: () => setActivePopup(2),
      },
      {
        id: 4,
        completed: mtdUploaded,
        enabled: profileExists,
        action: () => setActivePopup(3),
      },
    ];

    const amazon = [
      { id: 1, completed: step1Done, enabled: true, action: () => setActivePopup(1) },
      {
        id: 2,
        completed: !!integrationMethod && amazonConnected,
        enabled: step1Done,
      },
      {
        id: 3,
        completed: mtdUploaded,
        enabled: !!integrationMethod && amazonConnected,
        action: () => setActivePopup(3),
      },
    ];

    return integrationMethod === "amazon" ? amazon : manual;
  }, [
    integrationMethod,
    amazonConnected,
    fileUploaded,
    skuCompleted,
    profileExists,
    mtdUploaded,
  ]);

  const chooseIntegration = (key: Provider, origin: Origin = "page") => {
    setIntegrationMethod(key);
    setActivePopup(null);

    if (key === "amazon") {
      if (origin === "header") {
        setShowAmazonLegacyConnect(true);
      } else {
        setShowAmazonConnect(true);
      }
      return;
    }

    if (key === "shopify") {
      setShowShopifyConnect(true);
    }
  };

  return (
    <div className="font-lato bg-white box-border">
      <h2 className="text-[#414042] font-semibold text-lg md:text-xl mb-4">
        Start your Journey with Phormula!
      </h2>

      {/* Step 1 */}
      <Step1ProductList
        completed={steps[0].completed}
        onOpen={() => steps[0].enabled && steps[0].action?.()}
      />

      {/* Step 2 */}
      <Step2Integration
        locked={!steps[1].enabled}
        completed={steps[1].completed}
        onChoose={(key) => chooseIntegration(key, "page")}
      />

      {/* Manual flow */}
      {integrationMethod === "manual" && (
        <>
          <Step3FeePreview
            enabled={steps[2].enabled}
            completed={steps[2].completed}
            onOpen={() => steps[2].enabled && steps[2].action?.()}
          />

          <Step4MTD
            enabled={steps[3]?.enabled}
            completed={steps[3]?.completed}
            selectedCountry={selectedCountry}
            onOpenForCountry={(code) => {
              if (code !== selectedCountry) return;
              setMtdCountry(code);
              setActivePopup(3);
            }}
          />
        </>
      )}

      {/* Amazon flow */}
      {integrationMethod === "amazon" && (
        <Step3AmazonFinancial
          enabled={steps[2].enabled}
          completed={steps[2].completed}
          onOpen={() => setOpenAmazonFinance(true)}
        />
      )}

      {/* Step 1 modal (SKU upload) */}
      {activePopup === 1 && (
        <Modal
          isOpen
          onClose={() => setActivePopup(null)}
          className="m-4 max-w-[900px]"
          showCloseButton
        >
          <div className="relative w-full rounded-3xl bg-white p-4 no-scrollbar dark:bg-gray-900 lg:p-11">
            <SkuMultiCountryUpload
              onClose={() => setActivePopup(null)}
              onComplete={async () => {
                // mark step 1 done right away
                setSkuCompleted(true);

                // refresh backend status for future sessions
                try {
                  await refetchFileStatus();
                } catch {
                  /* ignore */
                }

                setActivePopup(null);
              }}
            />
          </div>
        </Modal>
      )}

      {/* Step 3 modal (Fee Preview) */}
      {activePopup === 2 && (
        <Modal
          isOpen
          onClose={() => setActivePopup(null)}
          className="m-4 max-w-[800px]"
          showCloseButton
        >
          <div className="relative w-full rounded-3xl bg-white p-4 no-scrollbar dark:bg-gray-900 lg:p-11">
            <FeepreviewUpload
              country={selectedCountry}
              onClose={() => setActivePopup(null)}
            />
          </div>
        </Modal>
      )}

      {/* Step 4 modal (MTD Upload) */}
      {activePopup === 3 && (
        <Modal
          isOpen
          onClose={() => setActivePopup(null)}
          className="m-4 max-w-3xl"
          showCloseButton
        >
          <FileUploadForm
            initialCountry={mtdCountry || selectedCountry}
            onClose={() => {
              setActivePopup(null);
            }}
            onComplete={() => {
              setMtdUploaded(true);
              setActivePopup(null);
            }}
          />
        </Modal>
      )}

      {/* Amazon connect (page flow) */}
      {showAmazonConnect && (
        <Modal
          isOpen
          onClose={() => setShowAmazonConnect(false)}
          className="m-4 max-w-xl"
          showCloseButton
        >
          <AmazonConnect
            onClose={() => setShowAmazonConnect(false)}
            onConnected={(refreshToken?: string) => {
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  LS_KEYS.amazonRefreshToken(selectedCountry),
                  String(refreshToken ?? "")
                );
              }
              setAmazonConnected(true);
              setShowAmazonConnect(false);
            }}
            onChooseManual={() => {
              setShowAmazonConnect(false);
              setIntegrationMethod("manual");
            }}
          />
        </Modal>
      )}

      {/* Amazon LEGACY connect (header flow) */}
      {showAmazonLegacyConnect && (
        <Modal
          isOpen
          onClose={() => setShowAmazonLegacyConnect(false)}
          className="m-4 max-w-xl"
          showCloseButton
        >
          <AmazonConnectLegacy
            onClose={() => setShowAmazonLegacyConnect(false)}
            onConnected={(refreshToken?: string) => {
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  LS_KEYS.amazonRefreshToken(selectedCountry),
                  String(refreshToken ?? "")
                );
              }
              setAmazonConnected(true);
              setShowAmazonLegacyConnect(false);
            }}
          />
        </Modal>
      )}

      {/* Amazon financial dashboard */}
      {integrationMethod === "amazon" && amazonConnected && openAmazonFinance && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpenAmazonFinance(false)}
          />
          <div className="relative w-full max-w-6xl rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-base font-semibold">
                Amazon Financial Dashboard
              </h3>
              <button
                onClick={() => setOpenAmazonFinance(false)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
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
            <div className="mt-3">
              <AmazonFinancialDashboard
                onClose={() => setOpenAmazonFinance(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Shopify connect */}
      {showShopifyConnect && (
        <ConnectShopifyModal onClose={() => setShowShopifyConnect(false)} />
      )}
    </div>
  );
}
