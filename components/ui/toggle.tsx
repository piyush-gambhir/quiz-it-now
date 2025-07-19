// Temporarily disabled due to TypeScript issues
// 'use client';

// import * as TogglePrimitive from '@radix-ui/react-toggle';
// import { cva, type VariantProps } from 'class-variance-authority';
// import * as React from 'react';

// import { cn } from '@/lib/utils';

const toggleVariants = {
    variants: {
        variant: {
            default: 'bg-transparent',
            outline:
                'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
        },
        size: {
            default: 'h-9 px-3',
            sm: 'h-8 px-2',
            lg: 'h-10 px-3',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
};

// const Toggle = React.forwardRef<
//     React.ElementRef<typeof TogglePrimitive.Root>,
//     React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
//         VariantProps<typeof toggleVariants>
// >(({ className, ...props }, ref) => {
//     const variant = (props as any).variant || 'default';
//     const size = (props as any).size || 'default';

//     return (
//         <TogglePrimitive.Root
//             ref={ref}
//             className={cn(toggleVariants({ variant, size }), className)}
//             {...props}
//         />
//     );
// });

// Toggle.displayName = TogglePrimitive.Root.displayName;

// Placeholder exports to prevent import errors
export const Toggle = () => null;
export { toggleVariants };
