// "use client";
// import React, { useEffect, useRef, useState,useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname, useRouter } from "next/navigation";
// import { useSidebar } from "../context/SidebarContext";
// import {
//   BoxCubeIcon,
//   CalenderIcon,
//   ChevronDownIcon,
//   GridIcon,
//   HorizontaLDots,
//   ListIcon,
//   PageIcon,
//   PieChartIcon,
//   PlugInIcon,
//   TableIcon,
//   UserCircleIcon,
// } from "../icons/index";

// import RegionSelect, { RegionOption } from "@/components/sidebar/RegionSelect";
// import { useGetProfileCountriesQuery, useGetUploadHistoryQuery } from "@/lib/api/feePreviewApi";
// import { buildRegionOptions } from "@/lib/utils/region";
// import { handleRegionChangeNext } from "@/lib/utils/handleRegionChange-next";


// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
// };

// const navItems: NavItem[] = [
//   {
//     icon: <GridIcon />,
//     name: "Dashboard",
//     subItems: [{ name: "Ecommerce", path: "/", pro: false }],
//   },
//   {
//     icon: <CalenderIcon />,
//     name: "Calendar",
//     path: "/calendar",
//   },
//   {
//     icon: <UserCircleIcon />,
//     name: "User Profile",
//     path: "/profile",
//   },

//   {
//     name: "Forms",
//     icon: <ListIcon />,
//     subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
//   },
//   {
//     name: "Tables",
//     icon: <TableIcon />,
//     subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
//   },
//   {
//     name: "Pages",
//     icon: <PageIcon />,
//     subItems: [
//       { name: "Blank Page", path: "/blank", pro: false },
//       { name: "404 Error", path: "/error-404", pro: false },
//     ],
//   },
// ];

// const othersItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Charts",
//     subItems: [
//       { name: "Line Chart", path: "/line-chart", pro: false },
//       { name: "Bar Chart", path: "/bar-chart", pro: false },
//     ],
//   },
//   {
//     icon: <BoxCubeIcon />,
//     name: "UI Elements",
//     subItems: [
//       { name: "Alerts", path: "/alerts", pro: false },
//       { name: "Avatar", path: "/avatars", pro: false },
//       { name: "Badge", path: "/badge", pro: false },
//       { name: "Buttons", path: "/buttons", pro: false },
//       { name: "Images", path: "/images", pro: false },
//       { name: "Videos", path: "/videos", pro: false },
//     ],
//   },
//   {
//     icon: <PlugInIcon />,
//     name: "Authentication",
//     subItems: [
//       { name: "Sign In", path: "/signin", pro: false },
//       { name: "Sign Up", path: "/signup", pro: false },
//     ],
//   },
// ];

// const dashboardItems: NavItem[] = [
//    {
//     icon: <CalenderIcon />,
//     name: "Dashboard",
//     path: "/",
//   },
//    {
//     icon: <CalenderIcon />,
//     name: "Profit and Expense",
//     path: "/country/${QTD}/${countryName}/${month}/${year}",
//   },
//    {
//     icon: <CalenderIcon />,
//     name: "SKU-Wise Profit",
//     path: "/",
//   },
//    {
//     icon: <CalenderIcon />,
//     name: "Cash Flow",
//     path: "/",
//   },
//   // {
//   //   icon: <BoxCubeIcon />,
//   //   name: "UI Elements",
//   //   subItems: [
//   //     { name: "Alerts", path: "/alerts", pro: false },
//   //     { name: "Avatar", path: "/avatars", pro: false },
//   //     { name: "Badge", path: "/badge", pro: false },
//   //     { name: "Buttons", path: "/buttons", pro: false },
//   //     { name: "Images", path: "/images", pro: false },
//   //     { name: "Videos", path: "/videos", pro: false },
//   //   ],
//   // },
//   // {
//   //   icon: <PlugInIcon />,
//   //   name: "Authentication",
//   //   subItems: [
//   //     { name: "Sign In", path: "/signin", pro: false },
//   //     { name: "Sign Up", path: "/signup", pro: false },
//   //   ],
//   // },
// ];

// const AppSidebar: React.FC = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const pathname = usePathname();
//   const router = useRouter();

//     // ===== Region data from RTK Query (only countries user has) =====
//   const { data: countriesData } = useGetProfileCountriesQuery();
//   const { data: uploadsData } = useGetUploadHistoryQuery();
//   const countryList = countriesData?.countries ?? [];
//   const uploadHistory = uploadsData?.uploads ?? [];
//   const regionOptions: RegionOption[] = buildRegionOptions(countryList);

//   // ===== Selected country =====
//   const [selectedCountry, setSelectedCountry] = useState<string>(() => {
//     // prefer saved choice if exists
//     if (typeof window !== "undefined") {
//       const saved = localStorage.getItem("selectedCountry");
//       if (saved) return saved;
//     }
//     // else first option or "us" fallback
//     return regionOptions[0]?.value ?? "us";
//   });

// // keep in sync if countries load later / first time
//   useEffect(() => {
//     if (!regionOptions.length) return;
//     if (!selectedCountry || !regionOptions.find(o => o.value === selectedCountry)) {
//       setSelectedCountry(regionOptions[0].value);
//     }
//   }, [regionOptions, selectedCountry]);

//   const onRegionChange = (val: string) => {
//     setSelectedCountry(val);
//     if (typeof window !== "undefined") {
//       localStorage.setItem("selectedCountry", val);
//       localStorage.removeItem("chatHistory");
//     }
//     handleRegionChangeNext({
//       value: val,
//       ranged: undefined, // default "QTD" inside util; set if you want.
//       uploadHistory,
//       push: router.push,
//       onAddMore: () => router.push("/settings/countries"), // change to your "add more" page
//       onBeforeNavigate: () => localStorage.removeItem("chatHistory"),
//     });
//   };


//   const renderMenuItems = (
//     navItems: NavItem[],
//     menuType: "main" | "others"
//   ) => (
//     <ul className="flex flex-col gap-4">
//       {navItems.map((nav, index) => (
//         <li key={nav.name}>
//           {nav.subItems ? (
//             <button
//               onClick={() => handleSubmenuToggle(index, menuType)}
//               className={`menu-item group  ${
//                 openSubmenu?.type === menuType && openSubmenu?.index === index
//                   ? "menu-item-active"
//                   : "menu-item-inactive"
//               } cursor-pointer ${
//                 !isExpanded && !isHovered
//                   ? "lg:justify-center"
//                   : "lg:justify-start"
//               }`}
//             >
//               <span
//                 className={` ${
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? "menu-item-icon-active"
//                     : "menu-item-icon-inactive"
//                 }`}
//               >
//                 {nav.icon}
//               </span>
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <span className={`menu-item-text`}>{nav.name}</span>
//               )}
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <ChevronDownIcon
//                   className={`ml-auto w-5 h-5 transition-transform duration-200  ${
//                     openSubmenu?.type === menuType &&
//                     openSubmenu?.index === index
//                       ? "rotate-180 text-brand-500"
//                       : ""
//                   }`}
//                 />
//               )}
//             </button>
//           ) : (
//             nav.path && (
//               <Link
//                 href={nav.path}
//                 className={`menu-item group ${
//                   isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
//                 }`}
//               >
//                 <span
//                   className={`${
//                     isActive(nav.path)
//                       ? "menu-item-icon-active"
//                       : "menu-item-icon-inactive"
//                   }`}
//                 >
//                   {nav.icon}
//                 </span>
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className={`menu-item-text`}>{nav.name}</span>
//                 )}
//               </Link>
//             )
//           )}
//           {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
//             <div
//               ref={(el) => {
//                 subMenuRefs.current[`${menuType}-${index}`] = el;
//               }}
//               className="overflow-hidden transition-all duration-300"
//               style={{
//                 height:
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? `${subMenuHeight[`${menuType}-${index}`]}px`
//                     : "0px",
//               }}
//             >
//               <ul className="mt-2 space-y-1 ml-9">
//                 {nav.subItems.map((subItem) => (
//                   <li key={subItem.name}>
//                     <Link
//                       href={subItem.path}
//                       className={`menu-dropdown-item ${
//                         isActive(subItem.path)
//                           ? "menu-dropdown-item-active"
//                           : "menu-dropdown-item-inactive"
//                       }`}
//                     >
//                       {subItem.name}
//                       <span className="flex items-center gap-1 ml-auto">
//                         {subItem.new && (
//                           <span
//                             className={`ml-auto ${
//                               isActive(subItem.path)
//                                 ? "menu-dropdown-badge-active"
//                                 : "menu-dropdown-badge-inactive"
//                             } menu-dropdown-badge `}
//                           >
//                             new
//                           </span>
//                         )}
//                         {subItem.pro && (
//                           <span
//                             className={`ml-auto ${
//                               isActive(subItem.path)
//                                 ? "menu-dropdown-badge-active"
//                                 : "menu-dropdown-badge-inactive"
//                             } menu-dropdown-badge `}
//                           >
//                             pro
//                           </span>
//                         )}
//                       </span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </li>
//       ))}
//     </ul>
//   );

//   const [openSubmenu, setOpenSubmenu] = useState<{
//     type: "main" | "others";
//     index: number;
//   } | null>(null);
//   const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
//     {}
//   );
//   const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   // const isActive = (path: string) => path === pathname;
//    const isActive = useCallback((path: string) => path === pathname, [pathname]);

//   useEffect(() => {
//     // Check if the current path matches any submenu item
//     let submenuMatched = false;
//     ["main", "others"].forEach((menuType) => {
//       const items = menuType === "main" ? navItems : othersItems;
//       items.forEach((nav, index) => {
//         if (nav.subItems) {
//           nav.subItems.forEach((subItem) => {
//             if (isActive(subItem.path)) {
//               setOpenSubmenu({
//                 type: menuType as "main" | "others",
//                 index,
//               });
//               submenuMatched = true;
//             }
//           });
//         }
//       });
//     });

//     // If no submenu item matches, close the open submenu
//     if (!submenuMatched) {
//       setOpenSubmenu(null);
//     }
//   }, [pathname,isActive]);

//   useEffect(() => {
//     // Set the height of the submenu items when the submenu is opened
//     if (openSubmenu !== null) {
//       const key = `${openSubmenu.type}-${openSubmenu.index}`;
//       if (subMenuRefs.current[key]) {
//         setSubMenuHeight((prevHeights) => ({
//           ...prevHeights,
//           [key]: subMenuRefs.current[key]?.scrollHeight || 0,
//         }));
//       }
//     }
//   }, [openSubmenu]);

//   const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
//     setOpenSubmenu((prevOpenSubmenu) => {
//       if (
//         prevOpenSubmenu &&
//         prevOpenSubmenu.type === menuType &&
//         prevOpenSubmenu.index === index
//       ) {
//         return null;
//       }
//       return { type: menuType, index };
//     });
//   };

//   return (
//     <aside
//       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 
//         ${
//           isExpanded || isMobileOpen
//             ? "w-[290px]"
//             : isHovered
//             ? "w-[290px]"
//             : "w-[90px]"
//         }
//         ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0`}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div
//         className={`py-8 flex  ${
//           !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//         }`}
//       >
//         <Link href="/">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               <Image
//                 className="dark:hidden"
//                 src="/images/logo/Logo_Phormula.png"
//                 alt="Logo"
//                 width={240}
//                 height={40}
//               />
//               <Image
//                 className="hidden dark:block"
//                 src="/images/logo/logo-dark.svg"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//             </>
//           ) : (
//             <Image
//               src="/images/logo/Logo_small.png"
//               alt="Logo"
//               width={50}
//               height={50}
//             />
//           )}
//         </Link>
//       </div>

// {(isExpanded || isHovered || isMobileOpen) && regionOptions.length > 0 && (
//         <RegionSelect
//           selectedCountry={selectedCountry}
//           options={regionOptions}
//           onChange={onRegionChange}
//           className="mb-2"
//         />
//       )}

//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">
//            {/* Dashboard Items section */}
// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//       !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//     }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? "Dashboard" : <HorizontaLDots />}
//   </h2>
//   {renderMenuItems(dashboardItems, "main")}
// </div>


//             <div>
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "justify-start"
//                 }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Menu"
//                 ) : (
//                   <HorizontaLDots />
//                 )}
//               </h2>
//               {renderMenuItems(navItems, "main")}
//             </div>

//             <div className="">
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "justify-start"
//                 }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Others"
//                 ) : (
//                   <HorizontaLDots />
//                 )}
//               </h2>
//               {renderMenuItems(othersItems, "others")}
//             </div>
//           </div>
//         </nav>
//         {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;




























"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";
import { GiTakeMyMoney } from "react-icons/gi";

import RegionSelect, { RegionOption } from "@/components/sidebar/RegionSelect";
import { useGetProfileCountriesQuery, useGetUploadHistoryQuery } from "@/lib/api/feePreviewApi";
import { buildRegionOptions } from "@/lib/utils/region";
import { handleRegionChangeNext } from "@/lib/utils/handleRegionChange-next";

/* ---------- Types (updated) ---------- */
type PathParams = { ranged: string; countryName: string; month: string; year: string; productname?: string };

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string | ((p: PathParams) => string);
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

/* ---------- Static sections (unchanged) ---------- */
const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
  {
    name: "Forms",
    icon: <ListIcon />,
    subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
  {
    name: "Tables",
    icon: <TableIcon />,
    subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  },
  {
    name: "Pages",
    icon: <PageIcon />,
    subItems: [
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

/* ---------- Month helper ---------- */
const monthNames = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const routeParams = useParams<{ ranged?: string; countryName?: string; month?: string; year?: string }>();

  // ===== Region data from RTK Query (only countries user has) =====
  const { data: countriesData } = useGetProfileCountriesQuery();
  const { data: uploadsData } = useGetUploadHistoryQuery();
  const countryList = countriesData?.countries ?? [];
  const uploadHistory = uploadsData?.uploads ?? [];
  const regionOptions: RegionOption[] = buildRegionOptions(countryList);

  // ===== Selected country =====
  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedCountry");
      if (saved) return saved;
    }
    return regionOptions[0]?.value ?? "us";
  });

  // keep in sync if countries load later / first time
  useEffect(() => {
    if (!regionOptions.length) return;
    if (!selectedCountry || !regionOptions.find((o) => o.value === selectedCountry)) {
      setSelectedCountry(regionOptions[0].value);
    }
  }, [regionOptions, selectedCountry]);

  const onRegionChange = (val: string) => {
    setSelectedCountry(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedCountry", val);
      localStorage.removeItem("chatHistory");
    }
    handleRegionChangeNext({
      value: val,
      ranged: undefined, // default handled in util
      uploadHistory,
      push: router.push,
      onAddMore: () => router.push("/settings/countries"),
      onBeforeNavigate: () => localStorage.removeItem("chatHistory"),
    });
  };

  /* ---------- Build current params for dynamic links ---------- */
  const now = new Date();
  const defaultMonth = monthNames[now.getMonth()];
  const defaultYear = String(now.getFullYear());

  const currentParams: PathParams = {
    ranged: (routeParams?.ranged as string) || "QTD",
    countryName: (routeParams?.countryName as string) || selectedCountry || "us",
    month: (routeParams?.month as string) || defaultMonth,
    year: (routeParams?.year as string) || defaultYear,
  };

  /* ---------- Dashboard items (now with function path) ---------- */
  const dashboardItems: NavItem[] = [
    {
      icon: <CalenderIcon />,
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <GiTakeMyMoney />,
      name: "Profit and Expense",
      path: ({ ranged, countryName, month, year }) => `/country/${ranged}/${countryName}/${month}/${year}`,
    },
    {
      icon: <GiTakeMyMoney />,
      name: "SKU-Wise Profit",
      path: ({
        productname,
        countryName,
        month,
        year }
      ) => `/productwiseperformance/${productname}/${countryName}/${month}/${year}`,
    },
    {
      icon: <CalenderIcon />,
      name: "Cash Flow",
      path: ({
        countryName,
        month,
        year,
      }: {
        countryName: string;
        month: string;
        year: string;
      }) =>
        `/cashflow/${encodeURIComponent(countryName)}/${encodeURIComponent(
          month
        )}/${encodeURIComponent(year)}`,
    },
  ];

  /* ---------- Active / submenu logic ---------- */
  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) setOpenSubmenu(null);
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) return null;
      return { type: menuType, index };
    });
  };

  /* ---------- Renderer with dynamic path resolution ---------- */
  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const resolvedPath =
          typeof nav.path === "function" ? nav.path(currentParams) : nav.path;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                  } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                  }`}
              >
                <span
                  className={`${openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                      }`}
                  />
                )}
              </button>
            ) : (
              resolvedPath && (
                <Link
                  href={resolvedPath}
                  className={`menu-item group ${isActive(resolvedPath) ? "menu-item-active" : "menu-item-inactive"
                    }`}
                >
                  <span
                    className={`${isActive(resolvedPath)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                      }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`menu-dropdown-item ${isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                          }`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`ml-auto ${isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`ml-auto ${isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 
        ${isExpanded || isMobileOpen ? "w[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image className="dark:hidden" src="/images/logo/Logo_Phormula.png" alt="Logo" width={240} height={40} />
              <Image className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" width={150} height={40} />
            </>
          ) : (
            <Image src="/images/logo/Logo_small.png" alt="Logo" width={50} height={50} />
          )}
        </Link>
      </div>

      {(isExpanded || isHovered || isMobileOpen) && regionOptions.length > 0 && (
        <RegionSelect
          selectedCountry={selectedCountry}
          options={regionOptions}
          onChange={onRegionChange}
          className="mb-2"
        />
      )}

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Dashboard Items */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Dashboard" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(dashboardItems, "main")}
            </div>

            {/* Menu */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            {/* Others */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Others" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
