"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";

/* ===================== ENV & ENDPOINTS ===================== */
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";
const SHOPIFY_CCY = process.env.NEXT_PUBLIC_SHOPIFY_CURRENCY || "GBP";
const SHOPIFY_TO_GBP = Number(process.env.NEXT_PUBLIC_SHOPIFY_TO_GBP || "1");
const API_URL = `${baseURL}/amazon_api/orders?include=finances`;
const SHOPIFY_ENDPOINT = `${baseURL}/shopify/get_monthly_data`;
const MONTHLY_TARGET_GBP = Number(process.env.NEXT_PUBLIC_MONTHLY_TARGET_GBP || "50000");

/* ===================== DATE HELPERS ===================== */
function getISTYearMonth() {
  const optsMonth: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata", month: "long" };
  const optsYear: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata", year: "numeric" };
  const now = new Date();
  const monthName = now.toLocaleString("en-US", optsMonth);
  const yearStr = now.toLocaleString("en-US", optsYear);
  return { monthName, year: Number(yearStr) };
}

function buildShopifyURL({ year, monthName }: { year: number; monthName: string }) {
  const qs = new URLSearchParams();
  qs.set("year", String(year));
  qs.append("months[]", monthName);
  return `${SHOPIFY_ENDPOINT}?${qs.toString()}`;
}

/* ===================== UI HELPERS ===================== */
const ValueOrSkeleton = ({ loading, children }: { loading: boolean; children: React.ReactNode }) => {
  if (loading) {
    return <span className="inline-block h-6 w-24 animate-pulse rounded bg-gray-200 align-middle" />;
  }
  return <>{children}</>;
};

const fmtCurrency = (val: any, ccy = "GBP") => {
  if (val === null || val === undefined || val === "" || isNaN(Number(val))) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: ccy, maximumFractionDigits: 2 }).format(
    Number(val)
  );
};
const fmtGBP = (val: any) => fmtCurrency(val, "GBP");
const fmtShopify = (val: any) => fmtCurrency(val, SHOPIFY_CCY);

const fmtNum = (val: any) =>
  val === null || val === undefined || val === "" || isNaN(Number(val))
    ? "—"
    : new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(Number(val));
const fmtPct = (val: any) => (val === null || val === undefined || isNaN(Number(val)) ? "—" : `${Number(val).toFixed(2)}%`);

/* ===================== SIMPLE BAR CHART ===================== */
function SimpleBarChart({
  items,
  height = 300,
  padding = { top: 28, right: 24, bottom: 56, left: 24 },
  colors = ["#2563eb", "#16a34a", "#f59e0b", "#ec4899", "#8b5cf6"],
}: {
  items: Array<{ label: string; raw: number; display: string }>;
  height?: number;
  padding?: { top: number; right: number; bottom: number; left: number };
  colors?: string[];
}) {
  const [animateIn, setAnimateIn] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  const width = 760;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const values = items.map((d) => (Number.isFinite(d.raw) ? Math.abs(Number(d.raw)) : 0));
  const max = Math.max(1, ...values);
  const baseBarW = Math.max(12, (innerW / Math.max(1, items.length)) * 0.4);

  const Tooltip = ({
    x,
    y,
    label,
    display,
    color,
  }: {
    x: number;
    y: number;
    label: string;
    display: string;
    color: string;
  }) => {
    const textY1 = y - 30;
    const text = `${label}: ${display}`;
    return (
      <g>
        <rect x={x - 70} y={textY1 - 24} width={140} height={24} rx={6} fill="#111827" opacity="0.9" />
        <text x={x} y={textY1 - 8} textAnchor="middle" fontSize="11" fill="#ffffff" style={{ pointerEvents: "none" }}>
          {text}
        </text>
        <polygon
          points={`${x - 6},${textY1} ${x + 6},${textY1} ${x},${textY1 + 6}`}
          fill="#111827"
          opacity="0.9"
        />
        <circle cx={x} cy={y} r="6.5" fill="none" stroke={color} strokeWidth={2} />
      </g>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[760px] select-none">
        <defs>
          <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.15" />
          </filter>
        </defs>

        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#e5e7eb"
        />

        {items.map((d, i) => {
          const v = values[i];
          const hFull = (v / max) * innerH;
          const barH = animateIn ? hFull : 0;
          const band = innerW / Math.max(1, items.length);
          const xCenter = padding.left + band * i + band / 2;
          const barW = hoverIdx === i ? baseBarW + 6 : baseBarW;
          const x = xCenter - barW / 2;
          const y = padding.top + (innerH - barH);
          const color = colors[i % colors.length];

          return (
            <g
              key={d.label}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(0, barH)}
                rx={8}
                fill={color}
                filter="url(#barShadow)"
                opacity={hoverIdx === i ? 0.95 : 0.85}
              />
              <text x={xCenter} y={y - 10} textAnchor="middle" fontSize={12} fontWeight={600} fill="#111827">
                {d.display}
              </text>
              <text x={xCenter} y={height - padding.bottom + 20} textAnchor="middle" fontSize={12} fill="#6b7280">
                {d.label}
              </text>
              {hoverIdx === i && (
                <Tooltip x={xCenter} y={y} label={d.label} display={d.display} color={color} />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ===================== MONTHLY TARGET GAUGE ===================== */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function MonthlyTargetGauge({
  current,
  target,
  subtitle,
}: {
  current: number;
  target: number;
  subtitle?: string;
}) {
  const pct = target > 0 ? clamp(current / target, 0, 1) : 0;
  const angle = 180 * pct;

  const size = 260;
  const stroke = 16;
  const cx = size / 2;
  const r = size / 2 - stroke;

  const toXY = (angDeg: number) => {
    const rad = (Math.PI / 180) * (180 - angDeg);
    return { x: cx + r * Math.cos(rad), y: size / 2 + r * Math.sin(rad) };
  };

  const start = toXY(0);
  const end = toXY(angle);
  const bgPath = `M ${toXY(0).x} ${toXY(0).y} A ${r} ${r} 0 1 1 ${toXY(180).x} ${toXY(180).y}`;
  const fgPath = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-1 text-sm text-gray-500">Monthly Target</div>
      <div className="text-lg font-semibold">{subtitle || "Amazon + Shopify (GBP)"}</div>

      <div className="mt-3 flex items-center justify-center">
        <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
          <path d={bgPath} fill="none" stroke="#e5e7eb" strokeWidth={stroke} strokeLinecap="round" />
          <path d={fgPath} fill="none" stroke="#16a34a" strokeWidth={stroke} strokeLinecap="round" />
        </svg>
      </div>

      <div className="mt-2 text-center">
        <div className="text-3xl font-bold">{fmtGBP(current)}</div>
        <div className="text-sm text-gray-500">of {fmtGBP(target)}</div>
        <div className="mt-1 text-sm font-medium">{Math.round(pct * 100)}% achieved</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl border bg-gray-50 p-3">
          <div className="text-gray-500">Remaining</div>
          <div className="font-semibold">{fmtGBP(Math.max(0, target - current))}</div>
        </div>
        <div className="rounded-xl border bg-gray-50 p-3">
          <div className="text-gray-500">Pace (proj.)</div>
          <div className="font-semibold">{target > 0 ? `${Math.round((current / target) * 100)}%` : "—"}</div>
        </div>
      </div>
    </div>
  );
}

/* ===================== MAIN PAGE ===================== */
export default function DashboardPage() {
  // Amazon
  const [loading, setLoading] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  // Shopify
  const [shopifyLoading, setShopifyLoading] = useState(false);
  const [shopifyError, setShopifyError] = useState<string | null>(null);
  const [shopifyRows, setShopifyRows] = useState<any[]>([]);
  const shopify = shopifyRows?.[0] || null;

  const fetchAmazon = useCallback(async () => {
    setLoading(true);
    setUnauthorized(false);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
      if (!token) {
        setUnauthorized(true);
        throw new Error("No token found. Please sign in.");
      }
      const res = await fetch(API_URL, {
        method: "GET",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        credentials: "omit",
      });
      if (res.status === 401) {
        setUnauthorized(true);
        throw new Error("Unauthorized — token missing/invalid/expired.");
      }
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e?.message || "Failed to load data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchShopify = useCallback(async () => {
    setShopifyLoading(true);
    setShopifyError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
      if (!token) throw new Error("No token found. Please sign in.");
      const { monthName, year } = getISTYearMonth();
      const url = buildShopifyURL({ year, monthName });
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        credentials: "omit",
      });
      if (res.status === 401) throw new Error("Unauthorized — token missing/invalid/expired.");
      if (!res.ok) throw new Error(`Shopify request failed: ${res.status}`);
      const json = await res.json();
      const rows = Array.isArray(json?.data) ? json.data : [];
      setShopifyRows(rows);
    } catch (e: any) {
      setShopifyError(e?.message || "Failed to load Shopify data");
      setShopifyRows([]);
    } finally {
      setShopifyLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchAmazon(), fetchShopify()]);
  }, [fetchAmazon, fetchShopify]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // ---------- Amazon aliases ----------
  const cms = data?.current_month_summary || null;
  const cmp = data?.current_month_profit || null;

  // ---- derive UK (GBP) metrics safely from API shape ----
  const uk = useMemo(() => {
    const netSalesGBP = cms?.net_sales?.GBP != null ? Number(cms.net_sales.GBP) : null;
    const aspGBP = cms?.asp?.GBP != null ? Number(cms.asp.GBP) : null;

    let profitGBP: number | null = null;
    if (cmp?.profit && typeof cmp.profit === "object" && cmp.profit.GBP !== undefined) {
      profitGBP = Number(cmp.profit.GBP);
    } else if ((typeof cmp?.profit === "number" || typeof cmp?.profit === "string") && netSalesGBP !== null) {
      profitGBP = Number(cmp.profit);
    }

    let unitsGBP: number | null = null;
    if (cmp?.breakdown?.GBP?.quantity !== undefined) {
      unitsGBP = Number(cmp.breakdown.GBP.quantity);
    }

    let profitPctGBP: number | null = null;
    if (profitGBP !== null && netSalesGBP && !isNaN(netSalesGBP) && netSalesGBP !== 0) {
      profitPctGBP = (profitGBP / netSalesGBP) * 100;
    }

    return { unitsGBP, netSalesGBP, aspGBP, profitGBP, profitPctGBP };
  }, [cms, cmp]);

  // Amazon bar chart items
  const barsAmazon = useMemo(() => {
    const units = cms?.total_quantity ?? 0;
    const sales = uk.netSalesGBP ?? 0;
    const asp = uk.aspGBP ?? 0;
    const profit = uk.profitGBP ?? 0;
    const pcent = Number.isFinite(uk.profitPctGBP) ? (uk.profitPctGBP as number) : 0;

    return [
      { label: "Units", raw: Number(units) || 0, display: fmtNum(units) },
      { label: "Sales", raw: Number(sales) || 0, display: fmtGBP(sales) },
      { label: "ASP", raw: Number(asp) || 0, display: fmtGBP(asp) },
      { label: "Profit", raw: Number(profit) || 0, display: fmtGBP(profit) },
      { label: "Profit %", raw: Number(pcent) || 0, display: fmtPct(pcent) },
    ];
  }, [uk, cms]);

  // Shopify derivations
  const shopifyDeriv = useMemo(() => {
    if (!shopify) return null;
    const totalOrders = Number(shopify.total_orders ?? 0);
    const netSales = Number(shopify.net_sales ?? 0);
    const totalDiscounts = Number(shopify.total_discounts ?? 0);
    const totalTax = Number(shopify.total_tax ?? 0);
    const gross = Number(shopify.total_price ?? 0);
    const aov = totalOrders > 0 ? gross / totalOrders : 0;
    return { totalOrders, netSales, totalDiscounts, totalTax, gross, aov };
  }, [shopify]);

  // Combined actuals for gauge (GBP)
  const combinedGBP = useMemo(() => {
    const amazon = Number(uk.netSalesGBP ?? 0);
    const shopifyNet = Number(shopifyDeriv?.netSales ?? 0);
    const shopifyAsGBP = SHOPIFY_CCY === "GBP" ? shopifyNet : shopifyNet * SHOPIFY_TO_GBP;
    return amazon + shopifyAsGBP;
  }, [uk.netSalesGBP, shopifyDeriv?.netSales]);

  const anyLoading = loading || shopifyLoading;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Amazon &amp; Shopify Overview</h1>
        <button
          onClick={refreshAll}
          disabled={anyLoading}
          className={`rounded-md border px-3 py-1.5 text-sm shadow-sm active:scale-[.99] ${
            anyLoading ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400" : "border-gray-300 bg-white hover:bg-gray-50"
          }`}
          title="Refresh Amazon & Shopify"
        >
          {anyLoading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* ======================= GRID: 12 cols ======================= */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT 8: Amazon cards then Shopify cards */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Notices */}
          {unauthorized && (
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800">
              <div className="text-sm">You’re not signed in or your session expired. Please authenticate to load Amazon orders.</div>
              <a
                href={`${baseURL || ""}/auth/login`}
                className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-amber-100"
              >
                Sign in
              </a>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
              <span>⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* AMAZON — 5 boxes */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-2 text-sm font-medium text-gray-700">Amazon — Details (UK)</div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="text-sm text-gray-500">Units</div>
                <div className="mt-1 text-2xl font-semibold">
                  <ValueOrSkeleton loading={loading}>{fmtNum(cms?.total_quantity ?? 0)}</ValueOrSkeleton>
                </div>
              </div>
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="text-sm text-gray-500">Total Sales</div>
                <div className="mt-1 text-2xl font-semibold">
                  <ValueOrSkeleton loading={loading}>{fmtGBP(uk.netSalesGBP)}</ValueOrSkeleton>
                </div>
              </div>
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="text-sm text-gray-500">ASP</div>
                <div className="mt-1 text-2xl font-semibold">
                  <ValueOrSkeleton loading={loading}>{fmtGBP(uk.aspGBP)}</ValueOrSkeleton>
                </div>
              </div>
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="text-sm text-gray-500">Profit</div>
                <div className="mt-1 text-2xl font-semibold">
                  <ValueOrSkeleton loading={loading}>{fmtGBP(uk.profitGBP)}</ValueOrSkeleton>
                </div>
              </div>
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="text-sm text-gray-500">Profit %</div>
                <div className="mt-1 text-2xl font-semibold">
                  <ValueOrSkeleton loading={loading}>{fmtPct(uk.profitPctGBP)}</ValueOrSkeleton>
                </div>
              </div>
            </div>
          </div>

          {/* SHOPIFY — match 5-box layout */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-2 text-sm font-medium text-gray-700">Shopify — Details (IST)</div>

            {shopifyError && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
                <span>⚠️</span>
                <span className="text-sm">{shopifyError}</span>
              </div>
            )}

            {shopifyLoading && (
              <div className="space-y-2">
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
              </div>
            )}

            {!shopifyLoading && !shopifyError && shopify && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="text-sm text-gray-500">Units</div>
                  <div className="mt-1 text-2xl font-semibold">
                    <ValueOrSkeleton loading={shopifyLoading}>{fmtNum(shopify.total_orders)}</ValueOrSkeleton>
                  </div>
                </div>
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="text-sm text-gray-500">Net Sales</div>
                  <div className="mt-1 text-2xl font-semibold">
                    <ValueOrSkeleton loading={shopifyLoading}>{fmtShopify(shopify.net_sales)}</ValueOrSkeleton>
                  </div>
                </div>
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="text-sm text-gray-500">ASP</div>
                  <div className="mt-1 text-2xl font-semibold">
                    <ValueOrSkeleton loading={shopifyLoading}>
                      {(() => {
                        const orders = Number(shopify?.total_orders ?? 0);
                        const net = Number(shopify?.net_sales ?? 0);
                        if (!orders) return "—";
                        return fmtShopify(net / orders); // AOV used as ASP
                      })()}
                    </ValueOrSkeleton>
                  </div>
                </div>
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="text-sm text-gray-500">Discounts</div>
                  <div className="mt-1 text-2xl font-semibold">
                    <ValueOrSkeleton loading={shopifyLoading}>{fmtShopify(shopify.total_discounts ?? 0)}</ValueOrSkeleton>
                  </div>
                </div>
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="text-sm text-gray-500">Tax</div>
                  <div className="mt-1 text-2xl font-semibold">
                    <ValueOrSkeleton loading={shopifyLoading}>{fmtShopify(shopify.total_tax ?? 0)}</ValueOrSkeleton>
                  </div>
                </div>
              </div>
            )}

            {!shopifyLoading && !shopifyError && !shopify && (
              <div className="mt-2 text-sm text-gray-500">No Shopify data for the current month.</div>
            )}
          </div>
        </div>

        {/* RIGHT 4: Monthly Target Gauge */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-6">
            <MonthlyTargetGauge
              current={combinedGBP}
              target={MONTHLY_TARGET_GBP}
              subtitle={SHOPIFY_CCY === "GBP" ? "Amazon + Shopify (GBP)" : `Amazon + Shopify (${SHOPIFY_CCY}→GBP)`}
            />
          </div>
        </aside>
      </div>

      {/* ======================= FULL-WIDTH GRAPH BELOW EVERYTHING ======================= */}
      <div className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-3 text-sm text-gray-500">Amazon — Units, Sales, ASP, Profit, Profit %</div>
        <SimpleBarChart items={barsAmazon} />
      </div>
    </div>
  );
}
