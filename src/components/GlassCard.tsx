import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hoverAccent?: boolean;
}

export default function GlassCard({ children, className = '', style, hoverAccent = false }: GlassCardProps) {
  return (
    <div
      className={`glass-card ${hoverAccent ? 'accent-border' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
