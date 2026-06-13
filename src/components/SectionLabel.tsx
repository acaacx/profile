interface SectionLabelProps {
  text: string;
  accent?: boolean;
}

export default function SectionLabel({ text, accent = false }: SectionLabelProps) {
  return (
    <p
      className="font-mono-label mb-4"
      style={{ color: accent ? '#7c6f64' : 'rgba(255,255,255,0.25)' }}
    >
      {text}
    </p>
  );
}
