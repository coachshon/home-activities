'use client';

const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
  '#6366f1', '#14b8a6', '#84cc16', '#e11d48',
];

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-7 h-7 rounded-full border-2 transition-transform
              ${value === color ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
