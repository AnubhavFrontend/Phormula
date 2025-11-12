// import GridShape from "@/components/common/GridShape";
// import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

// import { ThemeProvider } from "@/context/ThemeContext";
// import Image from "next/image";
// import Link from "next/link";
// import React from "react";

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
//       <ThemeProvider>
//         <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
//           {children}
//           <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
//             <div className="relative items-center justify-center  flex z-1">

//               <div className="flex flex-col items-center max-w-xs">
//                 <Link href="/" className="block mb-4">
//                   <Image
//                     width={231}
//                     height={48}
//                     src="./images/logo/auth-logo.svg"
//                     alt="Logo"
//                   />
//                 </Link>
//                 <p className="text-center text-gray-400 dark:text-white/60">
//                   Free and Open-Source Tailwind CSS Admin Dashboard Template
//                 </p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </ThemeProvider>
//     </div>
//   );
// }









"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const LeftPanel = () => {
    // ---------- SIGN UP (poster with heading and image) ----------
    if (pathname.includes("signup")) {
      return (
        <div className="relative h-screen w-full bg-green-500 flex flex-col justify-end px-6">
          {/* Logo - top left */}
          <Link href="/" className="fixed left-6 top-6 z-20">
            <Image
              width={220}
              height={40}
              src="/images/auth/Phormula.png"
              alt="Phormula"
              priority
            />
          </Link>

          {/* Centered content */}
          <div className="flex flex-col text-right">
            {/* Heading */}
            <h1 className="text-charcoal-500 text-xl sm:text-xl lg:text-5xl font-semibold leading-tight mt-12">
              Trusted Finance Partner
              <br />
              for <span className="text-yellow-200">D2C Entrepreneurs</span>
            </h1>

            {/* Illustration */}
            <div className="relative w-full h-[480px] sm:h-[480px] flex items-center justify-center overflow-hidden">
              <Image
                src="/images/auth/signup.png"
                alt="Trusted Finance partner for D2C Entrepreneur"
                width={800}
                height={500}
                className="object-contain w-auto h-full"
                priority
              />
            </div>

          </div>
        </div>
      );
    }

    // ---------- SIGN IN (dashboard with heading + image) ----------
    if (pathname.includes("signin")) {
      return (
       <div className="relative h-screen w-full bg-green-500 flex flex-col justify-end px-6">
          {/* Logo - top left */}
          <Link href="/" className="fixed left-6 top-6 z-20">
            <Image
              width={150}
              height={40}
              src="/images/auth/Phormula.png"
              alt="Phormula"
              priority
            />
          </Link>

          {/* Heading */}
          <div className="flex flex-col text-right">
            {/* Heading */}
            <h1 className="text-charcoal-500 text-xl sm:text-xl lg:text-5xl font-semibold leading-tight mt-12">
              Built for Founders,
              <br />
              Powered by <span className="text-yellow-200">Insight</span>
            </h1>
          </div>

          {/* Illustration below heading */}
          <div className="mt-10">
            <div className="relative w-full max-w-[760px] aspect-[16/10] rounded-3xl shadow-2xl">
              <Image
                src="/images/auth/signin.png"
                alt="Performance Analysis dashboard"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      );
    };

    // ---------- Choose Country ----------
    if (pathname.includes("choose-country")) {
      return (
       <div className="relative h-screen w-full bg-green-500 flex flex-col justify-end px-6">
          {/* Logo - top left */}
          <Link href="/" className="fixed left-6 top-6 z-20">
            <Image
              width={150}
              height={40}
              src="/images/auth/Phormula.png"
              alt="Phormula"
              priority
            />
          </Link>

          {/* Heading */}
          <div className="flex flex-col text-right">
            {/* Heading */}
            <h1 className="text-charcoal-500 text-xl sm:text-xl lg:text-5xl font-semibold leading-tight mt-12">
             Control Expenses with
              <br />
              <span className="text-yellow-200">Auto Marketplace Recons</span>
            </h1>
          </div>

          {/* Illustration below heading */}
          <div className="mt-10">
            <div className="relative w-full max-w-[760px] aspect-[16/10] rounded-3xl shadow-2xl">
              <Image
                src="/images/auth/choosecountry.png"
                alt="Performance Analysis dashboard"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      );
    };

    // ---------- Brand ----------
    if (pathname.includes("brand")) {
      return (
       <div className="relative h-screen w-full bg-green-500 flex flex-col justify-end px-6">
          {/* Logo - top left */}
          <Link href="/" className="fixed left-6 top-6 z-20">
            <Image
              width={150}
              height={40}
              src="/images/auth/Phormula.png"
              alt="Phormula"
              priority
            />
          </Link>

          {/* Heading */}
          <div className="flex flex-col text-right">
            {/* Heading */}
            <h1 className="text-charcoal-500 text-xl sm:text-xl lg:text-5xl font-semibold leading-tight mt-12">
             CXO’s tool for&nbsp; 
              <span className="text-yellow-200">Faster Decisions</span>
            </h1>
          </div>

          {/* Illustration below heading */}
          <div className="mt-10">
            <div className="relative w-full max-w-[760px] aspect-[16/10] rounded-3xl shadow-2xl">
              <Image
                src="/images/auth/brand.png"
                alt="Performance Analysis dashboard"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      );
    };

    // ---------- Revenue ----------
    if (pathname.includes("chooserevenue")) {
      return (
       <div className="relative h-screen w-full bg-green-500 flex flex-col justify-end px-6">
          {/* Logo - top left */}
          <Link href="/" className="fixed left-6 top-6 z-20">
            <Image
              width={150}
              height={40}
              src="/images/auth/Phormula.png"
              alt="Phormula"
              priority
            />
          </Link>

          {/* Heading */}
          <div className="flex flex-col text-right">
            {/* Heading */}
            <h1 className="text-charcoal-500 text-xl sm:text-xl lg:text-5xl font-semibold leading-tight mt-12">
             See. <span className="text-yellow-200">Forecast. </span>Win.
            </h1>
          </div>

          {/* Illustration below heading */}
          <div className="mt-10">
            <div className="relative w-full max-w-[760px] aspect-[16/10] rounded-3xl shadow-2xl">
              <Image
                src="/images/auth/revenue.png"
                alt="Performance Analysis dashboard"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      );
    };
  }

  return (
    <div className="relative p-6 bg-white  sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">

          {/* Right Panel */}
          <div className="lg:w-1/2 w-full h-full bg-green-500 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center flex z-1">
              <LeftPanel />
            </div>
          </div>

          {children}


        </div>
      </ThemeProvider>
    </div>
  );
}
