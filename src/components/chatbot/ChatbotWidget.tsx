"use client";
import { useState } from "react";
import ChatbotCore from "./ChatbotCore";
import { RiExpandDiagonalSLine } from "react-icons/ri";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useGetUserDataQuery } from "@/lib/api/profileApi";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const { data: userData } = useGetUserDataQuery();

  const router = useRouter();
  const pathname = usePathname(); // 👈 important

  // ✅ If user is already on chatbot page, DO NOT render widget
  if (pathname?.startsWith("/chatbot")) {
    return null;
  }

  return (
    <>
      {/* Floating Icon */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] hover:scale-105 transition-transform"
      >
        <img
          src="/Chatbot.png"
          alt="Chatbot"
          className="w-16 h-16 object-contain"
        />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[10000] pointer-events-none">
          <div
            className="pointer-events-auto fixed bottom-20 right-4
                       w-[360px] h-[520px] bg-white rounded-2xl shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 text-white rounded-t-2xl"
                 style={{
                   background:
                     "linear-gradient(180deg, #5EA68E 12.02%, #37455F 100%)",
                 }}
            >
              <div>
                <p className="font-semibold text-sm">
                  Hi {userData?.company_name || "there"}
                </p>
                <p className="text-[11px] opacity-90">
                  Analytics Assistant
                </p>
              </div>

              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* Chat */}
            <ChatbotCore />
          </div>
        </div>
      )}
    </>
  );
}
