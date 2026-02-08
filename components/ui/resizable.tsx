'use client';

import { DragHandleDots2Icon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';

// Stub implementation - react-resizable-panels v4.6.2 has typing issues
// If you need to use this component, consider updating the package or using direct imports
const ResizablePanelGroup = ({ className, children, ...props }: any) => (
    <div
        className={cn(
            'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
            className,
        )}
        {...props}
    >
        {children}
    </div>
);

const ResizablePanel = ({ className, children, ...props }: any) => (
    <div className={cn('', className)} {...props}>
        {children}
    </div>
);

const ResizableHandle = ({ withHandle, className, ...props }: any) => (
    <div
        className={cn(
            'relative flex w-px items-center justify-center bg-border',
            className,
        )}
        {...props}
    >
        {withHandle && (
            <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
                <DragHandleDots2Icon className="h-2.5 w-2.5" />
            </div>
        )}
    </div>
);

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
