import { Loader2 } from 'lucide-react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface LoadingModalProps {
    isOpen?: boolean;
    message?: string;
}

export default function LoadingModal({
    isOpen = false,
    message = 'Loading...',
}: Readonly<LoadingModalProps>) {
    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-[400px] [&>button]:hidden">
                <DialogTitle className="sr-only">Loading</DialogTitle>
                <div className="flex flex-col items-center justify-center space-y-5 py-6">
                    <div className="relative">
                        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                            <Loader2 className="size-6 animate-spin text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2 text-center">
                        <p className="text-sm font-medium">{message}</p>
                        <p className="text-xs text-muted-foreground">
                            This may take a few seconds
                        </p>
                    </div>
                    <Progress className="h-1 w-full" />
                </div>
            </DialogContent>
        </Dialog>
    );
}
