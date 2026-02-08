// Local Font
import localFont from 'next/font/local';

export const NeueMontreal = localFont({
    src: [
        {
            path: './PPNeueMontreal/pp-neue-montreal-thin.woff2',
            weight: '100',
            style: 'normal',
        },
        {
            path: './PPNeueMontreal/pp-neue-montreal-book.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './PPNeueMontreal/pp-neue-montreal-medium.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: './PPNeueMontreal/pp-neue-montreal-bold.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: './PPNeueMontreal/pp-neue-montreal-semi-bold-italic.woff2',
            weight: '600',
            style: 'italic',
        },
    ],
    display: 'swap',
});
