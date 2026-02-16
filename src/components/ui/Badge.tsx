'use client';

interface BadgeProps {
  label: string;
  color?: string;
}

export default function Badge({ label, color = '#3b82f6' }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}
