"use client";

import { useMemo, useState } from "react";
import { formatKES } from "@/lib/format";

/** Reducing-balance monthly payment. */
export function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  if (months <= 0) return 0;
  if (annualRatePct <= 0) return principal / months;
  const r = annualRatePct / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

type Props = { vehiclePrice?: number; compact?: boolean };

export default function FinanceCalculator({ vehiclePrice = 10000000, compact = false }: Props) {
  const [price, setPrice] = useState(vehiclePrice);
  const [depositPct, setDepositPct] = useState(20);
  const [rate, setRate] = useState(16);
  const [months, setMonths] = useState(48);

  const result = useMemo(() => {
    const deposit = (price * depositPct) / 100;
    const principal = Math.max(price - deposit, 0);
    const monthly = monthlyPayment(principal, rate, months);
    const total = monthly * months + deposit;
    return { deposit, principal, monthly, total, interest: Math.max(total - price, 0) };
  }, [price, depositPct, rate, months]);

  return (
    <div className={`border border-white/[0.06] bg-onyx ${compact ? "p-6" : "p-8"}`}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="fc-price">Vehicle price (KES)</label>
          <input
            id="fc-price"
            type="number"
            min={0}
            step={50000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="field"
          />
        </div>
        <div>
          <label className="label" htmlFor="fc-deposit">Deposit: {depositPct}%</label>
          <input
            id="fc-deposit"
            type="range"
            min={10}
            max={80}
            step={5}
            value={depositPct}
            onChange={(e) => setDepositPct(Number(e.target.value))}
            className="mt-3 w-full accent-[#c9a962]"
          />
        </div>
        <div>
          <label className="label" htmlFor="fc-rate">Interest rate: {rate}% p.a.</label>
          <input
            id="fc-rate"
            type="range"
            min={8}
            max={25}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-3 w-full accent-[#c9a962]"
          />
        </div>
        <div>
          <label className="label" htmlFor="fc-term">Term: {months} months</label>
          <input
            id="fc-term"
            type="range"
            min={12}
            max={72}
            step={6}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="mt-3 w-full accent-[#c9a962]"
          />
        </div>
      </div>

      <div className="mt-7 border-t hairline pt-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label !mb-1">Estimated monthly payment</p>
            <p className="font-display text-4xl text-gold">{formatKES(Math.round(result.monthly))}</p>
            <p className="mt-1 text-xs text-sand">per month for {months} months</p>
          </div>
          <dl className="grid grid-cols-1 gap-3 border-t hairline pt-4 sm:grid-cols-3 sm:gap-6 sm:border-0 sm:pt-0 text-left sm:text-right">
            <div className="flex items-center justify-between sm:block">
              <dt className="label !mb-0 sm:!mb-1">Deposit</dt>
              <dd className="text-sm font-medium text-ivory">{formatKES(Math.round(result.deposit))}</dd>
            </div>
            <div className="flex items-center justify-between sm:block">
              <dt className="label !mb-0 sm:!mb-1">Financed</dt>
              <dd className="text-sm font-medium text-ivory">{formatKES(Math.round(result.principal))}</dd>
            </div>
            <div className="flex items-center justify-between sm:block">
              <dt className="label !mb-0 sm:!mb-1">Total cost</dt>
              <dd className="text-sm font-medium text-ivory">{formatKES(Math.round(result.total))}</dd>
            </div>
          </dl>
        </div>
        <p className="mt-5 text-[11px] leading-relaxed text-sand/70">
          Indicative only. Final terms depend on the financing partner, your profile and the
          vehicle. Our concierge will secure a formal quote within one business day.
        </p>
      </div>
    </div>
  );
}
