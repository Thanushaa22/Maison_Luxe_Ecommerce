"use client";

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-white/60 text-xs tracking-widest uppercase mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full bg-white/5 backdrop-blur-sm border rounded-xl px-4 py-3.5
            text-white text-sm placeholder:text-white/30
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50
            ${icon ? "pl-12" : ""}
            ${error ? "border-red-500/50" : "border-white/10 hover:border-white/20"}
          `}
        />
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-1.5 tracking-wide">{error}</p>
      )}
    </div>
  );
}
