// Helper-functies voor het berekenen van actieve korting per maand

export interface DiscountInputs {
  monthly_fee: number | null | undefined;
  discount_months: number | null | undefined;
  discount_percentage: number | null | undefined;
  discount_start_date?: string | null;
  contract_start_date?: string | null;
}

export interface DiscountInfo {
  baseFee: number;
  hasDiscount: boolean;
  isActiveNow: boolean;
  startDate: Date | null;
  endDate: Date | null; // exclusief: korting loopt t/m maand vóór endDate
  discountedFee: number;
  percentage: number;
  months: number;
}

function parseDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

export function getDiscountInfo(c: DiscountInputs, refDate: Date = new Date()): DiscountInfo {
  const baseFee = Number(c.monthly_fee ?? 0);
  const months = Number(c.discount_months ?? 0);
  const percentage = Number(c.discount_percentage ?? 0);
  const hasDiscount = months > 0 && percentage > 0;

  const start = parseDate(c.discount_start_date) ?? parseDate(c.contract_start_date);
  const startDate = start ? startOfMonth(start) : null;
  const endDate = startDate && hasDiscount ? addMonths(startDate, months) : null;

  const refMonth = startOfMonth(refDate);
  const isActiveNow =
    hasDiscount &&
    !!startDate &&
    !!endDate &&
    refMonth.getTime() >= startDate.getTime() &&
    refMonth.getTime() < endDate.getTime();

  const discountedFee = hasDiscount ? baseFee * (1 - percentage / 100) : baseFee;

  return {
    baseFee,
    hasDiscount,
    isActiveNow,
    startDate,
    endDate,
    discountedFee,
    percentage,
    months,
  };
}

const MONTHS_NL = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

export function formatMonthYear(d: Date | null): string {
  if (!d) return "—";
  return `${MONTHS_NL[d.getMonth()]} ${d.getFullYear()}`;
}

// laatste maand mét korting (endDate is exclusief)
export function discountLastMonth(info: DiscountInfo): Date | null {
  if (!info.endDate) return null;
  return new Date(info.endDate.getFullYear(), info.endDate.getMonth() - 1, 1);
}
