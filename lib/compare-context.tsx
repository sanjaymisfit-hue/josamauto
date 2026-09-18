"use client";

import {
    createContext,
    useContext,
    useSyncExternalStore,
    type ReactNode,
} from "react";

const STORAGE_KEY = "josam_compare_slugs";
const MAX_COMPARE = 4;

/* ── External store: localStorage-backed, SSR-safe ──────────
   useSyncExternalStore is the sanctioned way to subscribe to an
   external system — no setState-in-effect needed, no hydration
   mismatch (server snapshot is always []). */

let cached: string[] | null = null;
const listeners = new Set<() => void>();

/** Stable empty snapshot for SSR — must be cached, never recreated. */
const SERVER_SNAPSHOT: string[] = [];

function readSlugs(): string[] {
    if (cached) return cached;
    if (typeof window === "undefined") return SERVER_SNAPSHOT;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                cached = parsed
                    .filter((s): s is string => typeof s === "string")
                    .slice(0, MAX_COMPARE);
                return cached;
            }
        }
    } catch {
        // Ignore storage errors
    }
    cached = [];
    return cached;
}

function writeSlugs(next: string[]) {
    cached = next;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        // Ignore storage errors
    }
    listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
    listeners.add(cb);
    return () => {
        listeners.delete(cb);
    };
}

const getServerSnapshot = (): string[] => SERVER_SNAPSHOT;

interface CompareContextType {
    selectedSlugs: string[];
    addSlug: (slug: string) => void;
    removeSlug: (slug: string) => void;
    toggleSlug: (slug: string) => void;
    clearCompare: () => void;
    isCompared: (slug: string) => boolean;
    canAdd: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
    const selectedSlugs = useSyncExternalStore(
        subscribe,
        readSlugs,
        getServerSnapshot,
    );

    const addSlug = (slug: string) => {
        if (selectedSlugs.includes(slug) || selectedSlugs.length >= MAX_COMPARE)
            return;
        writeSlugs([...selectedSlugs, slug]);
    };

    const removeSlug = (slug: string) => {
        writeSlugs(selectedSlugs.filter((s) => s !== slug));
    };

    const toggleSlug = (slug: string) => {
        if (selectedSlugs.includes(slug)) {
            removeSlug(slug);
        } else {
            addSlug(slug);
        }
    };

    const clearCompare = () => {
        writeSlugs([]);
    };

    const isCompared = (slug: string) => selectedSlugs.includes(slug);
    const canAdd = selectedSlugs.length < MAX_COMPARE;

    return (
        <CompareContext.Provider
            value={{
                selectedSlugs,
                addSlug,
                removeSlug,
                toggleSlug,
                clearCompare,
                isCompared,
                canAdd,
            }}
        >
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error("useCompare must be used within a CompareProvider");
    }
    return context;
}
