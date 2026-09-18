import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  linkHref,
  linkLabel,
  align = "left",
}: Props) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "text-center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <div
        className={`mt-3 flex flex-wrap items-end gap-x-8 gap-y-4 ${
          centered ? "flex-col items-center" : "justify-between"
        }`}
      >
        <h2 className="font-display max-w-2xl text-3xl text-ivory sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          {title}
        </h2>
        {linkHref && linkLabel && (
          <Link
            href={linkHref}
            className="group text-[11px] tracking-[0.25em] text-gold uppercase"
          >
            {linkLabel}
            <span className="mt-1 block h-px w-full origin-left scale-x-100 bg-gold/40 transition-transform duration-300 group-hover:scale-x-75" />
          </Link>
        )}
      </div>
      {description && (
        <p className={`mt-4 max-w-xl text-sm leading-relaxed text-sand ${centered ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </div>
  );
}
