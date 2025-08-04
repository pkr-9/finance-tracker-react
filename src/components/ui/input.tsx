// creating a simple UI input component in React
import React from "react";
import { cn } from "../../utils/cn";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "primary" | "secondary" | "danger";
  inputSize?: "sm" | "md" | "lg";
}
export const Input: React.FC<InputProps> = ({
  className,
  variant = "default",
  inputSize = "md",
  ...props
}) => {
  const baseStyles =
    "block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantStyles = {
    default: "border-slate-300 focus:ring-slate-500",
    primary: "border-emerald-300 focus:ring-emerald-500",
    secondary: "border-slate-200 focus:ring-slate-400",
    danger: "border-red-300 focus:ring-red-500",
  };
  const sizeStyles = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  return (
    <input
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[inputSize],
        className
      )}
      {...props}
    />
  );
};
export default Input;
