"use client";

import { useCompare } from "@/lib/compare-context";
import { IconCheck, IconScale } from "@/components/icons";

type Props = {
    slug: string;
    variant?: "card" | "detail" | "outline";
    className?: string;
};

export default function CompareButton({ slug, variant = "card", className = "" }: Props) {
    const { isCompared, toggleSlug, canAdd } = useCompare();
    const compared = isCompared(slug);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSlug(slug);
    };

    if (variant === "card") {
        return (
            <button
                type="button"
                onClick={handleClick}
                disabled={!compared && !canAdd}
                title={compared ? "Remove from comparison" : canAdd ? "Compare vehicle" : "Comparison limit reached (max 4)"}
                aria-label={compared ? "Remove from comparison" : "Add to comparison"}
                className={`absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center border transition-all duration-300 ${compared
                        ? "border-gold bg-gold text-black shadow-lg"
                        : "border-white/20 bg-black/60 text-sand backdrop-blur-sm hover:border-gold/60 hover:text-gold"
                    } ${className}`}
            >
                {compared ? <IconCheck size={14} /> : <IconScale size={14} />}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={!compared && !canAdd}
            className={`btn-outline w-full gap-2 ${compared ? "!border-gold !bg-gold/15 !text-gold" : ""
                } ${className}`}
        >
            <IconScale size={15} />
            {compared ? "Added to Compare" : "Compare Vehicle"}
        </button>
    );
}
