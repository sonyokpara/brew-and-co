/**
 * StatBand — full-bleed navy band of 3–4 figures. See specs/feature-stat-partner.md
 * Values must be real counts; never invent them.
 */
export function StatBand({
  stats,
  label = "Brew & Co. in numbers",
}: {
  stats: { value: string; label: string }[];
  label?: string;
}) {
  return (
    <section aria-label={label} className="border-y border-roast-600 bg-(image:--bg-stats)">
      <dl className="mx-auto grid w-full max-w-site grid-cols-2 gap-y-10 px-gutter py-14 sm:px-8 md:grid-cols-4 lg:px-12">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse items-center gap-1 text-center">
            <dt className="text-caption text-steam-300">{s.label}</dt>
            <dd className="font-display text-display font-bold text-foam-50 tabular-nums">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
