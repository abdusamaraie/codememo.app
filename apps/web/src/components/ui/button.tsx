import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-base font-bold ring-offset-background transition-[color,background-color,border-color,transform] duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Solid primary — no side borders, 6px depth bottom border
        default:
          "bg-primary text-primary-foreground border-0 shadow-[0_6px_0_var(--accent-700)] hover:bg-primary/90 active:translate-y-[6px] active:shadow-none active:translate-y-[6px]",
        // Red destructive — same 3D structure
        destructive:
          "bg-red-500 text-slate-100 border-0 border-b-[6px] border-b-[#b91c1c] hover:bg-destructive/90 active:translate-y-[6px] active:border-b-0",
        // Outlined — 2px all sides, 6px accent depth on bottom
        outline:
          "border-2 border-input border-b-[6px] border-b-[var(--accent-700)] bg-background hover:bg-accent hover:text-accent-foreground active:translate-y-[4px] active:border-b-2",
        // Secondary — muted bg, subtle purple border, accent depth
        secondary:
          "bg-secondary text-secondary-foreground border-2 border-primary/20 border-b-[6px] border-b-[var(--accent-700)] hover:bg-secondary/80 active:translate-y-[4px] active:border-b-2",
        // Ghost & link — no depth, keeps lightweight feel
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link:  "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm:      "h-8 px-3 py-1.5 text-sm",
        lg:      "h-12 px-5 py-2.5",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
