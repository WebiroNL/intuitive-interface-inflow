// Helpers voor contract- en kortingsberekeningen (dag-precisie)

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
  endDate: Date | null; // exclusief: korting loopt tot (niet inclusief) deze dag
  discountedFee: number;
  percentage: number;
  months: number;
}

export interface ContractInputs {
  contract_start_date?: string | null;
  contract_duration?: string | null;
}

export interface ContractInfo {
  startDate: Date | null;
  endDate: Date | null; // exclusief
  durationMonths: number | null;
}

function parseDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addMonthsExact(d: Date, n: number): Date {
  // Voeg n maanden toe op dezelfde dag van de maand (clamp naar laatste dag indien nodig)
  const target = new Date(d.getFullYear(), d.getMonth() + n, d.getDate());
  // Clamp: als overflow (bv 31 jan + 1 maand -> 3 mrt) terugzetten naar laatste dag van bedoelde maand
  if (target.getDate() !== d.getDate()) {
    return new Date(target.getFullYear(), target.getMonth(), 0);
  }
  return target;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseDurationToMonths(s: string | null | undefined): number | null {
  if (!s) return null;
  const m = String(s).match(/(\d+)/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  // "12", "12 maanden", "1 jaar", "2 jaar"
  if (/jaar|jr|year/i.test(s)) return n * 12;
  return n;
}

export function getContractInfo(c: ContractInputs): ContractInfo {
  const startDate = parseDate(c.contract_start_date);
  const durationMonths = parseDurationToMonths(c.contract_duration);
  const endDate = startDate && durationMonths ? addMonthsExact(startDate, durationMonths) : null;
  return { startDate, endDate, durationMonths };
}

export function getDiscountInfo(c: DiscountInputs, refDate: Date = new Date()): DiscountInfo {
  const baseFee = Number(c.monthly_fee ?? 0);
  const months = Number(c.discount_months ?? 0);
  const percentage = Number(c.discount_percentage ?? 0);
  const hasDiscount = months > 0 && percentage > 0;

  const startDate = parseDate(c.discount_start_date) ?? parseDate(c.contract_start_date);
  const endDate = startDate && hasDiscount ? addMonthsExact(startDate, months) : null;

  const ref = startOfDay(refDate);
  const isActiveNow =
    hasDiscount &&
    !!startDate &&
    !!endDate &&
    ref.getTime() >= startDate.getTime() &&
    ref.getTime() < endDate.getTime();

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

export function formatDate(d: Date | null): string {
  if (!d) return "—";
  return `${d.getDate()} ${MONTHS_NL[d.getMonth()]} ${d.getFullYear()}`;
}

// laatste dag mét korting (endDate is exclusief)
export function discountLastDay(info: DiscountInfo): Date | null {
  if (!info.endDate) return null;
  return new Date(info.endDate.getFullYear(), info.endDate.getMonth(), info.endDate.getDate() - 1);
}

// laatste dag van het contract (endDate is exclusief)
export function contractLastDay(info: ContractInfo): Date | null {
  if (!info.endDate) return null;
  return new Date(info.endDate.getFullYear(), info.endDate.getMonth(), info.endDate.getDate() - 1);
}

// Backwards-compat: laatste maand mét korting
export function discountLastMonth(info: DiscountInfo): Date | null {
  return discountLastDay(info);
}
