export function Ornament() {
  return (
    <div className="my-3 flex items-center justify-center gap-3 text-gold" aria-hidden>
      <span className="h-px w-10 bg-gold-soft" />
      <span className="text-[10px]">◆</span>
      <span className="h-px w-10 bg-gold-soft" />
    </div>
  );
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-semibold text-cocoa md:text-3xl">{title}</h2>
      <Ornament />
      {subtitle ? <p className="mx-auto max-w-2xl text-sm leading-8 text-muted">{subtitle}</p> : null}
    </div>
  );
}
