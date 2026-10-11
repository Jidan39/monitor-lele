import type { ReactNode } from 'react';
import type { StatusLevel } from '@/lib/types';
import { STATUS_CHIP, STATUS_DOT } from '@/lib/status';

interface StatusChipProps {
  /** null = belum ada data */
  level: StatusLevel | null;
  children: ReactNode;
}

export function StatusChip({ level, children }: StatusChipProps) {
  return (
    <span className={`chip ${level ? STATUS_CHIP[level] : 'chip-neutral'}`}>
      <span className={`h-1.5 w-1.5 ${level ? STATUS_DOT[level] : 'bg-muted/50'}`} />
      {children}
    </span>
  );
}
