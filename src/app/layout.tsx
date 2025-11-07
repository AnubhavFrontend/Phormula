import "./globals.css";
import { Lato } from "next/font/google";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Providers from "./providers";
import { Toaster } from "sonner";

// 🆕 Replace Outfit with Lato
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"], // adjust to the weights you use
  variable: "--font-lato",              // expose CSS variable
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lato.variable}>
      <body className={`font-sans dark:bg-gray-900`}>
        <Providers>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </Providers>

        {/* 👇 Global toaster */}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
