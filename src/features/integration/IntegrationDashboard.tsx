"use client";

import React, { useMemo, useState } from "react";
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
import { Modal } from "@/components/ui/modal";
import FileUploadForm from "@/app/(admin)/(ui-elements)/modals/FileUploadForm";
import AmazonFinancialDashboard from "./AmazonFinancialDashboard";
import ConnectShopifyModal from "./ConnectShopifyModal";

const regionForCountry = (c: string) =>
    c === "uk" ? "eu-west-1" : c === "us" ? "us-east-1" : "ca-central-1";

export default function IntegrationDashboard() {
    const { countryName } = useParams<{ countryName: string }>();
    const selectedCountry = (countryName || "").toLowerCase();
    const [fileUploadedLocal, setFileUploadedLocal] = useState(false);

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
    const [showShopifyConnect, setShowShopifyConnect] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 768 });

    const steps = useMemo(() => {
        const step1Done = (fileUploaded || fileUploadedLocal);  // 👈 use local flip OR hook value

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


    const chooseIntegration = (key: "amazon" | "shopify") => {
        setIntegrationMethod(key);
        localStorage.setItem(LS_KEYS.integrationMethod, key);
        setActivePopup(null);
        if (key === "amazon") setShowAmazonConnect(true);
        if (key === "shopify") setShowShopifyConnect(true);
    };

    React.useEffect(() => {
        if (localStorage.getItem("fileUploaded") === "true") {
            setFileUploadedLocal(true);
        }
    }, []);


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
                onChoose={chooseIntegration}
            />

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
                        onOpenForCountry={(code) => code === selectedCountry && setActivePopup(3)}
                    />
                </>
            )}

            {/* Step 1 modal */}
            {activePopup === 1 && (
                <Modal
                    isOpen={activePopup === 1}
                    onClose={() => setActivePopup(null)}
                    className="m-4 max-w-sm"
                    showCloseButton
                >
                    <SkuMultiCountryUpload
                        onClose={() => setActivePopup(null)}
                        onComplete={() => {
                            // instant UI unlock
                            setFileUploadedLocal(true);

                            // persist across reloads (the hook / page can also read this)
                            localStorage.setItem("fileUploaded", "true");

                            // optional broadcast for any listeners
                            window.dispatchEvent(new CustomEvent("inventory:productListUploaded"));

                            // close the modal
                            setActivePopup(null);
                        }}
                    />
                </Modal>
            )}


            {/* Step 3 modal (Fee Preview) */}
            {activePopup === 2 && (
                <Modal
                    isOpen={activePopup === 2}
                    onClose={() => setActivePopup(null)}
                    className="m-4 max-w-3xl"
                    showCloseButton
                >
                    <FeepreviewUpload
                        country={selectedCountry}
                        onClose={() => setActivePopup(null)}
                    />
                </Modal>

            )}

            {/* Step 4 modal (MTD Upload) */}
            {activePopup === 3 && (
                <Modal
                    isOpen={activePopup === 3}
                    onClose={() => setActivePopup(null)}
                    className="m-4 max-w-3xl"
                    showCloseButton
                >
                    <FileUploadForm
                        onClose={() => {
                            setMtdUploaded(true);
                            localStorage.setItem(LS_KEYS.mtdDone(selectedCountry), "true");
                            setActivePopup(null);
                        }}
                    />
                </Modal>
            )}

            {showAmazonConnect && (
  <Modal
    isOpen={showAmazonConnect}
    onClose={() => setShowAmazonConnect(false)}
    className="m-4 max-w-xl"
    showCloseButton
  >
    <AmazonConnect
      onClose={() => setShowAmazonConnect(false)}
      onConnected={(refreshToken?: string) => {
        // mark Amazon connected, if your hook listens to localStorage you can store here:
        localStorage.setItem("amazonRefreshToken", String(refreshToken ?? ""));
        // optionally unlock the next step immediately:
        // window.dispatchEvent(new Event("storage"));
        setShowAmazonConnect(false);
      }}
      onChooseManual={() => {
        setShowAmazonConnect(false);
        setIntegrationMethod("manual");
        localStorage.setItem(LS_KEYS.integrationMethod, "manual");
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
