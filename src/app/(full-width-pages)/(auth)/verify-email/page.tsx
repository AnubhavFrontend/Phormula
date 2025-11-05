
import VerifyEmail from "@/components/auth/VerifyEmail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | Auth",
  description: "Email verification status screen",
};

export default function VerifyEmailPage() {
  return <VerifyEmail />;
}
