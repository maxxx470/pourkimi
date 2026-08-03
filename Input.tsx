import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange?: (val: string) => void;
  error?: string;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input_${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="font-sans font-semibold text-[11px] text-muted uppercase tracking-[0.05em]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          w-full min-h-[44px] bg-white border border-[#E2E8F0] rounded-[12px] px-4 py-2.5 font-sans text-base md:text-[14px] text-[#1E293B] transition-all duration-200 outline-none
          placeholder:text-[#94A3B8] placeholder:text-base md:placeholder:text-[14px]
          ${error ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/15' : 'focus:border-[#94A3B8] focus:ring-2 focus:ring-[#4F46E5]/15'}
          ${disabled ? 'bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed' : ''}
        `}
        {...props}
      />
      {error && (
        <span className="font-sans text-[11px] text-lot-red font-medium">
          {error}
        </span>
      )}
    </div>
  );
};
export default Input;
