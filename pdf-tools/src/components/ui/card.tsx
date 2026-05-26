import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn("rounded-xl bg-white shadow-md dark:bg-slate-800", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardProps) {
  return (
    <div className={cn("px-6 pt-6", className)}>{children}</div>
  );
}

export function CardContent({ className, children }: CardProps) {
  return (
    <div className={cn("px-6 py-4", className)}>{children}</div>
  );
}

export function CardFooter({ className, children }: CardProps) {
  return (
    <div className={cn("px-6 pb-6", className)}>{children}</div>
  );
}
