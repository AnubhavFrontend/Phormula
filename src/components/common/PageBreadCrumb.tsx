import React from "react";

interface BreadcrumbProps {
  pageTitle: string;
  /** Choose which color style to use */
  variant?: "page" | "table";
  /** Optional: tweak alignment if needed later */
  align?: "center" | "left" | "right";
  className?: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  pageTitle,
  variant = "page",
  align = "center",
  className = "font-bold",
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

  return (
    <div className={`flex flex-col ${alignWrap[align]} mb-8`}>
      <h2 className={`text-3xl font-semibold ${colorByVariant[variant]} ${className}`}>
        {pageTitle}
      </h2>
    </div>
  );
};

export default PageBreadcrumb;
