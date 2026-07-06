// /home/obed/Documents/Eny_consulting/frontend/components/Checkbox.tsx
"use client";

/**
 * Custom-styled checkbox for consent flows. Keeps a real <input type="checkbox">
 * for accessibility and form semantics, but hides its default appearance in
 * favor of a brass-accented box matching the rest of the token system.
 */
export function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-xs text-paper/70">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
          checked ? "border-brass bg-brass" : "border-white/20 bg-ink"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-none stroke-ink stroke-[2]">
            <path d="M2 6l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="leading-relaxed">{children}</span>
    </label>
  );
}