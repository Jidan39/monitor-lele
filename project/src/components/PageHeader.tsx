import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  desc: string;
  /** Gambar di kiri judul (path dari folder public) */
  image?: string;
  /** Aksi di sisi kanan header */
  children?: ReactNode;
}

export function PageHeader({ eyebrow, title, desc, image, children }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="flex min-w-0 items-center gap-4 sm:gap-6">
        {image && (
          <img src={image} alt="" className="h-16 w-16 shrink-0 object-contain sm:h-24 sm:w-24" />
        )}
        <div className="min-w-0">
          {eyebrow && <span className="chip mb-4">{eyebrow}</span>}
          <h1 className="font-display text-headline-sm text-ink sm:text-headline-md">{title}</h1>
          <p className="mt-2 text-body-md text-muted">{desc}</p>
        </div>
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </header>
  );
}

interface SectionProps {
  title: string;
  desc?: string;
  children: ReactNode;
}

/** Blok editorial: judul di kiri, konten di kanan, dipisah garis tipis */
export function Section({ title, desc, children }: SectionProps) {
  return (
    <section className="grid gap-6 border-t border-line py-10 animate-fade-in-up lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <div>
        <h2 className="font-display text-headline-sm text-ink">{title}</h2>
        {desc && <p className="mt-2 text-body-sm text-muted">{desc}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
