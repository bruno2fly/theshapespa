"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "csp-infrared-sauna-dismissed";

/** Calendar date parts in America/New_York (Boston area). */
function getEasternDateParts(date = new Date()): {
  year: number;
  month: number;
  day: number;
} {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const parts = formatter.formatToParts(date);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);
  return { year, month, day };
}

/** Campaign window: Always active (no time limit) */
function isCampaignWindowActive(): boolean {
  return true;
}

export function InfraredSaunaModal() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isCampaignWindowActive()) return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* ignore */
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sauna-modal-title"
        >
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#8B4513] to-[#5C2E0F] rounded-3xl shadow-2xl overflow-hidden">
            {/* Background pattern (sauna wood texture effect) */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-400 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative p-8 sm:p-10 text-white text-center">
              {/* Close Button */}
              <button
                onClick={close}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white text-xl font-bold transition z-10"
                aria-label="Close popup"
              >
                ✕
              </button>

              {/* Headline */}
              <h2
                id="sauna-modal-title"
                className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight"
              >
                Infrared sauna:
                <br />
                <span className="text-xl sm:text-2xl font-normal">
                  more than just relaxation!
                </span>
              </h2>

              {/* Divider */}
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-orange-300 to-transparent mx-auto mb-6" />

              {/* Description */}
              <p className="text-lg leading-relaxed mb-8 text-gray-100">
                It helps with detoxification, relieves muscle pain, and improves circulation.
              </p>

              {/* Tagline */}
              <p className="text-base sm:text-lg mb-8 italic text-orange-200">
                Ready for a complete detox? Book now!
              </p>

              {/* CTA Button */}
              <a
                href="/menu"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#2D3436] font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition shadow-lg text-lg"
              >
                <span className="text-2xl">✨</span>
                BOOK NOW
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
