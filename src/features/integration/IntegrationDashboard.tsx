// // IntegrationDashboard.tsx (only the changed bits)

// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { useMediaQuery } from "react-responsive";

// import { useIntegrationProgress, LS_KEYS } from "./useIntegrationProgress";

// import { Step1ProductList } from "./steps/Step1ProductList";
// import { Step2Integration } from "./steps/Step2Integration";
// import { Step3FeePreview } from "./steps/Step3FeePreview";
// import { Step4MTD } from "./steps/Step4MTD";

// import SkuMultiCountryUpload from "@/components/ui/modal/SkuMultiCountryUpload";
// import FeepreviewUpload from "@/components/ui/modal/FeepreviewUpload";

// import AmazonConnect from "./AmazonConnect";
// import { Modal } from "@/components/ui/modal";
// import FileUploadForm from "@/app/(admin)/(ui-elements)/modals/FileUploadForm";
// import ConnectShopifyModal from "./ConnectShopifyModal";

// export default function IntegrationDashboard() {
//   const { countryName } = useParams<{ countryName: string }>();
//   const selectedCountry = (countryName || "").toLowerCase();

//   const {
//     fileUploaded,
//     profileExists,
//     integrationMethod,
//     setIntegrationMethod,
//     amazonConnected,
//     mtdUploaded,
//     setMtdUploaded,
//   } = useIntegrationProgress(selectedCountry);

//   const [activePopup, setActivePopup] = useState<number | null>(null);
//   const [showAmazonConnect, setShowAmazonConnect] = useState(false);
//   const [showShopifyConnect, setShowShopifyConnect] = useState(false);
//   const [fileUploadedLocal, setFileUploadedLocal] = useState(false);

//   // NEW: which country was clicked in Step 4
//   const [mtdCountry, setMtdCountry] = useState<string>("");

//   const isMobile = useMediaQuery({ maxWidth: 768 });

//   useEffect(() => {
//     if (localStorage.getItem("fileUploaded") === "true") {
//       setFileUploadedLocal(true);
//     }
//   }, []);

//   const steps = useMemo(() => {
//     const step1Done = fileUploaded || fileUploadedLocal;

//     const manual = [
//       { id: 1, completed: step1Done, enabled: true, action: () => setActivePopup(1) },
//       { id: 2, completed: !!integrationMethod, enabled: step1Done },
//       { id: 3, completed: profileExists, enabled: !!integrationMethod, action: () => setActivePopup(2) },
//       { id: 4, completed: mtdUploaded, enabled: profileExists, action: () => setActivePopup(3) },
//     ];
//     const amazon = [
//       { id: 1, completed: step1Done, enabled: true, action: () => setActivePopup(1) },
//       { id: 2, completed: !!integrationMethod && amazonConnected, enabled: step1Done },
//       { id: 3, completed: mtdUploaded, enabled: !!integrationMethod && amazonConnected, action: () => setActivePopup(3) },
//     ];
//     return integrationMethod === "amazon" ? amazon : manual;
//   }, [integrationMethod, amazonConnected, fileUploaded, fileUploadedLocal, profileExists, mtdUploaded]);

//   const chooseIntegration = (key: "amazon" | "shopify") => {
//     setIntegrationMethod(key);
//     localStorage.setItem(LS_KEYS.integrationMethod, key);
//     setActivePopup(null);
//     if (key === "amazon") setShowAmazonConnect(true);
//     if (key === "shopify") setShowShopifyConnect(true);
//   };

//   return (
//     <div className="font-lato bg-white box-border">
//       <h2 className="text-[#414042] font-semibold text-lg md:text-xl mb-4">
//         Start your Journey with Phormula!
//       </h2>

//       <Step1ProductList
//         completed={steps[0].completed}
//         onOpen={() => steps[0].enabled && steps[0].action?.()}
//       />

//       <Step2Integration
//         locked={!steps[1].enabled}
//         completed={steps[1].completed}
//         onChoose={chooseIntegration}
//       />

//       {integrationMethod === "manual" && (
//         <>
//           <Step3FeePreview
//             enabled={steps[2].enabled}
//             completed={steps[2].completed}
//             onOpen={() => steps[2].enabled && steps[2].action?.()}
//           />

//           {/* IMPORTANT: pass selectedCountry and capture which button was clicked */}
//           <Step4MTD
//             enabled={steps[3]?.enabled}
//             completed={steps[3]?.completed}
//             selectedCountry={selectedCountry}
//             onOpenForCountry={(code) => {
//               // only allow current country, Step4 already guards that, but be explicit:
//               if (code !== selectedCountry) return;
//               setMtdCountry(code);       // << remember which country was clicked
//               setActivePopup(3);         // open modal
//             }}
//           />
//         </>
//       )}

//       {/* Step 1 modal */}
//       {activePopup === 1 && (
//         <Modal
//           isOpen
//           onClose={() => setActivePopup(null)}
//         className="m-4 max-w-[900px]"
//           showCloseButton
//         >
//             <div className="relative w-full rounded-3xl bg-white p-4 no-scrollbar dark:bg-gray-900 lg:p-11">
//           <SkuMultiCountryUpload
//             onClose={() => setActivePopup(null)}
//             onComplete={() => {
//               setFileUploadedLocal(true);
//               localStorage.setItem("fileUploaded", "true");
//               window.dispatchEvent(new CustomEvent("inventory:productListUploaded"));
//               setActivePopup(null);
//             }}
//           />
//           </div>
//         </Modal>
//       )}

//       {/* Step 3 modal (Fee Preview) */}
//       {activePopup === 2 && (
//         <Modal
//           isOpen
//           onClose={() => setActivePopup(null)}
//           className="m-4 max-w-[800px]"
//           showCloseButton
//         >  <div className="relative w-full rounded-3xl bg-white p-4 no-scrollbar dark:bg-gray-900 lg:p-11">
//           <FeepreviewUpload country={selectedCountry} onClose={() => setActivePopup(null)} />
//              </div>
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
//           {/* PASS THE COUNTRY HERE */}
//           <FileUploadForm
//             initialCountry={mtdCountry || selectedCountry}
//             onClose={() => {
//               setActivePopup(null);
//             }}
//             onComplete={() => {
//               // mark MTD step done
//               setMtdUploaded(true);
//               localStorage.setItem(LS_KEYS.mtdDone(selectedCountry), "true");
//               setActivePopup(null);
//             }}
//           />
//         </Modal>
//       )}

//       {/* Amazon connect modal */}
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
//               localStorage.setItem("amazonRefreshToken", String(refreshToken ?? ""));
//               setShowAmazonConnect(false);
//             }}
//             onChooseManual={() => {
//               setShowAmazonConnect(false);
//               setIntegrationMethod("manual");
//               localStorage.setItem(LS_KEYS.integrationMethod, "manual");
//             }}
//           />
//         </Modal>
//       )}

//       {showShopifyConnect && (
//         <ConnectShopifyModal onClose={() => setShowShopifyConnect(false)} />
//       )}
//     </div>
//   );
// }


























// IntegrationDashboard.tsx

"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";

import { useIntegrationProgress, LS_KEYS } from "./useIntegrationProgress";

import { Step1ProductList } from "./steps/Step1ProductList";
import { Step2Integration } from "./steps/Step2Integration";
import { Step3FeePreview } from "./steps/Step3FeePreview";
import { Step4MTD } from "./steps/Step4MTD";

import SkuMultiCountryUpload from "@/components/ui/modal/SkuMultiCountryUpload";
import FeepreviewUpload from "@/components/ui/modal/FeepreviewUpload";

import AmazonConnect from "./AmazonConnect";
import AmazonConnectLegacy from "./AmazonConnectLegacy"; // ← NEW
import { Modal } from "@/components/ui/modal";
import FileUploadForm from "@/app/(admin)/(ui-elements)/modals/FileUploadForm";
import ConnectShopifyModal from "./ConnectShopifyModal";

type Origin = "header" | "page";

export default function IntegrationDashboard() {
  const { countryName } = useParams<{ countryName: string }>();
  const selectedCountry = (countryName || "").toLowerCase();

  const {
    fileUploaded,
    profileExists,
    integrationMethod,
    setIntegrationMethod,
    amazonConnected,
    mtdUploaded,
    setMtdUploaded,
  } = useIntegrationProgress(selectedCountry);

  const [activePopup, setActivePopup] = useState<number | null>(null);
  const [showAmazonConnect, setShowAmazonConnect] = useState(false);
  const [showAmazonLegacyConnect, setShowAmazonLegacyConnect] = useState(false); // ← NEW
  const [showShopifyConnect, setShowShopifyConnect] = useState(false);
  const [fileUploadedLocal, setFileUploadedLocal] = useState(false);

  // which country was clicked in Step 4
  const [mtdCountry, setMtdCountry] = useState<string>("");

  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    if (localStorage.getItem("fileUploaded") === "true") {
      setFileUploadedLocal(true);
    }
  }, []);

  // Listen for Integration choices coming from the Header's IntegrationsModal
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ provider: "amazon" | "shopify"; origin?: Origin }>;
      const { provider, origin = "header" } = custom.detail || {};
      if (!provider) return;
      chooseIntegration(provider, origin);
    };
    // @ts-ignore - CustomEvent name
    window.addEventListener("integration:choose", handler);
    return () => {
      // @ts-ignore
      window.removeEventListener("integration:choose", handler);
    };
  }, []);

  const steps = useMemo(() => {
    const step1Done = fileUploaded || fileUploadedLocal;

    const manual = [
      { id: 1, completed: step1Done, enabled: true, action: () => setActivePopup(1) },
      { id: 2, completed: !!integrationMethod, enabled: step1Done },
      { id: 3, completed: profileExists, enabled: !!integrationMethod, action: () => setActivePopup(2) },
      { id: 4, completed: mtdUploaded, enabled: profileExists, action: () => setActivePopup(3) },
    ];
    const amazon = [
      { id: 1, completed: step1Done, enabled: true, action: () => setActivePopup(1) },
      { id: 2, completed: !!integrationMethod && amazonConnected, enabled: step1Done },
      { id: 3, completed: mtdUploaded, enabled: !!integrationMethod && amazonConnected, action: () => setActivePopup(3) },
    ];
    return integrationMethod === "amazon" ? amazon : manual;
  }, [integrationMethod, amazonConnected, fileUploaded, fileUploadedLocal, profileExists, mtdUploaded]);

  // UPDATED: accept an origin to branch the flow
  const chooseIntegration = (key: "amazon" | "shopify", origin: Origin = "page") => {
    setIntegrationMethod(key);
    localStorage.setItem(LS_KEYS.integrationMethod, key);
    setActivePopup(null);

    if (key === "amazon") {
      if (origin === "header") {
        // Skip AmazonConnect; open Legacy directly
        setShowAmazonLegacyConnect(true);
      } else {
        // Default Step 2 flow: show AmazonConnect first
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

      <Step1ProductList
        completed={steps[0].completed}
        onOpen={() => steps[0].enabled && steps[0].action?.()}
      />

      <Step2Integration
        locked={!steps[1].enabled}
        completed={steps[1].completed}
        onChoose={(key) => chooseIntegration(key, "page")}
      />

      {integrationMethod === "manual" && (
        <>
          <Step3FeePreview
            enabled={steps[2].enabled}
            completed={steps[2].completed}
            onOpen={() => steps[2].enabled && steps[2].action?.()}
          />

          {/* Pass selectedCountry and capture which button was clicked */}
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

      {/* Step 1 modal */}
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
              onComplete={() => {
                setFileUploadedLocal(true);
                localStorage.setItem("fileUploaded", "true");
                window.dispatchEvent(new CustomEvent("inventory:productListUploaded"));
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
            <FeepreviewUpload country={selectedCountry} onClose={() => setActivePopup(null)} />
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
              localStorage.setItem(LS_KEYS.mtdDone(selectedCountry), "true");
              setActivePopup(null);
            }}
          />
        </Modal>
      )}

      {/* Amazon connect modal (Step 2/page flow) */}
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
              localStorage.setItem("amazonRefreshToken", String(refreshToken ?? ""));
              setShowAmazonConnect(false);
              // If you want Connect → Legacy, uncomment next line:
              // setShowAmazonLegacyConnect(true);
            }}
            onChooseManual={() => {
              setShowAmazonConnect(false);
              setIntegrationMethod("manual");
              localStorage.setItem(LS_KEYS.integrationMethod, "manual");
            }}
          />
        </Modal>
      )}

      {/* Amazon LEGACY connect modal (Header flow) */}
      {/* {showAmazonLegacyConnect && (
        <Modal
          isOpen
          onClose={() => setShowAmazonLegacyConnect(false)}
          className="m-4 max-w-xl"
          showCloseButton
        >
          <AmazonConnectLegacy
            onClose={() => setShowAmazonLegacyConnect(false)}
            onConnected={(refreshToken?: string) => {
              localStorage.setItem("amazonRefreshToken", String(refreshToken ?? ""));
              setShowAmazonLegacyConnect(false);
            }}
          />
        </Modal>
      )} */}

      {/* Amazon LEGACY connect modal (Header flow) */}
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
              localStorage.setItem("amazonRefreshToken", String(refreshToken ?? ""));
              setShowAmazonLegacyConnect(false);
            }}
            hideBack                  // 👈 NEW: tell Legacy to hide its back button
            backLabel="Close"         // 👈 (optional) if you want the button to appear as "Close"
            onBack={() => {           // 👈 (optional) if the component still renders a back/close control
              setShowAmazonLegacyConnect(false);
            }}
          />
        </Modal>
      )}


      {showShopifyConnect && (
        <ConnectShopifyModal onClose={() => setShowShopifyConnect(false)} />
      )}
    </div>
  );
}
