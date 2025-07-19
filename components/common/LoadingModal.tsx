import { Loader2 } from 'lucide-react';

import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function LoadingModal({
    isOpen = false,
    message = 'Loading...',
}) {
    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-lg font-medium text-center">{message}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
