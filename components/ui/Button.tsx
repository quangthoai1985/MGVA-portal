import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white' | 'outline-white';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  as?: any;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  as: Component = 'button',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 hover:shadow-lg focus:ring-brand-500 border border-transparent",
    secondary: "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg focus:ring-emerald-500 border border-transparent",
    outline: "bg-transparent text-brand-600 border-2 border-brand-500 hover:bg-brand-50 focus:ring-brand-500",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-brand-600",
    white: "bg-white text-brand-600 hover:bg-gray-50 hover:shadow-lg border border-transparent",
    "outline-white": "bg-transparent text-white border-2 border-white hover:bg-white/10 focus:ring-white/50"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <Component
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};