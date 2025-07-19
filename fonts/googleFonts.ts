// Google Fonts
import {
    Bebas_Neue,
    Inter as InterFont,
    Poppins as PoppinsFont,
    Roboto as RobotoFont,
} from 'next/font/google';

export const Inter = InterFont({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
export const Poppins = PoppinsFont({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
export const BebasNeue = Bebas_Neue({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-bebas-neue',
    weight: ['400'],
    style: ['normal'],
});
export const Roboto = RobotoFont({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
    weight: ['100', '300', '400', '500', '700', '900'],
});
