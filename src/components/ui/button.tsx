import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] px-3 py-2 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200",
        destructive: "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200",
        outline: "border-2 border-input bg-white shadow-sm hover:bg-slate-50 hover:text-accent-foreground hover:border-slate-400 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground active:scale-95 transition-all",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-pm-blue text-white shadow-md hover:bg-pm-blue/90 hover:shadow-lg hover:shadow-pm-blue/30 active:shadow-sm focus-visible:ring-4 focus-visible:ring-pm-blue/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200",
        glass: "bg-white/10 text-white border border-white/20 shadow-sm hover:bg-white/20 backdrop-blur-sm active:scale-95 transition-all",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
