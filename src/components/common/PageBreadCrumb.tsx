// import React from "react";

// interface BreadcrumbProps {
//   pageTitle: string;
//   /** Choose which color style to use */
//   variant?: "page" | "table";
//   /** Optional: tweak alignment if needed later */
//   align?: "center" | "left" | "right";
//    textSize?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
//   className?: string;
// }

// const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
//   pageTitle,
//   variant = "page",
//   align = "center",
//   textSize = "3xl",
//   className = "font-bold ",
// }) => {
//   const colorByVariant: Record<NonNullable<BreadcrumbProps["variant"]>, string> = {
//     page: "text-charcoal-500 dark:text-white/90",
//     table: "text-green-500 dark:text-[#cbd5e1]", 
//   };

//   const alignWrap: Record<NonNullable<BreadcrumbProps["align"]>, string> = {
//     center: "items-center justify-center text-center",
//     left: "items-start justify-start text-left",
//     right: "items-end justify-end text-right",
//   };

//   return (
//     <div className={`flex flex-col ${alignWrap[align]} mb-8`}>
//       <h2 className={`font-bold text-${textSize} ${colorByVariant[variant]} ${className ?? ""}`}>
//         {pageTitle}
//       </h2>
//     </div>
//   );
// };

// export default PageBreadcrumb;










import React from "react";

interface BreadcrumbProps {
  pageTitle: string;
  variant?: "page" | "table";
  align?: "center" | "left" | "right";
  className?: string;
  textSize?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  pageTitle,
  variant = "page",
  align = "center",
  className = "",
  textSize = "2xl",
}) => {
  const colorByVariant: Record<NonNullable<BreadcrumbProps["variant"]>, string> = {
    page: "text-charcoal-500 dark:text-white/90",
    table: "text-green-500 dark:text-[#cbd5e1]",
  };

  const alignWrap: Record<NonNullable<BreadcrumbProps["align"]>, string> = {
    center: "items-center justify-center text-center",
    left: "items-start justify-start text-left",
    right: "items-end justify-end text-right",
  };

  const sizeMap: Record<NonNullable<BreadcrumbProps["textSize"]>, string> = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  };

  return (
    <div className={`flex flex-col ${alignWrap[align]} mb-4`}>
      <h2
        className={`font-bold ${sizeMap[textSize]} ${colorByVariant[variant]} ${className}`}
        dangerouslySetInnerHTML={{ __html: pageTitle }}
      />
    </div>
  );
};

export default PageBreadcrumb;
