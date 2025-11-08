import { useEffect, useState } from "react";
import { useFileUploadStatusQuery, useGetCountryProfileQuery } from "@/lib/api/feePreviewApi";

export const LS_KEYS = {
  integrationMethod: "integrationMethod",
  feePreviewDone: (country?: string) => `feePreviewDone:${(country || "").toLowerCase()}`,
  mtdDone: (country?: string) => `mtdDone:${(country || "").toLowerCase()}`,
};

export function useIntegrationProgress(countryName?: string) {
  const country = (countryName || "").toLowerCase();

  const { data: fileStatus } = useFileUploadStatusQuery();
  const fileUploaded = !!fileStatus?.file_uploaded;

  const { data: profile } = useGetCountryProfileQuery(country, { skip: !country });
  const profileExists = !!profile?.exists;

  const [integrationMethod, setIntegrationMethod] = useState<string | null>(
    () => localStorage.getItem(LS_KEYS.integrationMethod)
  );
  const [mtdUploaded, setMtdUploaded] = useState<boolean>(() =>
    localStorage.getItem(LS_KEYS.mtdDone(country)) === "true"
  );

  const amazonConnected = !!localStorage.getItem("amazonRefreshToken");

  useEffect(() => {
    localStorage.setItem(LS_KEYS.feePreviewDone(country), String(profileExists));
  }, [country, profileExists]);

  return {
    country,
    fileUploaded,
    profileExists,
    integrationMethod,
    setIntegrationMethod,
    amazonConnected,
    mtdUploaded,
    setMtdUploaded,
  };
}
