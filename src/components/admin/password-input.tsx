"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";

import { formControlClassName } from "@/components/forms/form-field";
import { cn } from "@/lib/utils";

/** Password field with a show/hide button. */
export function PasswordInput({
  className,
  ...inputProps
}: Omit<ComponentProps<"input">, "type">) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...inputProps}
        type={isPasswordVisible ? "text" : "password"}
        className={cn(formControlClassName, "pr-12", className)}
      />
      <button
        type="button"
        onClick={() => setIsPasswordVisible((wasVisible) => !wasVisible)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-navy-700 hover:text-navy-950"
      >
        {isPasswordVisible ? (
          <EyeOff aria-hidden="true" className="size-5" />
        ) : (
          <Eye aria-hidden="true" className="size-5" />
        )}
        <span className="sr-only">
          {isPasswordVisible ? "Hide password" : "Show password"}
        </span>
      </button>
    </div>
  );
}
